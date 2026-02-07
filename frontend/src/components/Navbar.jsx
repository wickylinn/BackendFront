import { useMemo, useState } from "react";
import SignInModal from "./SignInModal";
import "./navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const isAuthed = useMemo(() => {
    return Boolean(localStorage.getItem("token"));
  }, []);

  const username = useMemo(() => {
    return localStorage.getItem("username") || "User";
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "/";
  };

  return (
    <header className="navWrap">
      <div className="container">
        <div className="nav glass">
          <a className="brand" href="/">
            <span className="logoDot" />
            <div className="brandText">
              <div className="brandName">MovieHub</div>
              <div className="brandSub">ratings • trailers • reviews</div>
            </div>
          </a>

          <div className="navRight">
            <a className="navLink" href="/">Home</a>

            {isAuthed ? (
              <>
                <a className="navLink" href="/profile">Profile</a>
                <button className="btn" onClick={logout}>Logout</button>
              </>
            ) : (

              <>
                <a className="navLink" href="/login">Login</a>
                <a className="navLink" href="/register">Register</a>
                <button className="btn btnPrimary" onClick={() => setOpen(true)}>
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <SignInModal open={open} onClose={() => setOpen(false)} />
    </header>
  );
}
