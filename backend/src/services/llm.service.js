const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const generateChatResponse = async (question, contextText) => {
  const systemPrompt = `
You are a study assistant similar to NotebookLM.

Rules:
1. Use ONLY the information present in <context>.
2. You MAY explain, elaborate, or rephrase concepts in your own words
   to make them clearer and more detailed.
3. Do NOT introduce new facts, examples, definitions, or terms
   that are not supported by the context.
4. If a concept is not present in the context, say:
   "❌ This question is out of context of the selected documents."
5. Do NOT use external knowledge.
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
      "❌ This question is out of context of the selected documents."
    );
  } catch (error) {
    console.error("GROQ ERROR:", error.message);
    return "⚠️ AI service is temporarily unavailable. Please try again.";
  }
};

module.exports = {
  generateChatResponse,
};
