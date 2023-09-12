import React, { useContext, useState } from "react";
import { UserContext } from "../contextApi/UserContext";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import Places from "./Places";
import AccountNav from "../components/AccountNav";

const Profile = () => {
  const { ready, user, setUser } = useContext(UserContext);
  const [redirectHome, setRedirectHome] = useState(null);
  let { subpage } = useParams();
  if (subpage === undefined) {
    subpage = "profile";
  }

  async function logout() {
    await axios.post("/api/logout");

    setRedirectHome("/");
    setUser(null);
  }

  if (!ready) {
    return "Loading....";
  }

  if (ready && !user && !redirectHome) {
    return <Navigate to={"/login"} />;
  }

  if (redirectHome) {
    return <Navigate to={redirectHome} />;
  }
  return (
    <div>
      <AccountNav />
      {subpage === "profile" && (
        <div className="text-center max-w-lg mx-auto">
          Logged in as {user.name} ({user.email})<br />
          <button onClick={logout} className="primary max-w-sm mt-2">
            Logout
          </button>
        </div>
      )}
      {subpage === "places" && <Places />}
    </div>
  );
};

export default Profile;
