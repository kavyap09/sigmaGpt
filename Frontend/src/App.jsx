import { useState, useEffect } from "react";
import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Logout from "./pages/Logout";

import { MyContext } from "./MyContext";

import { v1 as uuidv1 } from "uuid";

function App() {
const API = import.meta.env.VITE_API_URL;
  // states
  const [prompt, setPrompt] =
    useState("");

  const [reply, setReply] =
    useState(null);

  const [currThreadId, setcurrThreadId] =
    useState(uuidv1());

  const [prevChats, setprevChats] =
    useState([]);

  const [newChat, setnewChat] =
    useState(true);

  const [allThreads, setallThreads] =
    useState([]);

  const [user, setUser] =
    useState(null);

  // restore login session
  useEffect(() => {

    const checkUser = async () => {

      try {

        const response = await fetch(
          `${API}/auth/me`,
          {
            credentials: "include",
          }
        );

        // no logged in user
        if (response.status === 401) {

          setUser(null);
          return;

        }

        // logged in user
        if (response.ok) {

          const data =
            await response.json();

          setUser(data);

        }

      } catch (err) {

        console.log(err);

        setUser(null);

      }
    };

    checkUser();

  }, []);

  // context values
  const providerValues = {

    prompt,
    setPrompt,

    reply,
    setReply,

    currThreadId,
    setcurrThreadId,

    prevChats,
    setprevChats,

    newChat,
    setnewChat,

    allThreads,
    setallThreads,

    user,
    setUser
  };

  return (

    <BrowserRouter>

      <MyContext.Provider
        value={providerValues}
      >

        <div className="app">

          <Sidebar />

          <Routes>

            <Route
              path="/"
              element={<ChatWindow />}
            />

            <Route
              path="/signup"
              element={<Signup />}
            />

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/logout"
              element={<Logout />}
            />

          </Routes>

        </div>

      </MyContext.Provider>

    </BrowserRouter>
  );
}

export default App;
