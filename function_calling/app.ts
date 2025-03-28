import { Mistral } from "@mistralai/mistralai";
import prompt from "prompt-sync";

const input = prompt();

const apiKey = process.env.MISTRAL_API_KEY!;
const model = "mistral-large-latest";

const client = new Mistral({ apiKey });

const systemPrompt = `
You are a highly creative and skilled poet, capable of writing poems in various styles, tones, and structures.
Your poetry must be lyrical, impactful and engaging.

Your poem must be written:
- in English in the morning
- in French in the afternoon
- in Spanish in the evening.

Be angry during the week and happy during the weekend.
`;

function retrieveWeekday(): string {
  console.log("Retrieving the current weekday");
  return `Weekday: ${new Date().toLocaleDateString("en-US", { weekday: "long" })}`;
}

function retrieveTimeOfDay(): string {
  console.log("Retrieving the current time of day");
  const currentHour = new Date().getHours();
  if (currentHour < 12) return "Time of day: morning";
  if (currentHour < 18) return "Time of day: afternoon";
  return "Time of day: evening";
}

const tools = [
    {
        "type": "function",
        "function": {
            "name": "retrieve_weekday",
            "description": "Get the current weekday",
            "parameters": {
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "retrieve_time_of_day",
            "description": "Get the current time of day",
            "parameters": {
            },
        },
    }
]

const namesToFunctions: { [key: string]: () => string } = {
    'retrieve_weekday': retrieveWeekday,
    'retrieve_time_of_day': retrieveTimeOfDay,
}

async function invokeTool(toolName: string): Promise<string> {
    // const functionParams = JSON.parse(toolCall.function.arguments);
    return namesToFunctions[toolName]();
}

async function think(prompt: string): Promise<string> {
  const chatHistory: any[] = [
    { role: "assistant", content: systemPrompt },
    { role: "user", content: prompt },
  ];

  while (true) {
    const response = await client.chat.complete({
      model,
      tools: tools as any,
      toolChoice: "auto",
      messages: chatHistory,
      stream: false,
    });

    if (response.choices?.[0].message.toolCalls) {
      // Add the assistant's response after the tool's result
      chatHistory.push(response.choices?.[0].message);

      for (const toolCall of response.choices[0].message.toolCalls) {
        const result = await invokeTool(toolCall.function.name);
        chatHistory.push({
          role: "tool",
          name: toolCall.function.name,
          content: result,
          toolCallId: toolCall.id,
        });

      }
    } else {
      return String(response.choices?.[0].message.content);
    }
  }
}

async function main() {
  const userName = input("Please enter your name: ");
  const theme = input("A theme for your poem: ");

  const promptText = `Write a poem for ${userName} about ${theme}.
  The poem should be 4 lines long.`;

  const response = await think(promptText);
  console.log("\n" + response + "\n");
}

main();
