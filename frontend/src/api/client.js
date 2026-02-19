/**
 * API client. Uses only VITE_API_BASE (public URL). Never use VITE_ for keys or secrets.
 */

const RAW_BASE = import.meta.env.VITE_API_BASE;

/** Allow empty (same-origin) or validated URL. In production, only same-origin allowed to reduce SSRF risk. */
function getApiBase() {
  if (RAW_BASE == null || RAW_BASE === "") return "";
  const s = String(RAW_BASE).trim();
  if (s === "") return "";
  if (typeof window === "undefined") return s;
  try {
    const url = new URL(s, window.location.origin);
    if (import.meta.env.PROD && url.origin !== window.location.origin) {
      console.warn("VITE_API_BASE must be same-origin in production");
      return "";
    }
    return url.origin + url.pathname.replace(/\/+$/, "");
  } catch {
    return "";
  }
}

const API_BASE = getApiBase();

const MAX_MESSAGE_LENGTH = 16 * 1024;
const MAX_HISTORY_LENGTH = 50;
const MAX_CATEGORY_LENGTH = 200;
const MAX_LIMIT = 100;
const MIN_LIMIT = 1;
const MIN_OFFSET = 0;

function safeJson(res) {
  return res.text().then((text) => {
    if (!text || !text.trim()) return null;
    try {
      return JSON.parse(text);
    } catch {
      throw new Error("Invalid response from server");
    }
  });
}

export async function postChat({ sessionId, message, history }) {
  try {
    const safeMessage = message != null ? String(message).slice(0, MAX_MESSAGE_LENGTH) : "";
    const rawHistory = Array.isArray(history) ? history : [];
    const safeHistory = rawHistory.slice(0, MAX_HISTORY_LENGTH).map((m) => ({
      role: m && typeof m === "object" && (m.role === "user" || m.role === "assistant") ? m.role : "user",
      content: m && typeof m === "object" && m.content != null ? String(m.content).slice(0, MAX_MESSAGE_LENGTH) : "",
    }));

    const res = await fetch(`${API_BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sessionId ?? undefined,
        message: safeMessage,
        history: safeHistory,
      }),
    });
    const data = await safeJson(res);
    if (!res.ok) {
      const detail = data?.detail ?? data?.message;
      const friendly =
        res.status === 502 || res.status === 503
          ? "The chat service isn’t available. Start the Evocative backend on port 8000 (see evocative/README), or try again later."
          : detail && typeof detail === "string"
            ? detail
            : "The chat request didn’t succeed. If you’re running locally, start the Evocative backend on port 8000.";
      const err = new Error(friendly);
      err.status = res.status;
      throw err;
    }
    return data;
  } catch (err) {
    if (err.name === "TypeError" && err.message.includes("fetch")) {
      throw new Error("Network error. Check your connection.");
    }
    throw err;
  }
}

export async function getProducts({ category, limit = 20, offset = 0 } = {}) {
  try {
    const params = new URLSearchParams();
    if (category != null && String(category).trim()) {
      params.set("category", String(category).trim().slice(0, MAX_CATEGORY_LENGTH));
    }
    const safeLimit = Math.min(MAX_LIMIT, Math.max(MIN_LIMIT, Number(limit) || 20));
    const safeOffset = Math.max(MIN_OFFSET, Number(offset) || 0);
    params.set("limit", String(safeLimit));
    params.set("offset", String(safeOffset));

    const res = await fetch(`${API_BASE}/api/products?${params}`);
    const data = await safeJson(res);
    if (!res.ok) throw new Error(data?.detail || "Products request failed");
    return Array.isArray(data) ? data : [];
  } catch (err) {
    if (err.name === "TypeError" && err.message.includes("fetch")) {
      throw new Error("Network error. Check your connection.");
    }
    throw err;
  }
}

export async function getHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error("Health check failed");
    const data = await safeJson(res);
    return data;
  } catch (err) {
    if (err.name === "TypeError" && err.message.includes("fetch")) {
      throw new Error("Network error. Check your connection.");
    }
    throw err;
  }
}
