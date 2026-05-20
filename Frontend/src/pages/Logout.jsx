import {
  useEffect,
  useState,
  useContext
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  MyContext
} from "../MyContext";

function Logout() {

  const [message, setMessage] =
    useState("");

  const [showPopup, setShowPopup] =
    useState(false);

  const navigate =
    useNavigate();

  const {
    user,
    setUser,
    setallThreads
  } = useContext(MyContext);

  useEffect(() => {

    const logoutUser = async () => {

      try {

        const response = await fetch(
          "http://localhost:8080/auth/logout",
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data =
          await response.json();

        if (response.ok) {

          // clear frontend user
          setUser(null);

          // clear sidebar chats
          setallThreads([]);

          setMessage(
            `${user?.username || "User"} logged out successfully!`
          );

          setShowPopup(true);

          setTimeout(() => {

            navigate("/");

          }, 1500);

        } else {

          setMessage(
            data.error ||
            "Logout failed."
          );

          setShowPopup(true);

        }

      } catch (err) {

        console.log(err);

        setMessage(
          "Network error during logout."
        );

        setShowPopup(true);

      }
    };

    logoutUser();

  }, []);

  return (

    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#171717",
      }}
    >

      {/* popup */}
      {showPopup && (

        <div
          style={{
            position: "fixed",
            top: "30px",
            right: "30px",
            backgroundColor: "#222",
            padding: "16px 22px",
            borderRadius: "12px",
            color:
              message.includes("successfully")
                ? "#22c55e"
                : "#ef4444",
            fontWeight: "600",
            boxShadow:
              "0 8px 25px rgba(0,0,0,0.35)",
            borderLeft:
              message.includes("successfully")
                ? "6px solid #22c55e"
                : "6px solid #ef4444",
            zIndex: "999",
          }}
        >
          {message}
        </div>

      )}

      <h2
        style={{
          color: "#fff",
          fontSize: "28px",
          fontWeight: "600",
        }}
      >
        Logging out...
      </h2>

    </div>
  );
}

export default Logout;