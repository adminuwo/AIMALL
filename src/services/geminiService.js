import axios from "axios";
import { apis } from "../types";
import { getUserData } from "../userStore/userData";

export const generateChatResponse = async (history, currentMessage, sessionId, title, systemInstruction) => {
    try {
        const token = getUserData()?.token;
        const payload = {
            content: currentMessage,
            history: history,
            sessionId: sessionId,
            title: title,
            systemInstruction: systemInstruction
        };

        const result = await axios.post(apis.chatAgent, payload, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return result.data.reply || "I'm sorry, I couldn't generate a response.";

    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Sorry, I am having trouble connecting to the AI Mall network right now.";
    }
};