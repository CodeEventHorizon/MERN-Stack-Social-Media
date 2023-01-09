// React hooks
import { useState, useContext } from "react";

// Axios
import axios from "axios";

// Custom Components
import { UserContext } from "../context";
import People from "../components/cards/People";

// Toast Notification
import { toast } from "react-toastify";

const Search = () => {
  // user authentication state
  const [state, setState] = useContext(UserContext);
  // string query;
  const [query, setQuery] = useState("");
  // Array<String> result;
  const [result, setResult] = useState([]);

  const getAllUsers = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(`/check-all-users?search=${query}`);
      setResult(data);
    } catch (err) {
      toast.error("Failed to get all users!");
    }
  };

  const followUser = async (user) => {
    try {
      const { data } = await axios.put("/follow-user", { _id: user._id });
      // reset localStorage, remember the token
      let authentication = JSON.parse(localStorage.getItem("auth"));
      authentication.user = data;
      localStorage.setItem("auth", JSON.stringify(authentication));
      // reset user state
      setState({ ...state, user: data });
      let userFilter = result.filter((p) => p._id !== user._id);
      setResult(userFilter);
      toast.success(`You have followed ${user.name}`);
    } catch (err) {
      toast.error("Failed to followe the user!");
    }
  };

  const unfollowUser = async (user) => {
    try {
      const { data } = await axios.put("/unfollow-user", { _id: user._id });
      //update local storage, update user, keep token
      let auth = JSON.parse(localStorage.getItem("auth"));
      auth.user = data;
      localStorage.setItem("auth", JSON.stringify(auth));
      // update context
      setState({ ...state, user: data });
      // update people state
      let filtered = result.filter((p) => p._id !== user._id);
      setResult(filtered);
      toast.error(`Unfollowed ${user.name}`);
    } catch (err) {
      toast.error("Failed to unfollow the user!");
    }
  };

  return (
    <>
      <form className="form-inline horizontalWrap" onSubmit={getAllUsers}>
        <div className="verticalWrap-8">
          <input
            onChange={(e) => {
              setQuery(e.target.value);
              setResult([]);
            }}
            value={query}
            className="formControl"
            type="search"
            placeholder="Search..."
          />
        </div>
        <div className="verticalWrap-4">
          <button className="btn btn-outline-primary verticalWrap-12" type="submit">
            Search
          </button>
        </div>
      </form>

      {result && (
        <People
          users={result}
          followUser={followUser}
          unfollowUser={unfollowUser}
        />
      )}
    </>
  );
};

export default Search;
