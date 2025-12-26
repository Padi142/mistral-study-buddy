# Study Buddy 🤖

This is a web-based LLM chat app designed to help students manage their time while studying! Now hosted on [Vercel](https://vercel.com), using [Convex](https://www.convex.dev/) as the database and [Mistral](https://mistral.ai/) as the LLM provider.

## How does it work?

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

There is a hosted version of this app on Vercel: [https://mistral-study-buddy.vercel.app](https://mistral-study-buddy.vercel.app) which periodically resets.


