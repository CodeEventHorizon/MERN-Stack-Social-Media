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

// Ant Design UI library
import { Modal } from "antd";

// Register Page
const Register = () => {
  // string name;
  const [name, setName] = useState("");
  // string email;
  const [email, setEmail] = useState("");
  // string password;
  const [password, setPassword] = useState("");
  // string secret;
  const [secret, setSecret] = useState("");
  // boolean ok;
  const [ok, setOk] = useState(false);
  // boolean loading;
  const [loading, setLoading] = useState(false);

  // User authentication state
  const [state] = useContext(UserContext);

  // router
  const router = useRouter();

  const handleAuthSubmission = async (e) => {
    // e.preventDefault prevents page from refreshing, which gives the feeling of real-time rendering
    e.preventDefault();
    try {
      setLoading(true);
      // send name, email, password, secret to server to register
      const { data } = await axios.post(`/register`, {
        name,
        email,
        password,
        secret,
      });

      // Error handling
      if (data.error) {
        toast.error("Couldn't process the data to register!");
        setLoading(false);
      } else {
        // Success
        setName("");
        setEmail("");
        setPassword("");
        setSecret("");
        setOk(data.ok);
        setLoading(false);
      }
    } catch (err) {
      toast.error("Failed to register!");
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
      <h1>Register</h1>
      <div>
        <AuthenticationForm
          handleAuthSubmission={handleAuthSubmission}
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          secret={secret}
          setSecret={setSecret}
          loading={loading}
        />
      </div>

      <div>
        <Modal
          title="Successful registration!"
          footer={null}
          visible={ok}
          onCancel={() => setOk(false)}
        >
          <p>Welcome!</p>
          <Link href="/login">
            <a className="btn btn-primary">Login</a>
          </Link>
        </Modal>
      </div>
    </div>
  );
};

export default Register;
