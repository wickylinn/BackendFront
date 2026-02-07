import { useState } from "react";
import API from "../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      setLoading(true);
      const res = await API.post("/auth/login", { email: email.trim(), password });
      localStorage.setItem("token", res.data.token);
      if (res.data?.user?.username) localStorage.setItem("username", res.data.user.username);
      window.location.href = "/";
    } catch (e2) {
      setErr(e2?.response?.data?.error || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass" style={{ padding: 18, borderRadius: 22, maxWidth: 520, margin: "0 auto" }}>
      <h1 style={{ margin: 0 }}>Login</h1>
      <p className="p">Welcome back.</p>

      <form onSubmit={login} style={{ marginTop: 14, display: "grid", gap: 12 }}>
        <input className="input" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="input" placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        {err && <div style={{ color: "rgba(239,68,68,.95)", fontSize: 13 }}>{err}</div>}

        <button className="btn btnPrimary" disabled={loading} type="submit">
          {loading ? "Logging in…" : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
