"use client";

import { useState } from "react";
import { useContract } from "../hooks/useContract";

export default function SampleChecklist() {
  const { account, tasks, loading, error, addTask, markCompleted } = useContract();
  const [newTask, setNewTask] = useState("");

  if (!account) {
    return <div>Please connect your wallet to continue.</div>;
  }

  if (loading) {
    return <div>Loading checklist...</div>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Blockchain Checklist</h2>
      <p><strong>Connected:</strong> {account}</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          value={newTask}
          placeholder="Enter new task"
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={() => {
          addTask(newTask);
          setNewTask("");
        }}>
          Add Task
        </button>
      </div>

      <ul>
        {tasks.map((task, index) => (
          <li key={index} style={{ marginBottom: "0.5rem" }}>
            <span
              style={{
                textDecoration: task.completed ? "line-through" : "none",
                marginRight: "10px"
              }}
            >
              {task.text}
            </span>

            {!task.completed && (
              <button onClick={() => markCompleted(index)}>
                Mark Done
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
