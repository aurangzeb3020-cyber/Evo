import { useState, useRef, useCallback, useEffect } from "react";
import { postChat } from "../api/client";

const FALLBACK_MESSAGE =
  "Sorry, I couldn’t reach the server. Start the Evocative backend (port 8000) or run with Docker.";

function safeString(v) {
  if (v == null) return "";
  return typeof v === "string" ? v : String(v);
}

export function useChat() {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    try {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch {
      // ignore scroll errors
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = useCallback(async (text) => {
    const trimmed = safeString(text).trim();
    if (!trimmed || loading) return;

    setError(null);
    setMessages((prev) => (Array.isArray(prev) ? [...prev] : []).concat({ role: "user", content: trimmed }));
    setRecommendations([]);
    setLoading(true);

    try {
      const data = await postChat({
        sessionId,
        message: trimmed,
        history: messages,
      });
      if (data && typeof data === "object") {
        setSessionId(data.session_id ?? sessionId);
        setMessages((prev) =>
          (Array.isArray(prev) ? [...prev] : []).concat({
            role: "assistant",
            content: safeString(data.reply),
          })
        );
        setRecommendations(Array.isArray(data.recommendations) ? data.recommendations : []);
      } else {
        setMessages((prev) =>
          (Array.isArray(prev) ? [...prev] : []).concat({
            role: "assistant",
            content: FALLBACK_MESSAGE,
          })
        );
      }
    } catch (err) {
      const message = err && typeof err.message === "string" ? err.message : FALLBACK_MESSAGE;
      setMessages((prev) =>
        (Array.isArray(prev) ? [...prev] : []).concat({
          role: "assistant",
          content: message,
        })
      );
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [sessionId, messages, loading]);

  return {
    sessionId,
    messages: Array.isArray(messages) ? messages : [],
    recommendations: Array.isArray(recommendations) ? recommendations : [],
    loading: Boolean(loading),
    error,
    sendMessage,
    messagesEndRef,
  };
}
