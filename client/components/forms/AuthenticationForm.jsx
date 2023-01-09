import { SyncOutlined } from "@ant-design/icons";

const AuthenticationForm = ({
  handleAuthSubmission,
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  secret,
  setSecret,
  loading,
  page,
  username,
  setUsername,
  desc,
  setDesc,
  profileUpdate,
}) => (
  <form onSubmit={handleAuthSubmission}>
    {profileUpdate && (
      <div className="form-group p-2">
        <small>
          <label>About</label>
        </small>
        <input
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          type="text"
          className="formControl"
          placeholder="Description about you"
        />
      </div>
    )}
    {page !== "login" && (
      <div className="form-group p-2">
        <small>
          <label>Full Name</label>
        </small>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          className="formControl"
          placeholder="Enter name"
        />
      </div>
    )}

    <div className="form-group p-2">
      <small>
        <label>Email address</label>
      </small>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        className="formControl"
        placeholder="Enter email"
        disabled={profileUpdate}
      />
    </div>
    {page !== "profile" ? (
      <div className="form-group p-2">
        <small>
          <label>Password</label>
        </small>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="formControl"
          placeholder="Enter Password"
        />
      </div>
    ) : (
      <div className="form-group p-2">
        <small>
          <label>Password *Optional*</label>
        </small>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="formControl"
          placeholder="Enter New Password"
        />
      </div>
    )}

    {page !== "login" && page !== "profile" && (
      <>
        <div className="form-group p-2">
          <small>
            <label>Secret</label>
          </small>
          <input
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            type="text"
            className="formControl"
            placeholder="Favourite Colour?"
          />
        </div>
      </>
    )}

    <div className="form-group p-2">
      <button
        disabled={
          profileUpdate
            ? loading
            : page === "login"
            ? !email || !password || loading
            : !name || !email || !secret || !password || loading
        }
        className="btn btn-primary verticalWrap-12"
      >
        {loading ? <SyncOutlined spin className="py-1" /> : "Submit"}
      </button>
    </div>
  </form>
);

export default AuthenticationForm;
