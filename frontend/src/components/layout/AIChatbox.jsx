import { useRef, useState } from "react";
import { sendAiMessage } from "../../services/aiService";

const WELCOME_MESSAGE = {
  role: "assistant",
  content: "Chao ban, minh la tro ly TaskFlow AI. Ban can goi y sap xep task hay lap ke hoach lam viec khong?",
};

function AIChatbox({ userLabel, isLoggedIn }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef(null);

  if (!isLoggedIn) {
    return null;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedInput = input.trim();
    if (!trimmedInput || loading) {
      return;
    }

    const nextUserMessage = { role: "user", content: trimmedInput };
    const history = messages
      .filter((item) => item !== WELCOME_MESSAGE)
      .map((item) => ({ role: item.role, content: item.content }));

    setInput("");
    setError("");
    setLoading(true);
    setMessages((currentMessages) => [...currentMessages, nextUserMessage]);

    try {
      const result = await sendAiMessage({
        message: trimmedInput,
        userLabel,
        history,
      });

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          role: "assistant",
          content: result.data?.reply || "Minh chua nhan duoc noi dung phan hoi.",
        },
      ]);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
      formRef.current?.querySelector("textarea")?.focus();
    }
  }

  return (
    <div className={`ai-chatbox ${isOpen ? "open" : ""}`}>
      <button
        className="ai-chatbox-toggle"
        type="button"
        onClick={() => setIsOpen((currentState) => !currentState)}
        aria-expanded={isOpen}
        aria-controls="taskflow-ai-panel"
      >
        <span className="ai-toggle-orb" aria-hidden="true">
          AI
        </span>
        <span>{isOpen ? "An tro ly" : "Mo tro ly AI"}</span>
      </button>

      {isOpen ? (
        <section className="ai-chatbox-panel" id="taskflow-ai-panel" aria-label="TaskFlow AI chatbox">
          <header className="ai-chatbox-head">
            <div>
              <p className="eyebrow">TaskFlow Assistant</p>
              <strong>Tro ly cho {userLabel || "ban"}</strong>
            </div>
            <button className="ghost-button ai-close-button" type="button" onClick={() => setIsOpen(false)}>
              Dong
            </button>
          </header>

          <div className="ai-chatbox-messages">
            {messages.map((messageItem, index) => (
              <article key={`${messageItem.role}-${index}`} className={`ai-bubble ${messageItem.role}`}>
                <span className="ai-bubble-role">{messageItem.role === "assistant" ? "AI" : "Ban"}</span>
                <p>{messageItem.content}</p>
              </article>
            ))}

            {loading ? (
              <article className="ai-bubble assistant pending">
                <span className="ai-bubble-role">AI</span>
                <p>Dang suy nghi...</p>
              </article>
            ) : null}
          </div>

          {error ? <p className="form-message error">{error}</p> : null}

          <form className="ai-chatbox-form" onSubmit={handleSubmit} ref={formRef}>
            <label>
              <span className="sr-only">Noi dung chat</span>
              <textarea
                rows="3"
                placeholder="Vi du: Hay giup toi uu tien 3 task quan trong nhat hom nay"
                value={input}
                onChange={(event) => setInput(event.target.value)}
              />
            </label>

            <button className="primary-button" type="submit" disabled={loading}>
              {loading ? "Dang gui..." : "Gui cho AI"}
            </button>
          </form>
        </section>
      ) : null}
    </div>
  );
}

export default AIChatbox;
