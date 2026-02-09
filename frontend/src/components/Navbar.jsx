import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SignInModal from "./SignInModal";
import "./navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isAuthed, setIsAuthed] = useState(!!localStorage.getItem("token"));
  const [username, setUsername] = useState(localStorage.getItem("username") || "User");

  const navigate = useNavigate();
  const location = useLocation();

  // Каждый раз когда меняется маршрут — перечитываем localStorage
  // (после логина/регистрации ты обычно делаешь navigate, значит Navbar обновится)
  useEffect(() => {
    setIsAuthed(!!localStorage.getItem("token"));
    setUsername(localStorage.getItem("username") || "User");
  }, [location.pathname]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsAuthed(false);
    setUsername("User");
    navigate("/");
  };

  return (
    <header className="navWrap">
      <div className="container">
        <div className="nav glass">
          <Link className="brand" to="/">
            <span className="logoDot" />
            <div className="brandText">
              <div className="brandName">MovieHub</div>
              <div className="brandSub">ratings • trailers • reviews</div>
            </div>
          </Link>

          <div className="navRight">
            <Link className="navLink" to="/">Home</Link>

            {isAuthed ? (
              <>
                <Link className="navLink" to="/profile">Profile</Link>
                <button className="btn" onClick={logout}>Logout</button>
              </>
            ) : (
              <>
                <Link className="navLink" to="/login">Login</Link>
                <Link className="navLink" to="/register">Register</Link>
                <button className="btn btnPrimary" onClick={() => setOpen(true)}>
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <SignInModal
        open={open}
        onClose={() => setOpen(false)}
        onAuth={() => {
          // если SignInModal залогинил — обновим navbar сразу
          setIsAuthed(true);
          setUsername(localStorage.getItem("username") || "User");
          setOpen(false);
          navigate("/profile");
        }}
      />
    </header>
  );
}
