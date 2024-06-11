import OpenAI from "openai";

export class OpenAiService {
    openai: OpenAI;

    constructor(key: string) {
        this.openai = new OpenAI({apiKey: key});
    }

    async createTTS(prompt: string): Promise<any> {
        try {
            const mp3 = await this.openai.audio.speech.create({
                model: "tts-1",
                voice: "alloy",
                input: prompt,
            });
            return mp3;
        } catch (error) {
            console.error('Failed to create TTX', error);
        }
    }
}