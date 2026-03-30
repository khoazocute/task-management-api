import { TASK_STATUS_OPTIONS } from "../../../utils/constants";

function TaskItem({ task, onEdit, onDelete, onStatusChange }) {
  return (
    <article className="task-item">
      <div className="task-item-head">
        <div>
          <h3>{task.title}</h3>
          <p>{task.content || "Khong co mo ta"}</p>
        </div>
        <span className={`status-pill ${task.status}`}>{task.status}</span>
      </div>

      <div className="task-actions">
        <select value={task.status} onChange={(event) => onStatusChange(task._id, event.target.value)}>
          {TASK_STATUS_OPTIONS.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>

        <button className="ghost-button" type="button" onClick={() => onEdit(task)}>
          Sua
        </button>

        <button className="danger-button" type="button" onClick={() => onDelete(task._id)}>
          Xoa
        </button>
      </div>
    </article>
  );
}

export default TaskItem;
