import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

// The base URL of your Spring Boot API
const API_URL = 'https://my-app-production-1234.up.railway.app/api/users';

function App() {
  // State to hold the list of users
  const [users, setUsers] = useState([]);
  // State for the form inputs
  const [formData, setFormData] = useState({ username: '', email: '' });
  // State to track if we are editing a user and which one
  const [editingUser, setEditingUser] = useState(null);

  // Function to fetch all users from the API
  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, []);

  // useEffect hook to fetch users when the component first loads
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Function to handle changes in the form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Function to handle form submission (for both creating and updating)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email) {
      alert('Username and email cannot be empty');
      return;
    }

    const method = editingUser ? 'PUT' : 'POST';
    const url = editingUser ? `${API_URL}/${editingUser.id}` : API_URL;

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save user');
      }

      // Reset form and editing state, then refresh the user list
      setFormData({ username: '', email: '' });
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  // Function to handle the "Edit" button click
  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ username: user.username, email: user.email });
  };

  // Function to handle the "Delete" button click
  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`${API_URL}/${userId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete user');
        }
        // Refresh the user list
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  // Function to cancel the edit mode
  const cancelEdit = () => {
    setEditingUser(null);
    setFormData({ username: '', email: '' });
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>User Management Dashboard</h1>
      </header>
      <main className="app-main">
        <div className="form-container">
          <h2>{editingUser ? 'Edit User' : 'Add New User'}</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <div className="form-buttons">
              <button type="submit" className="btn-submit">
                {editingUser ? 'Update User' : 'Add User'}
              </button>
              {editingUser && (
                <button type="button" className="btn-cancel" onClick={cancelEdit}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="user-list-container">
          <h2>User List</h2>
          {users.length > 0 ? (
            <ul className="user-list">
              {users.map((user) => (
                <li key={user.id} className="user-item">
                  <div className="user-info">
                    <span className="user-name">{user.username}</span>
                    <span className="user-email">{user.email}</span>
                  </div>
                  <div className="user-actions">
                    <button className="btn-edit" onClick={() => handleEdit(user)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(user.id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No users found. Add one using the form above!</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
