import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("gloviaToken");

    if (!token || localStorage.getItem("gloviaLoggedIn") !== "true") {
      navigate("/login");
      return;
    }

    fetch("https://glovia-backend-8zxd.onrender.com/api/profile/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load profile");
        }
        return response.json();
      })
      .then((data) => setUser(data))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, [navigate]);

  return (
    <>
      <Navbar />

      <main className="profile-page">
        <h1>My Profile</h1>
        <p>Your GLOVIA account details</p>

        {loading ? (
          <p>Loading profile...</p>
        ) : (
          <section className="profile-card">
            <div className="profile-avatar">♡</div>

            <h2>
              {user.first_name || user.username}
              {user.last_name ? ` ${user.last_name}` : ""}
            </h2>

            <div className="profile-detail">
              <strong>Username</strong>
              <span>{user.username || "Not available"}</span>
            </div>

            <div className="profile-detail">
              <strong>Email</strong>
              <span>{user.email || "Not available"}</span>
            </div>

            <Link to="/orders" className="profile-orders-link">
              View My Orders →
            </Link>

            <Link to="/products" className="profile-shop-link">
              Continue Shopping
            </Link>
          </section>
        )}
      </main>
    </>
  );
}

export default Profile;