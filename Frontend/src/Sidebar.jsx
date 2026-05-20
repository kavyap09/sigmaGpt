import "./Sidebar.css";

import {
  useContext,
  useEffect
} from "react";

import { MyContext } from "./MyContext";

import { v1 as uuidv1 } from "uuid";

import blacklogo from "./assets/blacklogo.png";

function Sidebar() {

  const API = import.meta.env.VITE_API_URL;

  const {
    allThreads,
    setallThreads,

    currThreadId,

    setnewChat,
    setPrompt,
    setReply,

    setcurrThreadId,
    setprevChats,

    user
  } = useContext(MyContext);

  // fetch threads
  const getAllThreads = async () => {

    if (!user) return;

    try {

      const response = await fetch(
        `${API}/api/thread`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        return;
      }

      const res =
        await response.json();

      if (!Array.isArray(res)) {
        return;
      }

      setallThreads(res);

    } catch (err) {

      console.log(err);

    }
  };

  useEffect(() => {

    getAllThreads();

  }, [currThreadId, user]);

  // create new chat
  const createNewchat = () => {

    setnewChat(true);

    setPrompt("");

    setReply(null);

    setcurrThreadId(uuidv1());

    setprevChats([]);

  };

  // change thread
  const changeThread = async (
    newthreadId
  ) => {

    setcurrThreadId(newthreadId);

    try {

      const response = await fetch(
        `${API}/api/thread/${newthreadId}`,
        {
          credentials: "include",
        }
      );

      const res =
        await response.json();

      setprevChats(res);

      setnewChat(false);

      setReply(null);

    } catch (err) {

      console.log(err);

    }
  };

  // delete thread
  const deleteThread = async (
    threadId
  ) => {

    try {

      const response = await fetch(
        `${API}/api/thread/${threadId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const res =
        await response.json();

      console.log(res);

      setallThreads((prev) =>
        prev.filter(
          (thread) =>
            thread.threadId !== threadId
        )
      );

      if (threadId === currThreadId) {
        createNewchat();
      }

    } catch (err) {

      console.log(err);

    }
  };

  return (

    <section className="sidebar">

      <button onClick={createNewchat}>

        <img
          src={blacklogo}
          className="logo"
          alt="gpt logo"
        />

        <span>
          <i className="fa-solid fa-pen-to-square"></i>
        </span>

      </button>

      {/* history */}
      {user && (

        <ul className="history">

          {
            allThreads?.map(
              (thread, idx) => (

                <li
                  key={idx}

                  onClick={() =>
                    changeThread(
                      thread.threadId
                    )
                  }

                  className={
                    thread.threadId ===
                    currThreadId
                      ? "highlighted"
                      : ""
                  }
                >

                  {thread.title}

                  <i
                    className="fa-solid fa-trash"

                    onClick={(e) => {

                      e.stopPropagation();

                      deleteThread(
                        thread.threadId
                      );

                    }}
                  ></i>

                </li>
              )
            )
          }

        </ul>
      )}

      {/* user */}
      <div className="sign">

        <p className="username">

          {
            user
              ? `Logged in as: ${user.username} ❤`
              : "Guest Mode"
          }

        </p>

      </div>

    </section>
  );
}

export default Sidebar;
