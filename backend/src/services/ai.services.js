const {GoogleGenAI} = require('@google/genai')
const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);
async function generateResponse(prompt) {
    const finalPrompt = `
You are a helpful AI assistant with memory.
If past facts are provided, use them.
Do NOT say you don't remember if the answer exists in memory.

${prompt}
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: finalPrompt,
    });

    return response.text;
}

async function generatevector(content)
{
      const response = await ai.models.embedContent({
        model: 'gemini-embedding-001',
        contents: content,
        config:{
            outputDimensionality:768
        }

    });

    return response.embeddings[0].values
}
module.exports = {generateResponse,generatevector}
