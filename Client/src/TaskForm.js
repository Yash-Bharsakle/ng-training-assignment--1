import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./TaskForm.css";

function TaskForm() {
  const [task, setTask] = useState({
    userid: "",
    username: "",
    status: "Not Started",
    due_date: "",
    priority: "Normal",
    comments: "",
  });

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      axios.get("http://localhost:4000/api/tasks").then((res) => {
        const found = res.data.find((t) => t.userid === parseInt(id));
        if (found) setTask(found);
      });
    }
  }, [id]);

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = id
      ? `http://localhost:4000/api/task/${id}`
      : "http://localhost:4000/api/task";
    const method = id ? axios.put : axios.post;

    method(url, task)
      .then(() => navigate("/"))
      .catch((err) => console.error(err));
  };

  return (
    <div className="modal">
      <div className="modal-content">
         <h2>{id ? 'Edit Task' : 'New Task'}</h2>
        <form onSubmit={handleSubmit}>
          {!id && (
            <div>
              <label><span style={{ color: "red" }}>*</span>Assigned To (id)</label>
              <input
                type="text"
                name="userid"
                value={task.userid}
                placeholder="e.g. 86850"
                onChange={handleChange}
                required
              />
            </div>
          )}
          <div>
            <label><span style={{ color: "red" }}>*</span>Assigned To (Name)</label>
            <input
              type="text"
              name="username"
              value={task.username}
              placeholder="e.g. Yash"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>
              <span style={{ color: "red" }}>*</span> Status
            </label>
            <select
              name="status"
              value={task.status}
              onChange={handleChange}
              required
            >
              <option value="">Select status</option>
              <option>Not Started</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>
          <div>
            <label>Due Date</label>
            <input
              type="date"
              name="due_date"
              value={task.due_date.split("T")[0]}
              onChange={handleChange}
            />
          </div>
          <div>
            <label><span style={{ color: "red" }}>*</span>Priority</label>
            <select
              name="priority"
              value={task.priority}
              onChange={handleChange}
              required
            >
              <option>Low</option>
              <option>Normal</option>
              <option>High</option>
            </select>
          </div>
          <div>
            <label>Description</label>
            <textarea
              name="comments"
              value={task.comments}
              placeholder="Write the description of the task"
              onChange={handleChange}
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={() => navigate("/")}>
              Cancel
            </button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;
