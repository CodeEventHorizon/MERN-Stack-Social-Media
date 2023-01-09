// Next API Referece
import Link from "next/link";

// React hooks
import { useState, useContext, useEffect } from "react";

// Axios
import axios from "axios";

// Custom Components
import AuthenticationForm from "../../../components/forms/AuthenticationForm";
import { UserContext } from "../../../context";

// Ant Design UI library
import { Modal } from "antd";

// Toast Notification
import { toast } from "react-toastify";

const ProfileUpdate = () => {
  // User authentication state
  const [state, setState] = useContext(UserContext);

  // string username;
  const [username, setUsername] = useState("");
  // string desc;
  const [desc, setDesc] = useState("");
  // string name;
  const [name, setName] = useState("");
  // string email;
  const [email, setEmail] = useState("");
  // string password;
  const [password, setPassword] = useState("");
  // string secret;
  const [secret, setSecret] = useState("");
  // boolean view;
  const [view, setView] = useState(false);
  // boolean dataLoading;
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    if (state && state.user) {
      if (state.user.username) setUsername(state.user.username);
      if (state.user.about) setDesc(state.user.about);
      if (state.user.name) setName(state.user.name);
      if (state.user.email) setEmail(state.user.email);
    }
  }, [state && state.user]);

  const handleAuthSubmission = async (e) => {
    // e.preventDefault prevents page from refreshing, which gives the feeling of real-time rendering
    e.preventDefault();
    try {
      setDataLoading(true);
      const { data } = await axios.put(`/profile-change`, {
        username,
        about: desc,
        name,
        email,
        password,
        secret,
      });
      if (data.error) {
        toast.error(data.error);
        setDataLoading(false);
      } else {
        // reset localStorage, remember user token
        let authentication = JSON.parse(localStorage.getItem("auth"));
        authentication.user = data;
        localStorage.setItem("auth", JSON.stringify(authentication));
        // reset state
        setState({ ...state, user: data });
        setView(true);
        setDataLoading(false);
      }
    } catch (err) {
      toast.error("Failed to reset credentials!");
      setDataLoading(false);
    }
  };

  return (
    <div className="boxfluid">
      <div className="horizontalWrap py-5 textWhite">
        <div className="verticalWrap text-center">
          <h1>Profile</h1>
          {state && state.user && (
            <div>
              <Link href={`/user/${state.user.username}`}>
                <a>{state.user.name}</a>
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="horizontalWrap py-5">
        <div className="verticalWrap-md-6 offset-md-3">
          <AuthenticationForm
            profileUpdate={true}
            username={username}
            setUsername={setUsername}
            desc={desc}
            setDesc={setDesc}
            handleAuthSubmission={handleAuthSubmission}
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            secret={secret}
            setSecret={setSecret}
            loading={dataLoading}
            page="profile"
          />
        </div>
      </div>

      <div className="horizontalWrap">
        <div className="verticalWrap">
          <Modal
            title="Congratulations!"
            visible={view}
            onCancel={() => setView(false)}
            footer={null}
          >
            <p>You have successfully updated your profile.</p>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdate;
