import { useEffect, useState } from "react";
import API from "../services/api";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/users/profile")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="glass" style={{ padding: 18, borderRadius: 22 }}>Loading…</div>;

  if (!user)
    return (
      <div className="glass" style={{ padding: 18, borderRadius: 22 }}>
        <h2 style={{ margin: 0 }}>Please login</h2>
        <p className="p">You need an account to view your profile.</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
          <a className="btn btnPrimary" href="/login">Login</a>
          <a className="btn" href="/register">Register</a>
        </div>
      </div>
    );

  return (
    <div className="glass" style={{ padding: 18, borderRadius: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ margin: 0 }}>Profile</h1>
          <p className="p">Account info</p>
        </div>
        <span className="badge">{user.isAdmin ? "Admin" : "User"}</span>
      </div>

      <hr className="hr" />

      <div style={{ display: "grid", gap: 10, maxWidth: 520 }}>
        <div><b>Username:</b> {user.username}</div>
        <div><b>Email:</b> {user.email}</div>
      </div>
    </div>
  );
};

export default Profile;
