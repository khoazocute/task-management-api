import { FILTER_STATUS_OPTIONS } from "../../../utils/constants";

function TaskFilter({ query, setQuery, onSubmit }) {
  return (
    <form
      className="filter-bar"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <input
        value={query.keyword}
        onChange={(event) => setQuery({ ...query, keyword: event.target.value })}
        placeholder="Tim theo title"
      />

      <select
        value={query.status}
        onChange={(event) => setQuery({ ...query, status: event.target.value })}
      >
        {FILTER_STATUS_OPTIONS.map((status) => (
          <option key={status.value} value={status.value}>
            {status.label}
          </option>
        ))}
      </select>

      <button className="primary-button" type="submit">
        Loc task
      </button>
    </form>
  );
}

export default TaskFilter;
