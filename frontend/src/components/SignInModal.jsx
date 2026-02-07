import { useEffect, useState } from "react";
import API from "../services/api";
import "./modal.css";

export default function SignInModal({ open, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    setErr("");
  }, [open]);

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!email.trim() || !password) {
      setErr("Email and password are required.");
      return;
    }

    try {
      setLoading(true);
      const res = await API.post("/auth/login", { email: email.trim(), password });
      localStorage.setItem("token", res.data.token);

      // если бэк возвращает username — сохраним
      if (res.data?.user?.username) localStorage.setItem("username", res.data.user.username);

      onClose?.();
      window.location.href = "/";
    } catch (e2) {
      setErr(e2?.response?.data?.error || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modalBack" onMouseDown={onClose}>
      <div className="modal glass" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modalTop">
          <div>
            <div className="modalTitle">Sign in</div>
            <div className="modalSub">Access your profile & reviews</div>
          </div>
          <button className="btn" onClick={onClose} type="button">
            ✕
          </button>
        </div>

        <form onSubmit={submit} className="modalForm">
          <label className="label">
            Email
            <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>

          <label className="label">
            Password
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>

          {err && <div style={{ color: "rgba(239,68,68,.95)", fontSize: 13 }}>{err}</div>}

          <button className="btn btnPrimary" type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
