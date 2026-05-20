import "./Chat.css";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "./MyContext";
//markdown, highlight library are used for the proper formatting 
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";// for the highlights were necessary
import "highlight.js/styles/github-dark.css";// for code formatting
function Chat() {
  const { newChat, prevChats ,reply} = useContext(MyContext);
  const [latestReply,setlatestReply]=useState(null);

useEffect(()=>{
  if(reply===null){
    setlatestReply(null)
    return
  }
// here we are going to seprate the latest reply and goinng to give a typing effect for the newest reply

if(!prevChats?.length) return;// if no prevchats existing then return
const content=reply.split("")//individual words are being splitted 
  
let idx=0;
const interval=setInterval(()=>{
setlatestReply(content.slice(0,idx+1).join(""));
idx++;
if(idx>=content.length) clearInterval(interval);
},40)

},[prevChats,reply])
  return (
    <>
      {newChat && <h1>Start a New chat !</h1>}
      <div className="chats">
        {
        prevChats?.slice(0,-1).map((chat, idx) => 
          <div
            className={chat.role === "user" ? "userDiv" : "gptDiv"}
            key={idx}>
            {
            chat.role === "user" ? (
              <p className="userMessage">{chat.content}</p>
            ) : 
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{chat.content}</ReactMarkdown>
            }
          </div>
        )}
        {
          prevChats.length>0 && latestReply !=null &&
          <div className="gptDiv" key={"typing"}>
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{latestReply}</ReactMarkdown>
          </div>
        }
        {
          prevChats.length>0 && latestReply ===null &&
          <div className="gptDiv" key={"non-typing"}>
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{prevChats[prevChats.length-1].content}</ReactMarkdown>
          </div>
        }
      </div>
    </>
  );
}

export default Chat;
