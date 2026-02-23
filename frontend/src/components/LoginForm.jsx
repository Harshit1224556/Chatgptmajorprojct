import { useState } from "react";

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await onLogin({ email, password });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6 bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto animate-fadeIn" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">Sign In to ChatGPT Clone</h2>
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
        <input
          type="email"
          className="w-full border border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-gray-50 text-gray-900 transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
        <input
          type="password"
          className="w-full border border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-gray-50 text-gray-900 transition"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <div className="text-red-500 text-sm text-center">{error}</div>}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg disabled:opacity-60"
        disabled={loading}
      >
        {loading ? (
          <span>
            <svg className="w-5 h-5 inline mr-2 animate-spin" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /></svg>
            Logging in...
          </span>
        ) : "Login"}
      </button>
      <div className="text-xs text-gray-400 text-center mt-4">Your credentials are secure and encrypted.</div>
    </form>
  );
}
