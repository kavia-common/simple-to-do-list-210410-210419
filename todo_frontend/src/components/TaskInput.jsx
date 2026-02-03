import React, { useEffect, useRef, useState } from "react";

// PUBLIC_INTERFACE
export default function TaskInput({ onAdd, disabled }) {
  /** Input row to add a new task. */
  const [title, setTitle] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    // Keep primary action focusable on load for fast keyboard usage.
    inputRef.current?.focus();
  }, []);

  const canSubmit = title.trim().length > 0 && !disabled;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;

    const next = title.trim();
    setTitle("");
    await onAdd(next);

    // Return focus for fast entry.
    inputRef.current?.focus();
  }

  return (
    <form className="row" onSubmit={handleSubmit} aria-label="Add a task">
      <label htmlFor="new-task" className="srOnly">
        New task title
      </label>
      <input
        id="new-task"
        ref={inputRef}
        className="input"
        placeholder="Add a new task…"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={disabled}
      />
      <button className="btn btnPrimary" type="submit" disabled={!canSubmit}>
        Add
      </button>
    </form>
  );
}
