import { Mistral } from "@mistralai/mistralai";
import prompt from "prompt-sync";

const input = prompt();

const apiKey = process.env.MISTRAL_API_KEY!;
const model = "mistral-large-latest";

const client = new Mistral({ apiKey });

const systemPrompt = `
You are a highly creative and skilled poet, capable of writing poems in various styles, tones, and structures.
Your poetry must be lyrical, impactful and engaging.
Write the poems in English.
`;

async function sendPromptToMistral(prompt: string): Promise<string> {
  const response = await client.chat.complete({
    model,
    messages: [
      { role: "assistant", content: systemPrompt },
      { role: "user", content: prompt },
    ],
    stream: false,
  });
  
  return String(response.choices?.[0].message.content);
}

async function main() {
  const userName = input("Please enter your name: ") as string;
  const theme = input("A theme for your poem: ") as string;

  const promptText = `Write a poem for ${userName} about ${theme}.
  The poem should be 4 lines long.`;

  const response = await sendPromptToMistral(promptText);
  console.log("\n" + response + "\n");
}

main();
