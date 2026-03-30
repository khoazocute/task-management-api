import PageCard from "../../../components/common/PageCard";
import { TASK_STATUS_OPTIONS } from "../../../utils/constants";

function TaskForm({ editingTask, form, setForm, onSubmit, onReset }) {
  return (
    <PageCard
      title={editingTask ? "Sua task" : "Tao task moi"}
      subtitle="Form nay goi truc tiep cac API create va edit cua backend."
    >
      <form className="stack-form" onSubmit={onSubmit}>
        <label>
          Tieu de
          <input
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            placeholder="Nhap ten cong viec"
          />
        </label>

        <label>
          Trang thai
          <select
            value={form.status}
            onChange={(event) => setForm({ ...form, status: event.target.value })}
          >
            {TASK_STATUS_OPTIONS.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Noi dung
          <textarea
            value={form.content}
            onChange={(event) => setForm({ ...form, content: event.target.value })}
            rows="6"
            placeholder="Mo ta cong viec"
          />
        </label>

        <div className="inline-actions">
          <button className="primary-button" type="submit">
            {editingTask ? "Cap nhat task" : "Tao task"}
          </button>
          <button className="ghost-button" type="button" onClick={onReset}>
            Lam moi form
          </button>
        </div>
      </form>
    </PageCard>
  );
}

export default TaskForm;
