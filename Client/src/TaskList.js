import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DeleteConfirm from './DeleteConfirm';
import './TaskList.css';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:4000/api/tasks')
      .then(res => setTasks(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleDelete = () => {
    axios.delete(`http://localhost:4000/api/task/${selectedTask.userid}`)
      .then(() => {
        setTasks(tasks.filter(task => task.userid !== selectedTask.userid));
        setSelectedTask(null);
      });
  };

  const filteredTasks = tasks.filter(task =>
    task.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="task-container">
      <div className="task-header">
        <h2>Tasks</h2>
        <button onClick={() => navigate('/new')}>New Task</button>
      </div>
       <div className="record-count">
    {filteredTasks.length} record{filteredTasks.length !== 1 ? 's' : ''}
  </div>

      <div className="task-search">
        <input
          type="text"
          placeholder="Search by Assigned To"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Assigned To</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Priority</th>
            <th>Comments</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map(task => (
            <tr key={task.userid}>
              <td>{task.username}</td>
              <td>{task.status}</td>
              <td>{new Date(task.due_date).toLocaleDateString()}</td>
              <td>{task.priority}</td>
              <td>{task.comments}</td>
              <td>
                <button
                  className="action-btn edit-btn"
                  onClick={() => navigate(`/edit/${task.userid}`)}
                >
                  Edit
                </button>
                <button
                  className="action-btn delete-btn"
                  onClick={() => setSelectedTask(task)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedTask && (
        <DeleteConfirm
          task={selectedTask}
          onConfirm={handleDelete}
          onCancel={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
}

export default TaskList;