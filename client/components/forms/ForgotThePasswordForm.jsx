import { SyncOutlined } from "@ant-design/icons";

const ForgotThePasswordForm = ({
  handleForgotPasswordSubmission,
  page,
  email,
  setEmail,
  newPassword,
  setNewPassword,
  secret,
  setSecret,
  loading,
}) => (
  <form onSubmit={handleForgotPasswordSubmission}>
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
      />
    </div>

    <div className="form-group p-2">
      <small>
        <label>New password</label>
      </small>
      <input
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        type="password"
        className="formControl"
        placeholder="Enter new password"
      />
    </div>
    {page !== "login" && (
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
            placeholder="Write your answer here"
          />
        </div>
      </>
    )}

    <div className="form-group p-2">
      <button
        disabled={!email || !newPassword || !secret || loading}
        className="btn btn-primary verticalWrap-12"
      >
        {loading ? <SyncOutlined spin className="py-1" /> : "Submit"}
      </button>
    </div>
  </form>
);

export default ForgotThePasswordForm;
