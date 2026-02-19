export function ChatMessage({ role, content }) {
  const safeRole = role === "user" ? "user" : "assistant";
  const safeContent = content != null ? String(content) : "";
  const isUser = safeRole === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
          isUser
            ? "bg-evocative-primary text-white rounded-br-md"
            : "bg-slate-100 text-slate-800 rounded-bl-md"
        }`}
      >
        <p className="whitespace-pre-wrap">{safeContent}</p>
      </div>
    </div>
  );
}
