import { Mistral } from "@mistralai/mistralai";
import { z } from "zod";

const apiKey = process.env.MISTRAL_API_KEY!;
const model = "mistral-large-latest";

const client = new Mistral({ apiKey });

const Color = z.object({
  rgb: z.string(),
  name: z.string(),
  variants: z.array(z.string()),
});

async function main() {
  const response = await client.chat.parse({
    model,
    messages: [
      { role: "system", content: "Extract the right color." },
      { role: "user", content: "Roses are red, violets are:" },
    ],
    responseFormat: Color,
  });

  console.log(response.choices?.[0].message?.parsed);
}

main();
