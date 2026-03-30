import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageCard from "../../components/common/PageCard";
import FormMessage from "../../components/common/FormMessage";
import { login } from "../../services/authService";

function LoginPage({ setAuth }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const result = await login(form);
      setAuth({
        token: result.token || "",
        email: form.email,
        displayName: result.user?.fullName || result.fullName || form.email,
      });
      setMessage(result.message || "Dang nhap thanh cong");
      navigate("/tasks");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageCard title="Dang nhap" subtitle="Nhan token va di thang vao dashboard task.">
      <form className="stack-form" onSubmit={handleSubmit}>
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
            placeholder="Nhap mat khau"
          />
        </label>

        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? "Dang xu ly..." : "Dang nhap"}
        </button>

        <FormMessage type="success">{message}</FormMessage>
        <FormMessage type="error">{error}</FormMessage>
      </form>
    </PageCard>
  );
}

export default LoginPage;
