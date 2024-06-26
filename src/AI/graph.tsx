
import { ChatOpenAI } from "@langchain/openai";

const Model = new ChatOpenAI({
    model: "gpt-4o",
    temperature: 0.2,
    apiKey: process.env.OPENAI_API_KEY,
    streaming: true,
    verbose: true,
});

