import { useState } from "react";
import PageCard from "../../components/common/PageCard";
import FormMessage from "../../components/common/FormMessage";
import { forgotPassword } from "../../services/authService";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const result = await forgotPassword(email);
      setMessage(result.message || "Da gui OTP ve email");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageCard title="Quen mat khau" subtitle="Gui OTP den email da dang ky de dat lai mat khau.">
      <form className="stack-form" onSubmit={handleSubmit}>
        <label>
          Email da dang ky
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@gmail.com"
          />
        </label>

        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? "Dang gui..." : "Gui ma OTP"}
        </button>

        <FormMessage type="success">{message}</FormMessage>
        <FormMessage type="error">{error}</FormMessage>
      </form>
    </PageCard>
  );
}

export default ForgotPasswordPage;
