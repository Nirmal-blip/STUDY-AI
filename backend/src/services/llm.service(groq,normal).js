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

`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0.2,
      messages: [
        { role: "system", content: systemPrompt },
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
