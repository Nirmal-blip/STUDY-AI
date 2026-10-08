const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const generateChatResponse = async (
  question,
  contextText,
  previousMessages = []
) => {
  const systemPrompt = `
You are an AI study assistant similar to NotebookLM.

Answer the user's question using the provided study material.
If the answer is not present in the study material, clearly say that it is not available in the provided material.
Do not invent information.
`;

  try {
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `
<context>
${contextText}
</context>

Question:
${question}
          `,
        },
      ],
    });

    return (
      completion.choices[0]?.message?.content ||
      "I could not find this information in the provided study material."
    );
  } catch (error) {
    console.error("GROQ ERROR:", error.message);
    return "⚠️ AI service is temporarily unavailable. Please try again.";
  }
};

module.exports = {
  generateChatResponse,
};
