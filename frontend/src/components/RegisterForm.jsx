import { useState } from "react";

export default function RegisterForm({ onRegister }) {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await onRegister({ firstname, lastname, email, password });
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">First Name</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            required
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Last Name</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        disabled={loading}
      >
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  );
}
