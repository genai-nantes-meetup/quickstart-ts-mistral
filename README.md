
# Quickstart for Mistral (Typescript)

## Simple prompting

Send basic queries to Mistral, with system prompt and user input.

```bash
cd prompt/
npm install

export MISTRAL_API_KEY=xxxxxx
npm start
```

## Multi-turn dialog

Previous messages and answers are sent back to Mistral, to build a conversation.

```bash
cd conversation/
npm install

export MISTRAL_API_KEY=xxxxxx
npm start
```

## Function calling

Provide some tools to Mistral. The LLM will reply with a call to your function.

In this example, the LLM will build a different poem depending on week day and time of the day, on your machine.

```bash
cd function_calling/
npm install

export MISTRAL_API_KEY=xxxxxx
npm start
```

## Structured output

Provide a class to Mistral. The LLM will reply with an instance of your type.

In this example, we ask mistral to return a color with: name, rgb and variants.

```bash
cd structured_output/
npm install

export MISTRAL_API_KEY=xxxxxx
npm start
```
