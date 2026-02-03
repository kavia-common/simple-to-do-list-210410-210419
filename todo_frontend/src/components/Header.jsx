import React from "react";
import { getApiBaseUrl } from "../config";

// PUBLIC_INTERFACE
export default function Header({ totalCount, activeCount }) {
  /** Top header for the app, with counters and backend indicator. */
  const base = getApiBaseUrl();
  const backendLabel = base ? "Backend connected" : "Backend not configured";

  return (
    <div className="cardHeader retro-grain">
      <div className="titleRow">
        <div>
          <h1 className="h1">Retro Tasks</h1>
          <p className="subtitle">
            Add, edit, complete and filter — persisted via API.
          </p>
        </div>

        <div className="pill" title={base ? base : "Set REACT_APP_API_BASE or REACT_APP_BACKEND_URL"}>
          <span className="badge">{backendLabel}</span>
          <span className="badge">{activeCount} active</span>
          <span className="badge">{totalCount} total</span>
        </div>
      </div>
    </div>
  );
}
