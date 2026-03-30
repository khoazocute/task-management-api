function PageCard({ title, subtitle, children, actions }) {
  // Component khung dung lai cho nhieu trang de giao dien dong nhat.
  return (
    <section className="page-card">
      <div className="page-head">
        <div>
          <h2>{title}</h2>
          {subtitle ? <p className="page-subtitle">{subtitle}</p> : null}
        </div>
        {actions ? <div className="page-actions">{actions}</div> : null}
      </div>
      {children}
    </section>
  );
}

export default PageCard;
