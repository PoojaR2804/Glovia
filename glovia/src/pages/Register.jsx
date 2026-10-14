import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [socialMessage, setSocialMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");

    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    // Check passwords
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    // Create username from email
    const username = email.split("@")[0];

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            email: email,
            password: password,
            first_name: name,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.username) {
          setError(data.username[0]);
        } else if (data.email) {
          setError(data.email[0]);
        } else if (data.password) {
          setError(data.password[0]);
        } else if (data.error) {
          setError(data.error);
        } else {
          setError("Registration failed. Please try again.");
        }

        return;
      }

      // Registration successful
      setShowSuccess(true);

    } catch (error) {
      console.error("Registration error:", error);
      setError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      <div className="register-showcase">

        <div className="register-brand">

          <h1>GLOVIA</h1>

          <div className="brand-decoration">
            <span></span>
            <b>♡</b>
            <span></span>
          </div>

          <p>Glow Begins With You ✨</p>

          <div className="register-image">
            <img
              src="/images/skincare-products.jpg"
              alt="GLOVIA skincare products"
            />
          </div>

        </div>

      </div>

      <div className="register-section">

        <div className="register-card">

          <div className="welcome-icon">
            ♡
          </div>

          <h2>Create Account</h2>

          <p className="register-subtitle">
            Start your skincare journey with GLOVIA
          </p>

          <form onSubmit={handleRegister}>

            <label>Full Name</label>

            <div className="register-input">

              <span>♙</span>

              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                required
              />

            </div>

            <label>Email Address</label>

            <div className="register-input">

              <span>✉</span>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
              />

            </div>

            <label>Password</label>

            <div className="register-input">

              <span>🔒</span>

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a password"
                required
                minLength="6"
              />

              <button
                type="button"
                className="password-eye"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? "◉" : "◌"}
              </button>

            </div>

            <label>Confirm Password</label>

            <div className="register-input">

              <span>🔒</span>

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                placeholder="Confirm your password"
                required
                minLength="6"
              />

              <button
                type="button"
                className="password-eye"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
              >
                {showConfirmPassword ? "◉" : "◌"}
              </button>

            </div>

            {error && (
              <p
                style={{
                  color: "red",
                  fontSize: "14px",
                  marginTop: "10px",
                  marginBottom: "10px",
                }}
              >
                {error}
              </p>
            )}

            <div className="terms">

              <input
                type="checkbox"
                required
              />

              <p>
                I agree to{" "}
                <a href="#terms">
                  Terms & Conditions
                </a>
              </p>

            </div>

            <button
              type="submit"
              className="create-account-btn"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

          </form>

          <div className="divider">

            <span></span>

            <p>or</p>

            <span></span>

          </div>

          <div className="social-login">

            <button
              type="button"
              onClick={() => setSocialMessage("Google")}
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

            <button
              type="button"
              onClick={() => setSocialMessage("Facebook")}
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

            <button
              type="button"
              onClick={() => setSocialMessage("Apple")}
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
                  d="M15.04 6.62a3.47 3.47 0 0 0 .8-2.49 3.57 3.57 0 0 0-2.3 1.19 3.29 3.29 0 0 0-.82 2.39 2.94 2.94 0 0 0 2.32-1.09z"
                />

              </svg>

            </button>

          </div>

          <p className="already-account">

            Already have an account?{" "}

            <Link to="/login">
              Login
            </Link>

          </p>

        </div>

      </div>

      {/* SUCCESS POPUP */}
      {showSuccess && (
        <div
          className="glovia-success-overlay"
          onClick={() => setShowSuccess(false)}
        >
          <div
            className="glovia-success-popup"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="glovia-success-icon">
              ✓
            </div>

            <h2>Account Created!</h2>

            <p>
              Your GLOVIA account has been created
              successfully.
            </p>

            <button
              onClick={() => {
                setShowSuccess(false);
                navigate("/login");
              }}
            >
              Continue to Login
            </button>

          </div>
        </div>
      )}

      {/* SOCIAL LOGIN POPUP */}
      {socialMessage && (

        <div
          className="social-modal-overlay"
          onClick={() => setSocialMessage("")}
        >

          <div
            className="social-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="modal-close"
              onClick={() => setSocialMessage("")}
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
              onClick={() => setSocialMessage("")}
            >
              Continue with GLOVIA
            </button>

          </div>

        </div>

      )}

      {/* POPUP STYLES */}
      <style>{`
        .glovia-success-overlay {
          position: fixed;
          inset: 0;
          background: rgba(45, 20, 30, 0.35);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 99999;
        }

        .glovia-success-popup {
          width: 380px;
          max-width: 90%;
          background: #ffffff;
          border-radius: 22px;
          padding: 35px 30px 30px;
          text-align: center;
          box-shadow: 0 20px 60px rgba(80, 20, 40, 0.25);
          animation: gloviaPopup 0.3s ease-out;
        }

        .glovia-success-icon {
          width: 70px;
          height: 70px;
          margin: 0 auto 18px;
          border-radius: 50%;
          background: #fce1e9;
          color: #d85c7d;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 38px;
          font-weight: bold;
        }

        .glovia-success-popup h2 {
          margin: 0 0 10px;
          color: #b94f70;
          font-size: 25px;
        }

        .glovia-success-popup p {
          margin: 0 auto 25px;
          color: #777;
          font-size: 15px;
          line-height: 1.6;
        }

        .glovia-success-popup button {
          width: 100%;
          border: none;
          border-radius: 12px;
          padding: 13px 20px;
          background: #dc6382;
          color: white;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .glovia-success-popup button:hover {
          background: #c95171;
          transform: translateY(-1px);
        }

        @keyframes gloviaPopup {
          from {
            opacity: 0;
            transform: scale(0.88) translateY(10px);
          }

          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>

    </div>
  );
}

export default Register;