# Study Buddy 🤖

This is a web-based LLM chat app designed to help students manage their time while studying! Now hosted on [Vercel](https://vercel.com), using [Convex](https://www.convex.dev/) as the database and [Mistral](https://mistral.ai/) as the LLM provider.

## TLDR

The app is a NextJS-based web application that allows users to interact with an LLM using a simple chat interface. Users can use the built-in calendar to schedule events like exams and lectures, then ask Study Buddy to help organize study time. Scheduling sessions, setting reminders, or making changes to the calendar. The LLM has access to tools that allow it to read and write to the calendar, powered by Convex as the backend database and Mistral as the LLM provider.

## Tech stack

- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Vercel AI SDK](https://sdk.vercel.ai)
- [Convex](https://www.convex.dev/) (database)
- [Mistral](https://mistral.ai/) (LLM provider)
- [shadcn/ui](https://ui.shadcn.com)

## How to run locally

To run this project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/Padi142/mistral-study-buddy.git
   cd mistral-study-buddy
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the necessary environment variables as specified in `.env.example`. You will need API keys for Mistral and your Convex project.
   Convex can be set up by a simple `pnpm install convex` command. You don't even need to sign up.

4. In a separate terminal window, start the Convex development server:

   ```bash
   npx convex dev
   ```

5. Run the app:

   ```bash
   pnpm dev
   ```

6. Open your browser and navigate to `http://localhost:3000` to access the app!

## Deployment

There is a hosted version of this app on Vercel: [https://mistral-study-buddy.vercel.app](https://mistral-study-buddy.vercel.app) which periodically resets. To deploy your own instance can be a bit tricky. You need a Convex production deployment, I've used free tier in their hosted version. You also need to modify the build command on Vercel. Also during Vercel builds, an issue with import paths may occur. More on this can be found [here](https://docs.convex.dev/production/hosting/vercel).

## Frontend

In order to not reinvent the wheel, I've decided to use the amazing [Vercel AI SDK](https://sdk.vercel.ai/docs). The library provides really good and easy to use components for building both backend and frontend parts of an AI app. In the frontend, I am using the `useChat` hook to manage the chat interface and messages. The SDK also makes it easy to a streaming response using another library called `streamdown`, which allows rendering markdown content as it streams in from the LLM. The (Conversation)[https://ai-sdk.dev/elements/components/conversation] and (Message)[https://ai-sdk.dev/elements/components/message] components from the AI-elements collection are used to render the chat interface.

### Gradient

The background mesh radial gradient was carefully crafted using (MagicPattern)[https://www.magicpattern.design/tools/mesh-gradients].

## Backend

The backend can be divided into two parts: The DB and the API route.

### Database

For the database, I've decided to use (Convex)[https://www.convex.dev/]. Convex is awesome because it's backend living in one single folder, `/convex`, and it provides a really good developer experience. There is a `schema.ts` file, where the database schema is defined using TypeScript and Zod. All queries and mutations are defined in `calendar_entries.ts`. From these two files, Convex generates a type-safe api client. This client is used on both the frontend and in the API route.

Convex also by default syncs the database in real time among all clients. Meaning that if the LLM makes a change to the calendar using one of the tools, the frontend will automatically update without needing to refresh the page or without any additional code for the syncing logic.

### API Route

The API route is defined in `pages/api/chat.ts`. This route is called from the frontend whenever the user sends a message. The route uses the Vercel AI SDK to handle the chat logic. Here I define the model to use, `mistral("mistral-large-latest")`, the system prompt and the streaming response is returned to the client.

The LLM is given access to a set of tools that allow it to read and modify the user's calendar on request. These tools are defined in the `tools.ts` file in the route. They are defined using the `Tool` class from the Vercel AI SDK and they interact with the database using the Convex client. As mentioned above, when the LLM uses the tools to make changes to the calendar, the frontend automatically updates in real time thanks to Convex's real-time syncing.

## Possible improvements

There are many possible improvements that can be made to this app. Here are a few ideas:

- Real calendar integration (Google Calendar, ...)
- User authentication
- Quick message templates for common requests

While I wanted to add these features in this small demo, I have decided to keep it simple and focus on the core functionality.
