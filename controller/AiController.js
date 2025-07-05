
import { GoogleGenAI } from "@google/genai";


const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateResponse(req, res, next) {

    try {
        const { prompt } = req.body
        async function main() {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `${prompt}.Generate a better prompt than this in less than 100 words`,
                config: {
                    thinkingConfig: {
                        thinkingBudget: 0, // Disables thinking
                    },
                    // systemInstruction: "You are an ai prompt improver. Your name is PromptGPT.",
                }
            });
            return response.text
        }

        const data = await main();
        res.setHeader("Content-Type", "text/plain")
        res.setHeader("Transfer-Encoding", "chunked")

        const words = data.split(" ")

        for (const word of words) {
            res.write(word + " ");
            await new Promise(resolve =>
                setTimeout(resolve, 200))
        }
        res.end()

    } catch (error) {
        next(error);
    }
}
