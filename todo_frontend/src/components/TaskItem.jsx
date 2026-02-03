import React, { useEffect, useRef, useState } from "react";

// PUBLIC_INTERFACE
export default function TaskItem({
  task,
  onToggle,
  onDelete,
  onRename,
  disabled,
}) {
  /** Renders one task row with checkbox, inline edit, and delete. */
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);
  const editRef = useRef(null);
  const titleButtonRef = useRef(null);

  useEffect(() => {
    setDraft(task.title);
  }, [task.title]);

  useEffect(() => {
    if (isEditing) {
      editRef.current?.focus();
      editRef.current?.select();
    }
  }, [isEditing]);

  function startEdit() {
    if (disabled) return;
    setIsEditing(true);
  }

  function cancelEdit() {
    setDraft(task.title);
    setIsEditing(false);
    titleButtonRef.current?.focus();
  }

  async function commitEdit() {
    const next = draft.trim();
    if (!next) {
      // Don't allow empty title; revert silently.
      cancelEdit();
      return;
    }
    if (next !== task.title) {
      await onRename(task, next);
    }
    setIsEditing(false);
    titleButtonRef.current?.focus();
  }

  async function handleEditKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      await commitEdit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancelEdit();
    }
  }

  return (
    <li className="taskItem">
      <input
        className="checkbox"
        type="checkbox"
        checked={!!task.completed}
        onChange={() => onToggle(task)}
        disabled={disabled}
        aria-label={task.completed ? "Mark task incomplete" : "Mark task complete"}
      />

      <div>
        {!isEditing ? (
          <button
            type="button"
            className="btn btnGhost"
            onClick={startEdit}
            ref={titleButtonRef}
            disabled={disabled}
            aria-label="Edit task title"
            style={{ textAlign: "left", width: "100%" }}
          >
            <p
              className={
                "taskTitle " + (task.completed ? "taskTitleCompleted" : "")
              }
              style={{ margin: 0 }}
            >
              {task.title}
            </p>
          </button>
        ) : (
          <div className="row">
            <label htmlFor={`edit-${task.id}`} className="srOnly">
              Edit task title
            </label>
            <input
              id={`edit-${task.id}`}
              ref={editRef}
              className="input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleEditKeyDown}
              disabled={disabled}
            />
            <button
              type="button"
              className="btn btnPrimary"
              onClick={commitEdit}
              disabled={disabled}
            >
              Save
            </button>
            <button
              type="button"
              className="btn"
              onClick={cancelEdit}
              disabled={disabled}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="taskActions">
        {!isEditing && (
          <button
            type="button"
            className="btn"
            onClick={startEdit}
            disabled={disabled}
          >
            Edit
          </button>
        )}
        <button
          type="button"
          className="btn btnDanger"
          onClick={() => onDelete(task)}
          disabled={disabled}
          aria-label="Delete task"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
