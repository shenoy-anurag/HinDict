"use server";
import { createOpenAI } from '@ai-sdk/openai';
import { streamText, generateText } from 'ai';

const openai = createOpenAI({
    // custom settings, e.g.
    apiKey: process.env.API_OPENAI_API_KEY,
    compatibility: 'strict', // strict mode, enable when using the OpenAI API
});

const system_prompt: string = "Respond in one concise sentence without disclaimers or examples. Format: User word title-case, (user word in Hindi), refers to … (provide a definition in 5-15 words). Always conclude with this exact phrase: \'\nClosest English equivalent: (closest english equivalent single word)\'. Do not omit this phrase under any circumstances. If the word/phrase is not a Hindi word/phrase, respond with \"That's not a Hindi word/phrase!\" and then respond with \"That's a \", the detected language and the meaning and the Closest English equivalent as mentioned earlier." // BEST PROMPT SO FAR!!

function buildPrompt(text: string): string {
    const prompt: string = `${system_prompt}\n\nuser word: ${text}`;
    return prompt;
}

export async function invokeChat(text: string) {
    const prompt: string = buildPrompt(text);
    const response = await generateText({
        model: openai(process.env.API_OPENAI_MODEL_NAME || "gpt-4o-mini-2024-07-18"),
        prompt: prompt,
    });
    return response.text;
}

export async function streamChat(text: string) {
    const prompt: string = buildPrompt(text);
    const { textStream } = streamText({
        model: openai(process.env.API_OPENAI_MODEL_NAME || "gpt-4o-mini-2024-07-18"),
        prompt: prompt,
    });
    return textStream;
}