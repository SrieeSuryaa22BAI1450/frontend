import { useState } from 'react';
import axios from 'axios';

export default function Register({ onSwitchToLogin }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/auth/register', form);
      setMessage('✅ Registered successfully. You can now log in.');
      setForm({ username: '', password: '' });
    } catch (err) {
      if (err.response?.status === 400) {
        setMessage('❌ Username already exists.');
      } else {
        setMessage('❌ Registration failed. Try again.');
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        /><br />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        /><br />
        <button type="submit">Register</button>
      </form>
      <p>{message}</p>
      <button onClick={onSwitchToLogin}>Back to Login</button>
    </div>
  );
}
