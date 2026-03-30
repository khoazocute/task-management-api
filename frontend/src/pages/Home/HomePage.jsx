import { Link } from "react-router-dom";
import PageCard from "../../components/common/PageCard";

function HomePage({ onLogout, userLabel }) {
  return (
    <PageCard
      title="Trang chu"
      subtitle="Khong gian dieu khien hien dai de ban bat dau lam viec va di nhanh vao khu vuc task."
      actions={
        <button className="ghost-button" type="button" onClick={onLogout}>
          Dang xuat
        </button>
      }
    >
      <div className="hero-panel">
        <div className="hero-user-row">
          <div className="hero-avatar">{userLabel.slice(0, 1).toUpperCase()}</div>
          <div>
            <p className="eyebrow">Workspace</p>
            <h3>Xin chao, {userLabel}</h3>
          </div>
        </div>
        <p className="home-copy">
          Ban da dang nhap thanh cong. Tu day ban co the quan ly cong viec, theo doi tien do va giu moi thu gon
          gang trong cung mot khong gian.
        </p>
        <div className="inline-actions">
          <Link className="primary-button link-button" to="/tasks">
            Vao trang task
          </Link>
        </div>
      </div>
    </PageCard>
  );
}

export default HomePage;
