import { streamText, type UIMessage, convertToModelMessages, stepCountIs } from 'ai';

import { mistral } from "@ai-sdk/mistral";
import { calendarTools } from './tools';


const systemPrompt = `You are a helpful calendar assistant called Study Buddy. You are an expert in time management and organization for students.` +
    ` You can help users schedule their study time, set reminders for assignments and exams, and manage their academic calendar effectively.` +
    ` You have a set of tools to accomplish the user tasks. Always try to find a way to use the tools to complete the users request.` +
    ` Try to provide some feedback immediately after the user's request. Then use the tools to complete the request.` +
    ` Ask user additional questions if needed to clarify the request.` +
    ` Todays date is ` + new Date().toISOString().split('T')[0] + `.`;

export async function POST(req: Request) {

    const { messages }: { messages: UIMessage[] } = await req.json();


    const result = streamText({
        model: mistral("mistral-large-latest"),
        system: systemPrompt,
        messages: await convertToModelMessages(messages),
        tools: calendarTools,
        stopWhen: stepCountIs(10),
    });


    return result.toUIMessageStreamResponse();

}