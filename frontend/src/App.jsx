import { Link, NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { AUTH_STORAGE_KEYS } from "./utils/constants";
import { logout } from "./services/authService";
import AIChatbox from "./components/layout/AIChatbox";

function App() {
  const location = useLocation();
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem(AUTH_STORAGE_KEYS.token);
    const email = localStorage.getItem(AUTH_STORAGE_KEYS.email);
    const displayName = localStorage.getItem(AUTH_STORAGE_KEYS.displayName);

    return {
      token: token || "",
      email: email || "",
      displayName: displayName || email || "",
    };
  });

  const isLoggedIn = Boolean(auth.token);
  const userLabel = auth.displayName || auth.email || "Nguoi dung";
  const isPublicRoute = ["/", "/login", "/register", "/forgot-password", "/reset-password"].includes(location.pathname);

  function handleLogout() {
    logout();
    setAuth({ token: "", email: "", displayName: "" });
  }

  if (isPublicRoute) {
    return (
      <div className="public-shell">
        <header className="topbar">
          <Link className="brand" to="/">
            <span className="brand-mark">TF</span>
            <span className="brand-text">TaskFlow</span>
          </Link>

          <nav className="topbar-actions">
            {isLoggedIn ? (
              <>
                <Link className="ghost-button link-button" to="/workspace">
                  Workspace
                </Link>
                <button className="primary-button" type="button" onClick={handleLogout}>
                  Dang xuat
                </button>
              </>
            ) : (
              <>
                <Link className="ghost-button link-button" to="/login">
                  Dang nhap
                </Link>
                <Link className="primary-button link-button" to="/register">
                  Dang ky
                </Link>
              </>
            )}
          </nav>
        </header>

        <main className="public-content">
          <AppRoutes auth={auth} setAuth={setAuth} onLogout={handleLogout} userLabel={userLabel} />
        </main>
        <AIChatbox isLoggedIn={isLoggedIn} userLabel={userLabel} />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-mark" aria-hidden="true">
          TM
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/workspace">Trang chu</NavLink>
          <NavLink to="/tasks">Quan ly task</NavLink>
        </nav>
      </aside>

      <main className="content">
        <AppRoutes auth={auth} setAuth={setAuth} onLogout={handleLogout} userLabel={userLabel} />
      </main>
      <AIChatbox isLoggedIn={isLoggedIn} userLabel={userLabel} />
    </div>
  );
}

export default App;
