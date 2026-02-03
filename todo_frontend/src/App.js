import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./retro.css";
import Header from "./components/Header";
import TaskInput from "./components/TaskInput";
import Filters, { FILTERS } from "./components/Filters";
import TaskList from "./components/TaskList";
import { tasksApi } from "./services/api";

// PUBLIC_INTERFACE
function App() {
  /** Main app entry: fetches tasks, drives CRUD actions, and renders retro UI. */
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [busyIds, setBusyIds] = useState(() => new Set());
  const [error, setError] = useState(null);

  const totalCount = tasks.length;
  const activeCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  const filteredTasks = useMemo(() => {
    if (filter === "active") return tasks.filter((t) => !t.completed);
    if (filter === "completed") return tasks.filter((t) => t.completed);
    return tasks;
  }, [tasks, filter]);

  const globalDisabled = loading;

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await tasksApi.list();
      setTasks(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e?.message || "Failed to load tasks.");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  function markBusy(id, isBusy) {
    setBusyIds((prev) => {
      const next = new Set(prev);
      if (isBusy) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  async function handleAdd(title) {
    setError(null);
    setLoading(true);
    try {
      const created = await tasksApi.create(title);
      setTasks((prev) => [created, ...prev]);
    } catch (e) {
      setError(e?.message || "Failed to add task.");
    } finally {
      setLoading(false);
    }
  }

  async function handleToggle(task) {
    setError(null);
    markBusy(task.id, true);
    try {
      const updated = await tasksApi.update(task.id, {
        completed: !task.completed,
      });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
    } catch (e) {
      setError(e?.message || "Failed to update task.");
    } finally {
      markBusy(task.id, false);
    }
  }

  async function handleRename(task, title) {
    setError(null);
    markBusy(task.id, true);
    try {
      const updated = await tasksApi.update(task.id, { title });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
    } catch (e) {
      setError(e?.message || "Failed to rename task.");
    } finally {
      markBusy(task.id, false);
    }
  }

  async function handleDelete(task) {
    setError(null);
    markBusy(task.id, true);
    try {
      await tasksApi.remove(task.id);
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
    } catch (e) {
      setError(e?.message || "Failed to delete task.");
      markBusy(task.id, false);
    }
  }

  const anyTaskBusy = busyIds.size > 0;

  return (
    <div className="container">
      <div className="card">
        <Header totalCount={totalCount} activeCount={activeCount} />

        <div className="cardBody stack">
          {error && (
            <div className="banner" role="status" aria-live="polite">
              <p className="bannerTitle">Something went wrong</p>
              <p className="bannerText">
                {error}{" "}
                <button
                  type="button"
                  className="btn btnGhost"
                  onClick={loadTasks}
                  disabled={globalDisabled}
                >
                  Retry
                </button>
              </p>
            </div>
          )}

          <TaskInput onAdd={handleAdd} disabled={globalDisabled} />

          <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap" }}>
            <Filters
              value={filter}
              onChange={setFilter}
              disabled={globalDisabled}
            />
            <span className="badge" aria-label="Completed tasks count">
              {completedCount} completed
            </span>
          </div>

          <TaskList
            tasks={filteredTasks}
            onToggle={(task) => handleToggle(task)}
            onRename={(task, title) => handleRename(task, title)}
            onDelete={(task) => handleDelete(task)}
            disabled={globalDisabled || anyTaskBusy}
          />

          <div className="footerRow" aria-label="Footer status">
            <span>
              Showing <strong>{FILTERS[filter]}</strong> tasks ({filteredTasks.length})
            </span>
            <span>{loading ? "Loading…" : anyTaskBusy ? "Saving…" : "Up to date"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
