import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import api from '../services/api.js';

const Login = () => {
    const [ form, setForm ] = useState({ email: '', password: '' });
    const [ submitting, setSubmitting ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState('');
    const navigate = useNavigate();
    

    function handleChange(e) {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    }

async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    try {
        const res = await api.post('/auth/login', {
            email: form.email,
            password: form.password
        });

        // ⭐ store user in localStorage or redux
        localStorage.setItem("user", JSON.stringify(res.data.user));

        navigate("/home");   // go to home after login

    } catch (err) {
        console.error(err);
        setErrorMessage(err?.response?.data?.message || 'Sign in failed.');
    } finally {
        setSubmitting(false);
    }
}


    return (
        <div className="center-min-h-screen">
            <div className="auth-card" role="main" aria-labelledby="login-heading">
                <header className="auth-header">
                    <h1 id="login-heading">Sign in</h1>
                    <p className="auth-sub">Welcome back. We've missed you.</p>
                </header>
                <form className="auth-form" onSubmit={handleSubmit} noValidate>
                    <div className="field-group">
                        <label htmlFor="login-email">Email</label>
                        <input id="login-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
                    </div>
                    <div className="field-group">
                        <label htmlFor="login-password">Password</label>
                        <input id="login-password" name="password" type="password" autoComplete="current-password" placeholder="Your password" value={form.password} onChange={handleChange} required />
                    </div>
                    {errorMessage && <p role="alert" style={{ color: 'var(--color-danger)', margin: 0 }}>{errorMessage}</p>}
                    <button type="submit" className="primary-btn" disabled={submitting}>
                        {submitting ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>
                <p className="auth-alt">Need an account? <Link to="/register">Create one</Link></p>
            </div>
        </div>
    );
};

export default Login;
