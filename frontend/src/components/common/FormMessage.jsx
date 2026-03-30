function FormMessage({ type, children }) {
  // Khong co noi dung thi khong can render thong bao.
  if (!children) return null;

  return <div className={`form-message ${type}`}>{children}</div>;
}

export default FormMessage;
