import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const Register = ({ setUser }) => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const register = async (e) => {
    e.preventDefault();
    setErr("");

    const u = username.trim();
    const em = email.trim();

    if (!u) return setErr("Username is required.");
    if (!em) return setErr("Email is required.");
    if (!password) return setErr("Password is required.");

    try {
      setLoading(true);
      const res = await API.post("/auth/register", { username: u, email: em, password });

      // лучше хранить user целиком
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // если ты используешь глобальный user в App.jsx — обнови его
      if (setUser) setUser(res.data.user);

      // SPA-переход без перезагрузки
      navigate("/profile");
    } catch (e2) {
      setErr(e2?.response?.data?.error || "Register failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass" style={{ padding: 18, borderRadius: 22, maxWidth: 520, margin: "0 auto" }}>
      <h1 style={{ margin: 0 }}>Register</h1>
      <p className="p">Create your account in seconds.</p>

      <form onSubmit={register} style={{ marginTop: 14, display: "grid", gap: 12 }}>
        <input className="input" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input className="input" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="input" placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        {err && <div style={{ color: "rgba(239,68,68,.95)", fontSize: 13 }}>{err}</div>}

        <button className="btn btnPrimary" disabled={loading} type="submit">
          {loading ? "Creating…" : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
