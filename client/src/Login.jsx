import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/login', {
      username: username,
      password: password
    })
    .then((response) => {
        if(response.data.message) {
           setError("❌ " + response.data.message);
        } else {
           navigate('/dashboard');
        }
    })
    .catch(err => setError("Server Error: Please try again later."));
  };

  return (
    // 1. MAIN BACKGROUND (Deep Blue Gradient)
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 relative overflow-hidden font-sans">
      
      {/* 2. ABSTRACT BACKGROUND SHAPES (CSS Only - No Image download needed) */}
      {/* Top Left Squiggle */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-cyan-400 rounded-full mix-blend-overlay filter blur-xl opacity-60 animate-pulse"></div>
      <div className="absolute top-20 left-20 w-48 h-48 bg-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-60"></div>
      
      {/* Bottom Right Shape */}
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-blue-500 rounded-full mix-blend-color-dodge filter blur-3xl opacity-40"></div>
      <div className="absolute bottom-20 right-32 w-32 h-32 bg-cyan-300 rounded-full mix-blend-overlay filter blur-xl opacity-50"></div>

      {/* 3. THE GLASS LOGIN CARD */}
      <div className="relative z-10 w-full max-w-sm p-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h3 className="text-white/80 text-sm font-semibold uppercase tracking-widest mb-1"></h3>
          <h1 className="text-4xl font-bold text-white tracking-tight">Login</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* Username */}
          <div>
            <label className="block text-white text-sm mb-1 ml-1">Email</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-lg bg-white border-none outline-none text-slate-800 placeholder-slate-400 font-medium focus:ring-2 focus:ring-blue-300 transition shadow-inner"
              placeholder="username@gmail.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-white text-sm mb-1 ml-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-lg bg-white border-none outline-none text-slate-800 placeholder-slate-400 font-medium focus:ring-2 focus:ring-blue-300 transition shadow-inner"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <a href="#" className="text-xs text-white/80 hover:text-white hover:underline transition">
              Forgot Password?
            </a>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-100 text-sm text-center py-2 rounded-lg">
              {error}
            </div>
          )}

          {/* Submit Button (Dark Blue) */}
          <button
            type="submit"
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg shadow-lg transform transition hover:scale-[1.02] active:scale-95"
          >
            Sign in
          </button>

        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-white/60 text-xs">
             <a href="#" className="text-white font-bold hover:underline"></a>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;