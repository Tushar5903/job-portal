import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/message", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message required",
      });
    }

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content:
              "You are a Job Portal AI Assistant for a job board website. You know how the site works for candidates, employers, and admins. Keep replies brief, helpful, and focused on job search, application flow, profile updates, employer posting, and admin actions. Do not invent facts outside the portal's scope.",
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
      }
    );

    const reply = response.data.choices[0].message.content;

    return res.json({
      success: true,
      reply,
    });
  } catch (error) {
    console.log("CHATBOT ERROR:", error.response?.data || error.message);

    return res.status(500).json({
      success: false,
      message: "AI service error",
    });
  }
});

export default router;