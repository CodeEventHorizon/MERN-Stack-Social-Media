// Next API Reference
import Link from "next/link";
import { useRouter } from "next/router";

// React Hooks
import { useState, useContext } from "react";

// Axios
import axios from "axios";

// Custom Components
import AuthenticationForm from "../components/forms/AuthenticationForm";
import { UserContext } from "../context";

// Toast Notification
import { toast } from "react-toastify";

// Login Page
const Login = () => {
  // string email;
  const [email, setEmail] = useState("");
  // string password;
  const [password, setPassword] = useState("");
  // boolean loading;
  const [loading, setLoading] = useState(false);

  // User authentication state
  const [state, setState] = useContext(UserContext);

  // router
  const router = useRouter();

  const handleAuthSubmission = async (e) => {
    // e.preventDefault prevents page from refreshing, which gives the feeling of real-time rendering
    e.preventDefault();
    try {
      setLoading(true);
      // send email and password to the server to check for credentials
      const { data } = await axios.post(`/login`, {
        email,
        password,
      });

      // Error handling
      if (data.error) {
        toast.error("Couldn't identify credentials!");
        setLoading(false);
      } else {
        // Updating context user state
        setState({
          user: data.user,
          token: data.token,
        });
        // Saving user state to Application localStorage
        // following keeps the users credentials in browser's local storage
        // to login automatically even after closing the browser
        window.localStorage.setItem("auth", JSON.stringify(data));

        setLoading(false);
        // direct user to Newsfeed
        router.push("/user/postsPage");
      }
    } catch (err) {
      toast.error("Failed to login!!");
      setLoading(false);
    }
  };

  // if user is logged in, direct him to Newsfeed
  if (state && state.token) router.push("/user/postsPage");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <h1 style={{ justifyContent: "center", display: "flex" }}>Login</h1>
      <div>
        <AuthenticationForm
          handleAuthSubmission={handleAuthSubmission}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          loading={loading}
          page="login"
        />
      </div>
      <div style={{ justifyContent: "center", display: "flex" }}>
        <Link href="/forgot">
          <a>Forgot password?</a>
        </Link>
      </div>
    </div>
  );
};

export default Login;
