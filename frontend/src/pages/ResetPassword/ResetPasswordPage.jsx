import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PageCard from "../../components/common/PageCard";
import FormMessage from "../../components/common/FormMessage";
import { resetPassword } from "../../services/authService";

function ResetPasswordPage() {
  const location = useLocation();
  const [form, setForm] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const email = query.get("email");

    if (email) {
      setForm((current) => ({ ...current, email }));
    }
  }, [location.search]);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const result = await resetPassword(form);
      setMessage(result.message || "Dat lai mat khau thanh cong");
      setForm({ email: "", otp: "", password: "", confirmPassword: "" });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageCard title="Dat lai mat khau" subtitle="Nhap email, OTP va mat khau moi de hoan tat.">
      <form className="stack-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
        </label>

        <label>
          OTP
          <input
            value={form.otp}
            onChange={(event) => setForm({ ...form, otp: event.target.value })}
            placeholder="6 chu so"
          />
        </label>

        <label>
          Mat khau moi
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
          />
        </label>

        <label>
          Xac nhan mat khau
          <input
            type="password"
            value={form.confirmPassword}
            onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
          />
        </label>

        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? "Dang cap nhat..." : "Dat lai mat khau"}
        </button>

        <FormMessage type="success">{message}</FormMessage>
        <FormMessage type="error">{error}</FormMessage>
      </form>
    </PageCard>
  );
}

export default ResetPasswordPage;
