// Next API Reference
import { useRouter } from "next/router";
import Link from "next/link";

// React Hooks
import { useState, useContext } from "react";

// Axios
import axios from "axios";

// Custom Components
import ForgotThePasswordForm from "../components/forms/ForgotThePasswordForm";
import { UserContext } from "../context";

// Toast Notification
import { toast } from "react-toastify";

// Ant Design UI library
import { Modal } from "antd";

// Forgot password page
const ForgotPassword = () => {
  // string email;
  const [email, setEmail] = useState("");
  // string newPassword;
  const [newPassword, setNewPassword] = useState("");
  // string secrect
  const [secret, setSecret] = useState("");
  // boolean ok;
  const [ok, setOk] = useState(false);
  // boolean loading;
  const [loading, setLoading] = useState(false);

  // User authentication state
  const [state] = useContext(UserContext);

  // router
  const router = useRouter();

  const handleForgotPasswordSubmission = async (e) => {
    // e.preventDefault prevents page from refreshing, which gives the feeling of real-time rendering
    e.preventDefault();
    try {
      setLoading(true);
      // send email, newPassword and secret to the server
      const { data } = await axios.post(`/forgot-password`, {
        email,
        newPassword,
        secret,
      });

      // Error handling
      if (data.error) {
        toast.error("Submitted credentials are wrong!");
        setLoading(false);
      }
      // Success
      else {
        //if (data.success)
        setEmail("");
        setNewPassword("");
        setSecret("");
        setOk(true);
        setLoading(false);
      }
    } catch (err) {
      toast.error("Couldn't reset the password!");
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
      <h1>Reset Password</h1>
      <div>
        <ForgotThePasswordForm
          handleForgotPasswordSubmission={handleForgotPasswordSubmission}
          email={email}
          setEmail={setEmail}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          secret={secret}
          setSecret={setSecret}
          loading={loading}
        />
      </div>

      <div>
        <Modal
          title="Successfully changed the password!"
          visible={ok}
          onCancel={() => setOk(false)}
          footer={null}
        >
          <p>Your credentials have changed</p>
          <Link href="/login">
            <a className="btn btn-primary">Login</a>
          </Link>
        </Modal>
      </div>
    </div>
  );
};

export default ForgotPassword;
