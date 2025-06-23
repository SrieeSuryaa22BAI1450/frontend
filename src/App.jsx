import { useState, useEffect } from 'react';
import { getMovies, login } from './api';
import Register from './Register';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [movies, setMovies] = useState([]);
  const [authError, setAuthError] = useState('');
  const [showRegister, setShowRegister] = useState(false);

  const [form, setForm] = useState({ username: '', password: '' });

  const fetchMovies = async () => {
    try {
      const data = await getMovies();
      setMovies(data);
    } catch {
      setAuthError('Failed to fetch movies');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(form.username, form.password);
      setIsLoggedIn(true);
      setAuthError('');
      fetchMovies();
    } catch (err) {
      setAuthError('Invalid username or password');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setMovies([]);
    setAuthError('');
  };

  useEffect(() => {
    if (localStorage.getItem('token')) {
      setIsLoggedIn(true);
      fetchMovies();
    }
  }, []);

  if (showRegister) {
    return <Register onSwitchToLogin={() => setShowRegister(false)} />;
  }

  if (!isLoggedIn) {
    return (
      <div style={{ padding: '20px' }}>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            placeholder="Username"
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
            required
          /><br />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
          /><br />
          <button type="submit">Login</button>
        </form>
        <p style={{ color: 'red' }}>{authError}</p>
        <button onClick={() => setShowRegister(true)}>Create New Account</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Movies</h2>
      <button onClick={logout}>Logout</button>
      <ul>
        {movies.map((m, i) => (
          <li key={i}>{m.title} ({m.year})</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
