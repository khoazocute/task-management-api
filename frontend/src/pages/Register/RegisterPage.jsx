import { useState } from "react";
import PageCard from "../../components/common/PageCard";
import FormMessage from "../../components/common/FormMessage";
import { register } from "../../services/authService";

function RegisterPage() {
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const result = await register(form);
      setMessage(result.message || "Dang ky thanh cong");
      setForm({ fullName: "", email: "", password: "" });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageCard title="Dang ky" subtitle="Tao tai khoan moi de test auth va forgot password.">
      <form className="stack-form" onSubmit={handleSubmit}>
        <label>
          Ho ten
          <input
            value={form.fullName}
            onChange={(event) => setForm({ ...form, fullName: event.target.value })}
            placeholder="Nguyen Van A"
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            placeholder="you@gmail.com"
          />
        </label>

        <label>
          Mat khau
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            placeholder="Toi thieu 6 ky tu"
          />
        </label>

        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? "Dang tao..." : "Dang ky"}
        </button>

        <FormMessage type="success">{message}</FormMessage>
        <FormMessage type="error">{error}</FormMessage>
      </form>
    </PageCard>
  );
}

export default RegisterPage;
