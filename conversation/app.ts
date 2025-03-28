import { Mistral } from "@mistralai/mistralai";
import prompt from "prompt-sync";

const input = prompt();

const apiKey = process.env.MISTRAL_API_KEY!;
const model = "mistral-large-latest";

const client = new Mistral({ apiKey });

const systemPrompt = `
You are a plumber, and you have been called to fix a leak in a customer's house.
Use your expertise to fix the leak and ensure the customer is satisfied.
Tone: Professional.
Be concise and clear in your responses.
The conversation is a multi-turn dialogue.
Speak in the same language as the user.
`;

const chatHistory: { role: 'assistant'| 'user'; content: string }[] = [
  { role: "assistant", content: systemPrompt },
];

async function sendPromptToMistral(prompt: string): Promise<string> {
  const response = await client.chat.complete({
    model,
    messages: chatHistory,
    stream: false,
  });
  const content = response.choices?.[0].message.content;
  chatHistory.push({ role: "assistant", content: prompt });
  return String(content);
}

async function main() {
  console.log("Welcome to the Plumber Chatbot! Explain your issue and I will help you fix it.\n");

  while (true) {
    const userInput = input("> ");
    chatHistory.push({ role: "user", content: userInput });

    const promptText = `Write a poem for ${userInput}.
    It should be about the beauty of nature.
    The poem should be 4 lines long.`;

    const response = await sendPromptToMistral(promptText);
    console.log("\n" + response + "\n");
  }
}

main();
