import React from "react";

export const FILTERS = {
  all: "All",
  active: "Active",
  completed: "Completed",
};

// PUBLIC_INTERFACE
export default function Filters({ value, onChange, disabled }) {
  /** Filter toggle group for task list. */
  return (
    <div className="filters" role="group" aria-label="Task filters">
      {Object.entries(FILTERS).map(([key, label]) => (
        <button
          key={key}
          type="button"
          className="btn btnGhost filterBtn"
          aria-pressed={value === key}
          onClick={() => onChange(key)}
          disabled={disabled}
        >
          {label}
        </button>
      ))}
      <span className="kbdHint">Tip: Enter to save edits, Esc to cancel.</span>
    </div>
  );
}
