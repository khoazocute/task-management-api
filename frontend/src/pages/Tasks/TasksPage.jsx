import { useEffect, useState } from "react";
import PageCard from "../../components/common/PageCard";
import FormMessage from "../../components/common/FormMessage";
import TaskFilter from "./components/TaskFilter";
import TaskForm from "./components/TaskForm";
import TaskItem from "./components/TaskItem";
import { changeTaskStatus, createTask, deleteTask, getTasks, updateTask } from "../../services/taskService";

function TasksPage({ auth, onLogout, userLabel }) {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [query, setQuery] = useState({ keyword: "", status: "", page: 1 });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [form, setForm] = useState({ title: "", status: "initial", content: "" });

  async function loadTasks(currentQuery = query) {
    setLoading(true);
    setError("");

    try {
      const result = await getTasks(currentQuery);
      setTasks(result.data || []);
      setPagination(result.pagination || null);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function resetForm() {
    setEditingTask(null);
    setForm({ title: "", status: "initial", content: "" });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const result = editingTask
        ? await updateTask(editingTask._id, form)
        : await createTask(form);

      setMessage(result.message || "Da luu task");
      resetForm();
      loadTasks();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function handleDelete(taskId) {
    setMessage("");
    setError("");

    try {
      const result = await deleteTask(taskId);
      setMessage(result.message || "Da xoa task");

      if (editingTask?._id === taskId) {
        resetForm();
      }

      loadTasks();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function handleStatusChange(taskId, status) {
    setMessage("");
    setError("");

    try {
      const result = await changeTaskStatus(taskId, status);
      setMessage(result.message || "Da cap nhat trang thai");
      loadTasks();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  function startEdit(task) {
    setEditingTask(task);
    setForm({
      title: task.title || "",
      status: task.status || "initial",
      content: task.content || "",
    });
  }

  function handleFilterSubmit() {
    const nextQuery = { ...query, page: 1 };
    setQuery(nextQuery);
    loadTasks(nextQuery);
  }

  function goToPreviousPage() {
    const nextQuery = { ...query, page: pagination.currentPage - 1 };
    setQuery(nextQuery);
    loadTasks(nextQuery);
  }

  function goToNextPage() {
    const nextQuery = { ...query, page: pagination.currentPage + 1 };
    setQuery(nextQuery);
    loadTasks(nextQuery);
  }

  return (
    <div className="tasks-grid">
      <PageCard
        title="Task Dashboard"
        subtitle="Quan ly danh sach cong viec, loc theo trang thai va thao tac CRUD."
        actions={
          <button className="ghost-button" type="button" onClick={onLogout}>
            Dang xuat
          </button>
        }
      >
        <div className="info-banner">
          <span>Khong gian lam viec cua</span>
          <code>{userLabel || auth.displayName || auth.email || "Nguoi dung hien tai"}</code>
        </div>

        <TaskFilter query={query} setQuery={setQuery} onSubmit={handleFilterSubmit} />

        <FormMessage type="success">{message}</FormMessage>
        <FormMessage type="error">{error}</FormMessage>

        {loading ? <p className="loading-text">Dang tai danh sach task...</p> : null}

        <div className="task-list">
          {tasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onEdit={startEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}

          {!loading && tasks.length === 0 ? <p className="empty-state">Chua co task nao phu hop.</p> : null}
        </div>

        {pagination ? (
          <div className="pagination-row">
            <button
              className="ghost-button"
              type="button"
              disabled={pagination.currentPage <= 1}
              onClick={goToPreviousPage}
            >
              Trang truoc
            </button>

            <span>
              Trang {pagination.currentPage} / {pagination.totalPage}
            </span>

            <button
              className="ghost-button"
              type="button"
              disabled={pagination.currentPage >= pagination.totalPage}
              onClick={goToNextPage}
            >
              Trang sau
            </button>
          </div>
        ) : null}
      </PageCard>

      <TaskForm
        editingTask={editingTask}
        form={form}
        setForm={setForm}
        onSubmit={handleSubmit}
        onReset={resetForm}
      />
    </div>
  );
}

export default TasksPage;
