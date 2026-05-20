import {
  useState,
  useContext
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  MyContext
} from "../MyContext";

function Login() {

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [showPopup, setShowPopup] =
    useState(false);

  const navigate =
    useNavigate();

  const { setUser } =
    useContext(MyContext);

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const response = await fetch(
        "http://localhost:8080/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data =
        await response.json();

      if (response.ok) {

        setUser(data.user);

        setMessage(
          "Logged in successfully!"
        );

        setShowPopup(true);

        setTimeout(() => {

          navigate("/");

        }, 1500);

      } else {

        setMessage(
          data.error ||
          "Invalid username or password"
        );

        setShowPopup(true);

      }

    } catch (err) {

      console.log(err);

      setMessage(
        "Something went wrong"
      );

      setShowPopup(true);

    }
  };

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
              message.includes("success")
                ? "#22c55e"
                : "#ef4444",
            fontWeight: "600",
            boxShadow:
              "0 8px 25px rgba(0,0,0,0.35)",
            borderLeft:
              message.includes("success")
                ? "6px solid #22c55e"
                : "6px solid #ef4444",
            zIndex: "999",
          }}
        >
          {message}
        </div>

      )}

      {/* login card */}
      <div
        style={{
          width: "380px",
          backgroundColor: "#202123",
          borderRadius: "20px",
          padding: "40px 35px",
          boxShadow:
            "0 10px 35px rgba(0,0,0,0.4)",
          border: "1px solid #2d2d2d",
        }}
      >

        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >

          <h1
            style={{
              marginBottom: "10px",
              color: "#fff",
              fontSize: "32px",
            }}
          >
            Welcome Back 👋
          </h1>

          <p
            style={{
              color: "#9ca3af",
              fontSize: "15px",
            }}
          >
            Login to continue using
            SigmaGPT
          </p>

        </div>

        <form onSubmit={handleLogin}>

          {/* username */}
          <div
            style={{
              marginBottom: "18px",
            }}
          >

            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#e5e7eb",
              }}
            >
              Username
            </label>

            <input
              type="text"
              placeholder="Enter username"

              value={username}

              onChange={(e) =>
                setUsername(e.target.value)
              }

              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                border:
                  "1px solid #3a3a3a",
                outline: "none",
                fontSize: "15px",
                boxSizing: "border-box",
                backgroundColor: "#2b2c2f",
                color: "#fff",
              }}
            />

          </div>

          {/* password */}
          <div
            style={{
              marginBottom: "25px",
            }}
          >

            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#e5e7eb",
              }}
            >
              Password
            </label>

            <input
              type="password"
              placeholder="Enter password"

              value={password}

              onChange={(e) =>
                setPassword(e.target.value)
              }

              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                border:
                  "1px solid #3a3a3a",
                outline: "none",
                fontSize: "15px",
                boxSizing: "border-box",
                backgroundColor: "#2b2c2f",
                color: "#fff",
              }}
            />

          </div>

          {/* button */}
          <button
            type="submit"

            style={{
              width: "100%",
              padding: "14px",
              border: "none",
              borderRadius: "14px",
              backgroundColor: "#fff",
              color: "#171717",
              fontSize: "16px",
              fontWeight: "700",
              cursor: "pointer",
              transition: "0.3s",
            }}
          >
            Login
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;