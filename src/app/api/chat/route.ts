import { streamText, type UIMessage, convertToModelMessages } from 'ai';

import { mistral } from "@ai-sdk/mistral";


export async function POST(req: Request) {

    const { messages }: { messages: UIMessage[] } = await req.json();


    const result = streamText({

        model: mistral("mistral-large-latest"),
        system: "You are a helpful assistant with the aim of assisting university students plan their time.",

        messages: await convertToModelMessages(messages),

    });


    return result.toUIMessageStreamResponse();

}