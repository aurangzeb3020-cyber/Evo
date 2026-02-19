import { useState } from "react";
import { ChatMessage } from "./components/ChatMessage";
import { ProductCards } from "./components/ProductCards";
import { Header } from "./components/Header";
import { useChat } from "./hooks/useChat";

export default function App() {
  const {
    messages,
    recommendations,
    loading,
    sendMessage,
    messagesEndRef,
  } = useChat();
  const [input, setInput] = useState("");

  const handleKeyDown = (e) => {
    try {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        const value = typeof input === "string" ? input : "";
        sendMessage(value);
        setInput("");
      }
    } catch (err) {
      if (typeof console !== "undefined" && console.error) console.error(err);
    }
  };

  const handleSend = () => {
    try {
      const value = typeof input === "string" ? input : "";
      sendMessage(value);
      setInput("");
    } catch (err) {
      if (typeof console !== "undefined" && console.error) console.error(err);
    }
  };

  const handleInputChange = (e) => {
    try {
      setInput(e && e.target && typeof e.target.value === "string" ? e.target.value : "");
    } catch (err) {
      if (typeof console !== "undefined" && console.error) console.error(err);
    }
  };

  const messageList = Array.isArray(messages) ? messages : [];
  const hasRecommendations = Array.isArray(recommendations) && recommendations.length > 0;
  const isLoading = Boolean(loading);
  const inputVal = typeof input === "string" ? input : "";
  const canSend = !isLoading && inputVal.trim().length > 0;

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-1 flex flex-col max-w-4xl w-full mx-auto px-4 py-6">
        <div className="flex-1 flex flex-col rounded-2xl bg-white shadow-lg border border-slate-200 overflow-hidden">
          <div className="chat-messages flex-1 overflow-y-auto p-4 space-y-4 min-h-[320px]">
            {messageList.length === 0 && (
              <div className="text-center text-slate-500 py-12">
                <p className="font-display font-semibold text-slate-700 mb-1">
                  What are you looking for?
                </p>
                <p className="text-sm">
                  Try: “I need a laptop under $1000” or “Gift ideas for a runner”
                </p>
              </div>
            )}
            {messageList.map((msg, i) => (
              <ChatMessage
                key={i}
                role={msg && typeof msg === "object" ? msg.role : "assistant"}
                content={msg && typeof msg === "object" ? msg.content : ""}
              />
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 text-slate-600 rounded-2xl rounded-bl-md px-4 py-2 text-sm">
                  Thinking…
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {hasRecommendations && (
            <div className="border-t border-slate-200 bg-slate-50/80 p-4">
              <h3 className="font-display font-semibold text-slate-800 mb-3">
                Recommended for you
              </h3>
              <ProductCards products={recommendations} />
            </div>
          )}

          <div className="p-4 border-t border-slate-200 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputVal}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Describe what you’re looking for…"
                className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-evocative-primary focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!canSend}
                className="px-5 py-3 rounded-xl bg-evocative-primary text-white font-medium hover:bg-evocative-dark focus:outline-none focus:ring-2 focus:ring-evocative-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
