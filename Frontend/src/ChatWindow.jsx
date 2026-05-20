import "./ChatWindow.css";

import Chat from "./Chat";

import {
  MyContext
} from "./MyContext";

import {
  useContext,
  useState,
  useEffect
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  ScaleLoader
} from "react-spinners";

function ChatWindow() {
const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const {
    prompt,
    setPrompt,

    reply,
    setReply,

    currThreadId,

    prevChats,
    setprevChats,

    setnewChat,

    user
  } = useContext(MyContext);

  const [loading, setLoading] =
    useState(false);

  const [isOpen, setisOpen] =
    useState(false);

  // send message
  const getReply = async () => {

    if (!user) {
      navigate("/login");
      return;
    }

    if (!prompt.trim()) return;

    setLoading(true);

    setnewChat(false);

    try {

      const response = await fetch(
        `${API}/api/chat`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            message: prompt,
            threadId: currThreadId,
          }),
        }
      );

      const res =
        await response.json();

      if (response.ok) {

        setReply(res.reply);

      } else {

        console.log(res.error);

      }

    } catch (err) {

      console.log(err);

    }

    setLoading(false);
  };

  // append chats
  useEffect(() => {

    if (reply) {

      setprevChats((prev) => [
        ...prev,

        {
          role: "user",
          content: prompt,
        },

        {
          role: "assistant",
          content: reply,
        },
      ]);

      setPrompt("");

    }

  }, [reply]);

  const handleProfileClick = () => {
    setisOpen(!isOpen);
  };

  return (

    <div className="chatWindow">

      {/* navbar */}
      <div className="navBar">

        <span style={{ margin: "2rem" }}>
          SigmaGPT
        </span>

        <div className="userIconDiv">

          <span
            className="userIcon"
            onClick={handleProfileClick}
          >
            <i className="fa-solid fa-user"></i>
          </span>

        </div>

       {
  isOpen && (

    <div className="dropDown">

      {
        !user ? (
          <>

            <div
              className="dropDownItem"

              onClick={() =>
                navigate("/signup")
              }
            >
              <i className="fa-regular fa-user"></i>

              <span>
                Signup
              </span>
            </div>

            <div
              className="dropDownItem"

              onClick={() =>
                navigate("/login")
              }
            >
              <i className="fa-solid fa-right-to-bracket"></i>

              <span>
                Login
              </span>
            </div>

          </>
        ) : (

          <div
            className="dropDownItem"

            onClick={() =>
              navigate("/logout")
            }
          >
            <i className="fa-solid fa-arrow-right-from-bracket"></i>

            <span>
              Logout
            </span>
          </div>

        )
      }

    </div>
  )
}

      </div>

      <Chat />

      <ScaleLoader
        color="#fff"
        loading={loading}
      />

      {/* input */}
      <div className="chatInput">
    <div className="inputBox"> 
        <input 
        placeholder="Ask Anything"
        value={prompt}
        onChange={(e)=>setPrompt(e.target.value)}
        onKeyDown={(e)=>e.key==='Enter'?getReply():""}
        />
        {/* in onClick we are passing getReply function so that whenever we click on that send button we should get an reply from the api */}
        <div id="submit" onClick={getReply}> <i className="fa-solid fa-paper-plane"></i></div>
    </div> 
    <p className="info">
      Sigma can make mistakes.Check important info <u>See Cookie Preferences</u>
    </p>
</div>

    </div>
  );
}

export default ChatWindow;
