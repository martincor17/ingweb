import React, { useState } from 'react';
import { supabase } from './supabaseClient'; // Replace with your Supabase setup

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); // State to toggle between login and register forms

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      // Log in with Supabase
      const { error, user } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('Failed to log in:', error);
      }
    } else {
      // Register with Supabase
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        console.error('Failed to register:', error);
      }
    }
  };

  return (
    <div>
      {isLogin ? (
        <h2>Login</h2>
      ) : (
        <h2>Register</h2>
      )}
      <form onSubmit={handleFormSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>
      {isLogin ? (
        <p>
          Don't have an account?{' '}
          <span onClick={() => setIsLogin(false)}>Register here</span>
        </p>
      ) : (
        <p>
          Already have an account?{' '}
          <span onClick={() => setIsLogin(true)}>Login here</span>
        </p>
      )}
    </div>
  );
};

export default AuthForm;
