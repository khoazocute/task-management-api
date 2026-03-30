import { Link } from "react-router-dom";

function LandingPage({ auth }) {
  const isLoggedIn = Boolean(auth?.token);

  return (
    <section className="landing-page">
      <div className="landing-hero">
        <div className="landing-copy">
          <span className="landing-tag">TaskFlow Workspace</span>
          <h1>Sap xep cong viec, toi da hieu suat</h1>
          <p>
            Quan ly task, theo doi tien do va giu moi du an gon gang trong mot giao dien sang trong, de dung va
            tap trung vao hieu qua thuc te.
          </p>
          <div className="landing-actions">
            <Link className="primary-button link-button" to={isLoggedIn ? "/workspace" : "/register"}>
              {isLoggedIn ? "Vao workspace" : "Bat dau ngay mien phi"}
            </Link>
            <Link className="ghost-button link-button" to="/tasks">
              Xem khu vuc task
            </Link>
          </div>

          <div className="feature-strip">
            <article className="feature-chip">
              <span className="feature-icon">☑</span>
              <strong>CRUD tasks</strong>
            </article>
            <article className="feature-chip">
              <span className="feature-icon">◌</span>
              <strong>Doi mat khau</strong>
            </article>
            <article className="feature-chip">
              <span className="feature-icon">↺</span>
              <strong>Dat lai mat khau</strong>
            </article>
          </div>
        </div>

        <div className="landing-visual" aria-hidden="true">
          <div className="visual-orbit orbit-left" />
          <div className="visual-orbit orbit-right" />

          <div className="floating-card small top-left">
            <div className="card-bar blue" />
            <div className="card-line" />
            <div className="card-line short" />
          </div>

          <div className="floating-card small mid-left">
            <div className="card-bar green" />
            <div className="card-line" />
            <div className="card-line short" />
          </div>

          <div className="floating-card top-center">
            <div className="mini-check-row">
              <span className="mini-check green" />
              <span className="card-line" />
            </div>
            <div className="mini-check-row">
              <span className="mini-check blue" />
              <span className="card-line short" />
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-header" />
            <div className="chart-bars">
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>

          <div className="workspace-scene">
            <div className="character seated">
              <div className="character-head" />
              <div className="character-body blue" />
            </div>
            <div className="character standing">
              <div className="character-head" />
              <div className="character-body green" />
            </div>
            <div className="character seated second">
              <div className="character-head" />
              <div className="character-body amber" />
            </div>
            <div className="desk" />
            <div className="plant left" />
            <div className="plant right" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default LandingPage;
