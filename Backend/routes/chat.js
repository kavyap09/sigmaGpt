// import express from "express";
// import Thread from "../models/Thread.js";
// import getOpenAIAPIResponse from "../utils/openai.js"
// const router= express.Router();
// //test 
// router.post("/test",async(req,res)=>{
//     try{
//         const thread=new Thread({
//             threadId:"abc",
//             title:"testing thread2 db"
//         });
//         const response= await thread.save();
//         res.send(response);
//     }catch(err){
//         console.log(err);
//         res.status(500).json({error:"failed to save in DB"})
//     }
// })

// // get all threads
// router.get("/thread", async (req, res) => {
//   if (!req.user) return res.status(401).json({ error: "Unauthorized" });
//   try {
//     const threads = await Thread.find({ user: req.user._id }).sort({ updatedAt: -1 });
//     res.json(
//       threads.map(t => ({
//         threadId: t.threadId,
//         title: t.title
//       }))
//     );
//   } catch (err) {
//     console.log("error found! ", err);
//     res.status(500).json({ error: "failed to fetch thread!" });
//   }
// });
// // to see any thread in detail. that is to the thread related all the messages
// router.get("/thread/:threadId",async(req,res)=>{
//   if (!req.user) return res.status(401).json({ error: "Unauthorized" });

//     const {threadId}=req.params;
//    try{
//      const thread= await Thread.findOne({threadId, user: req.user._id });
//      if(!thread){
//         // if no thread then nothing to return 
//         res.status(404).json({error: "no thread found"})
//      }
//      res.json(thread.messages)
//    } catch(err){
//         console.log("error found! ",err)
//         res.status(500).json({error:"failed to fectch thread!"})
//     }
// })
// // to delete the thread
// router.delete("/thread/:threadId", async (req, res) => {
//   if (!req.user) return res.status(401).json({ error: "Unauthorized" });

//   const { threadId } = req.params;
//   try {
//     const deletedThread = await Thread.findOneAndDelete({
//       threadId,
//       user: req.user._id, // 👈 check ownership
//     });
//     if (!deletedThread) {
//       return res.status(404).json({ error: "no thread found, could not be deleted" });
//     }
//     res.status(200).json({ success: "Chat deleted Successfully !" });
//   } catch (err) {
//     console.log("error found! ", err);
//     res.status(500).json({ error: "failed to delete thread!" });
//   }
// });

// // main work is done here.
// router.post("/chat", async (req, res) => {
//   if (!req.user) return res.status(401).json({ error: "Unauthorized" });

//   const { threadId, message } = req.body;
//   if (!threadId || !message) {
//     return res.status(404).json({ error: "message required!" });
//   }

//   try {
//     let thread = await Thread.findOne({ threadId, user: req.user._id });

//     if (!thread) {
//       thread = new Thread({
//         threadId,
//         title: message,
//         messages: [{ role: "user", content: message }],
//         user: req.user._id, 
//       });
//     } else {
//       //append user message into array
//       thread.messages.push({ role: "user", content: message });
//     }
// //getting reply from the assistant
//     const assistantReply = await getOpenAIAPIResponse(message);
// //save
//     thread.messages.push({ role: "assistant", content: assistantReply });
//     thread.updatedAt = new Date();

//     await thread.save();
//     res.json({ reply: assistantReply });
//   } catch (err) {
//     console.log("error found! ", err);
//     res.status(500).json({ error: "something went wrong" });
//   }
// });


// export default router;
import express from "express";
import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/openai.js";

const router = express.Router();

// get all threads
router.get("/thread", async (req, res) => {

  if (!req.isAuthenticated()) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  try {

    const threads = await Thread.find({
      user: req.user._id,
    }).sort({
      updatedAt: -1,
    });

    res.json(
      threads.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }))
    );

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: "Failed to fetch threads",
    });

  }
});

// get single thread
router.get("/thread/:threadId", async (req, res) => {

  if (!req.isAuthenticated()) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  try {

    const thread = await Thread.findOne({
      threadId: req.params.threadId,
      user: req.user._id,
    });

    if (!thread) {
      return res.status(404).json({
        error: "Thread not found",
      });
    }

    res.json(thread.messages);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: "Failed to fetch thread",
    });

  }
});

// delete thread
router.delete("/thread/:threadId", async (req, res) => {

  if (!req.isAuthenticated()) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  try {

    const deletedThread =
      await Thread.findOneAndDelete({
        threadId: req.params.threadId,
        user: req.user._id,
      });

    if (!deletedThread) {
      return res.status(404).json({
        error: "Thread not found",
      });
    }

    res.json({
      success: "Thread deleted",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: "Delete failed",
    });

  }
});

// chat
router.post("/chat", async (req, res) => {

  if (!req.isAuthenticated()) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  try {

    const { threadId, message } = req.body;

    if (!threadId || !message) {
      return res.status(400).json({
        error: "Message required",
      });
    }

    let thread = await Thread.findOne({
      threadId,
      user: req.user._id,
    });

    if (!thread) {

      thread = new Thread({
        threadId,
        title: message,
        user: req.user._id,
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
      });

    } else {

      thread.messages.push({
        role: "user",
        content: message,
      });

    }

    // AI reply
    const assistantReply =
      await getOpenAIAPIResponse(message);

    thread.messages.push({
      role: "assistant",
      content: assistantReply,
    });

    thread.updatedAt = new Date();

    await thread.save();

    res.json({
      reply: assistantReply,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: "Something went wrong",
    });

  }
});

export default router;