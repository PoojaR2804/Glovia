import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [socialMessage, setSocialMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      /*
       * Registration creates the username from the email.
       * Example:
       * poojaramadhas@gmail.com
       * becomes
       * poojaramadhas
       *
       * So if the user enters an email here,
       * convert it to the username automatically.
       */
      let loginUsername = username.trim();

      if (loginUsername.includes("@")) {
        loginUsername = loginUsername.split("@")[0];
      }

      const response = await fetch(
        "https://glovia-backend-8zxd.onrender.com/api/login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: loginUsername,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.non_field_errors?.[0] ||
          "Invalid username/email or password."
        );

        setLoading(false);
        return;
      }

      // Save Django authentication token
      localStorage.setItem("gloviaToken", data.token);

      // Keep existing login status
      localStorage.setItem("gloviaLoggedIn", "true");

      setLoading(false);

      navigate("/home");

    } catch (error) {
      console.error("Login error:", error);

      setError(
        "Unable to connect to the server. Please make sure Django is running."
      );

      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* LEFT SHOWCASE */}

      <div className="login-showcase">

        <div className="showcase-content">

          <h1 className="brand-name">GLOVIA</h1>

          <div className="brand-decoration">
            <span></span>
            <b>♡</b>
            <span></span>
          </div>

          <p className="brand-tagline">
            Glow Begins With You ✨
          </p>

          <div className="product-photo">

            <img
              src="/images/skincare-products.jpg"
              alt="GLOVIA skincare products"
            />

          </div>

        </div>

      </div>

      {/* LOGIN SECTION */}

      <div className="login-section">

        <div className="login-card">

          <div className="welcome-icon">
            ♡
          </div>

          <h2>Welcome Back</h2>

          <p className="login-subtitle">
            Login to continue your skincare journey
          </p>

          <form onSubmit={handleLogin}>

            {/* USERNAME / EMAIL */}

            <label>Username or Email</label>

            <div className="input-wrapper">

              <span className="input-icon">
                ✉
              </span>

              <input
                type="text"
                placeholder="Enter your username or email"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                required
                autoComplete="username"
              />

            </div>

            {/* PASSWORD */}

            <label>Password</label>

            <div className="input-wrapper">

              <span className="input-icon">
                🔒
              </span>

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
                autoComplete="current-password"
              />

              <button
                type="button"
                className="eye-btn"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? "◉" : "◌"}
              </button>

            </div>

            {/* FORGOT PASSWORD */}

            <div className="forgot-password">

              <Link to="/forgot-password">
                Forgot Password?
              </Link>

            </div>

            {/* ERROR */}

            {error && (
              <p
                style={{
                  color: "red",
                  marginBottom: "12px",
                  fontSize: "14px",
                }}
              >
                {error}
              </p>
            )}

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          {/* DIVIDER */}

          <div className="divider">

            <span></span>

            <p>or</p>

            <span></span>

          </div>

          {/* SOCIAL LOGIN */}

          <div className="social-login">

            {/* GOOGLE */}

            <button
              type="button"
              onClick={() =>
                setSocialMessage("Google")
              }
              title="Continue with Google"
            >

              <svg
                viewBox="0 0 24 24"
                width="21"
                height="21"
              >

                <path
                  fill="#4285F4"
                  d="M21.35 12.27c0-.71-.06-1.39-.18-2.05H12v3.88h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.22z"
                />

                <path
                  fill="#34A853"
                  d="M12 21.6c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.93-3.31.93-2.55 0-4.71-1.72-5.49-4.04H3.26v2.53A9.74 9.74 0 0 0 12 21.6z"
                />

                <path
                  fill="#FBBC05"
                  d="M6.51 13.68A5.86 5.86 0 0 1 6.2 12c0-.58.1-1.15.31-1.68V7.79H3.26A9.73 9.73 0 0 0 2.2 12c0 1.57.38 3.05 1.06 4.21l3.25-2.53z"
                />

                <path
                  fill="#EA4335"
                  d="M12 6.28c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.83 3.37 14.63 2.4 12 2.4a9.74 9.74 0 0 0-8.74 5.39l3.25 2.53c.78-2.32 2.94-4.04 5.49-4.04z"
                />

              </svg>

            </button>

            {/* FACEBOOK */}

            <button
              type="button"
              onClick={() =>
                setSocialMessage("Facebook")
              }
              title="Continue with Facebook"
            >

              <svg
                viewBox="0 0 24 24"
                width="21"
                height="21"
              >

                <path
                  fill="#1877F2"
                  d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.02 4.39 11 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.03 1.79-4.7 4.58-4.7 1.33 0 2.72.24 2.72.24v3.01h-1.53c-1.51 0-1.98.94-1.98 1.9v2.21h3.37l-.54 3.49h-2.83V24C19.61 23.07 24 18.09 24 12.07z"
                />

              </svg>

            </button>

            {/* APPLE */}

            <button
              type="button"
              onClick={() =>
                setSocialMessage("Apple")
              }
              title="Continue with Apple"
            >

              <svg
                viewBox="0 0 24 24"
                width="21"
                height="21"
              >

                <path
                  fill="#000"
                  d="M17.05 12.54c-.02-2.02 1.65-2.99 1.72-3.04a3.7 3.7 0 0 0-2.91-1.57c-1.23-.13-2.42.74-3.05.74-.64 0-1.62-.72-2.66-.7a3.93 3.93 0 0 0-3.3 2.01c-1.42 2.46-.36 6.08 1 8.07.66.98 1.44 2.07 2.47 2.03.99-.04 1.37-.64 2.57-.64 1.2 0 1.54.64 2.59.62 1.08-.02 1.76-.98 2.42-1.96a8.03 8.03 0 0 0 1.11-2.28 3.53 3.53 0 0 1-1.96-3.28z"
                />

                <path
                  fill="#000"
                  d="M15.04 6.62a3.47 3.47 0 0 0 .8-2.49 3.57 3.57 0 0 0-.82 2.39 2.94 2.94 0 0 0 2.32-1.09z"
                />

              </svg>

            </button>

          </div>

          {/* REGISTER */}

          <p className="register-text">

            Don't have an account?{" "}

            <Link to="/register">
              Create Account
            </Link>

          </p>

        </div>

      </div>

      {/* SOCIAL MODAL */}

      {socialMessage && (

        <div
          className="social-modal-overlay"
          onClick={() => setSocialMessage("")}
        >

          <div
            className="social-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="modal-close"
              onClick={() =>
                setSocialMessage("")
              }
            >
              ×
            </button>

            <div className="modal-icon">

              {socialMessage === "Google" && "G"}

              {socialMessage === "Facebook" && "f"}

              {socialMessage === "Apple" && "●"}

            </div>

            <h2>
              Continue with {socialMessage}
            </h2>

            <p>
              {socialMessage} sign-in is not connected yet.
              <br />
              Please use your GLOVIA account to continue.
            </p>

            <button
              className="modal-login-btn"
              onClick={() =>
                setSocialMessage("")
              }
            >
              Continue with GLOVIA
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default Login;