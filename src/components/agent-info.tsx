export function AgentInfo() {
  return (
    <div className="w-full flex-col rounded-xl border border-white/30 bg-white/60 p-4 shadow-lg backdrop-blur-md">
      <h2 className="mb-2 text-2xl font-bold">About Study Buddy 🤖</h2>
      <p className="mb-4 text-gray-700">
        Study Buddy Agent is an AI-powered study assistant designed to help
        students manage their academic schedules effectively. You can provide
        him with a list of your upcoming assignments, exams, and lectures, and
        he will help you organize your study time, set reminders, and optimize
        your learning process.
      </p>
      <h3 className="mb-2 text-xl font-semibold">Key Features:</h3>
      <ul className="mb-4 list-inside list-disc text-gray-700">
        <li>
          Built in calendar: Provide a list of you deadlines and it will
          organize them!
        </li>
        <li>
          Personalized Study Plans: Tell him what classes need the most focus
          and he will help you create a study schedule!
        </li>
        <li>
          Time Management Tips: Provides advice on how to optimize your study
          time.
        </li>
      </ul>
      <p className="text-gray-700">
        To get started, either add your calendar events manually or interact
        with the chat interface and provide a list of you upcoming academic
        tasks 🎓.
      </p>
    </div>
  );
}
