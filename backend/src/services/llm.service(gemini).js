const axios = require("axios");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const GEMINI_URL =
  `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-lite:generateContent?key=${GEMINI_API_KEY}`;

const generateChatResponse = async (question, contextText) => {
  const prompt = `
You are an AI study assistant similar to NotebookLM.

<context>
${contextText}
</context>

Question:
${question}
`;

  try {
    const response = await axios.post(GEMINI_URL, {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    return (
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I could not find this information in the provided study material."
    );
  } catch (err) {
    console.error("Gemini Error:", err.response?.data || err.message);
    throw err;
  }
};

module.exports = { generateChatResponse };
