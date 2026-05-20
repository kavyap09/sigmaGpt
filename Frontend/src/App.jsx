// import { useState, useEffect } from "react";
// import "./App.css";
// import Sidebar from "./Sidebar";
// import ChatWindow from "./ChatWindow";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { MyContext } from "./MyContext";
// import { v1 as uuidv1 } from "uuid";
// import Signup from "./pages/Signup";
// import Login from "./pages/Login";
// import Logout from "./pages/Logout";

// function App() {
//   const [prompt, setPrompt] = useState("");
//   const [reply, setReply] = useState(null);
//   const [currThreadId, setcurrThreadId] = useState(uuidv1());
//   const [prevChats, setprevChats] = useState([]);
//   const [newChat, setnewChat] = useState(true);
//   const [allThreads, setallThreads] = useState([]);
//   const [user, setUser] = useState(null); // 👈 track logged in user

//   // 🔹 On app load, check if session exists
//   useEffect(() => {
//     const bootstrap = async () => {
//       try {
//         const res = await fetch("http://localhost:8080/auth/me", {
//           credentials: "include",
//         });
//         if (res.ok) {
//           const me = await res.json();
//           setUser(me); // ✅ restore logged-in user
//         } else {
//           setUser(null);
//         }
//       } catch {
//         setUser(null);
//       }
//     };
//     bootstrap();
//   }, []);

//   const providerValues = {
//     prompt,
//     setPrompt,
//     reply,
//     setReply,
//     currThreadId,
//     setcurrThreadId,
//     prevChats,
//     setprevChats,
//     newChat,
//     setnewChat,
//     allThreads,
//     setallThreads,
//     user,
//     setUser, // 👈 expose in context
//   };

//   return (
//     <div className="app">
//       <MyContext.Provider value={providerValues}>
//         <BrowserRouter>
//           <Sidebar />
//           <Routes>
//             <Route path="/" element={<ChatWindow />} />
//             <Route path="/signup" element={<Signup />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/logout" element={<Logout />} />
//           </Routes>
//         </BrowserRouter>
//       </MyContext.Provider>
//     </div>
//   );
// }

// export default App;
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
          "http://localhost:8080/auth/me",
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