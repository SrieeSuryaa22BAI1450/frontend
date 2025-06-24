import { useState, useEffect } from 'react';
import { getMovies, login } from './api';
import Register from './Register';
import './App.css'; // styles below

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
    } catch {
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
      <div className="container">
        <h2>🎬 Movie Login</h2>
        <form className="card" onSubmit={handleLogin}>
          <input
            placeholder="Username"
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
          />
          <button type="submit">Login</button>
          {authError && <p className="error">{authError}</p>}
        </form>
        <button className="switch" onClick={() => setShowRegister(true)}>
          Create New Account
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="top-bar">
        <h2>🎥 Your Movie List</h2>
        <button className="logout" onClick={logout}>Logout</button>
      </div>
      <div className="movie-list">
        {movies.length === 0 && <p>No movies found.</p>}
        {movies.map((m, i) => (
          <div className="movie-card" key={i}>
            <img src={m.Poster} alt={m.Title} />
            <p><strong>{m.Title}</strong><br />({m.Year})</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
