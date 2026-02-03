import React from "react";
import TaskItem from "./TaskItem";

// PUBLIC_INTERFACE
export default function TaskList({
  tasks,
  onToggle,
  onDelete,
  onRename,
  disabled,
}) {
  /** List wrapper for tasks. */
  if (tasks.length === 0) {
    return (
      <div className="banner" style={{ borderColor: "rgba(59, 130, 246, 0.25)", background: "rgba(59, 130, 246, 0.06)", color: "#0b2a66" }}>
        <p className="bannerTitle">No tasks yet</p>
        <p className="bannerText" style={{ color: "#0b2a66" }}>
          Add a task above to get started.
        </p>
      </div>
    );
  }

  return (
    <ul className="taskList" aria-label="Task list">
      {tasks.map((t) => (
        <TaskItem
          key={t.id}
          task={t}
          onToggle={onToggle}
          onDelete={onDelete}
          onRename={onRename}
          disabled={disabled}
        />
      ))}
    </ul>
  );
}
