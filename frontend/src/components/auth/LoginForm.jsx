import { useState } from "react";
import { User, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const LoginForm = () => {

  const navigate = useNavigate();

  const { login } = useAuth();

  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    setLoading(true);

    try {

      await login(username, password);

      navigate("/");

    } catch (err) {

      setError(

        err.response?.data?.error ||

        "Login failed."

      );

    }

    setLoading(false);

  };

  return (

    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >

      <div>

        <label className="block mb-2 text-sm text-slate-400">

          Username

        </label>

        <div className="relative">

          <User
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            size={18}
          />

          <input
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-11 pr-4"
            placeholder="Username"
          />

        </div>

      </div>

      <div>

        <label className="block mb-2 text-sm text-slate-400">

          Password

        </label>

        <div className="relative">

          <Lock
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            size={18}
          />

          <input
            type="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-11 pr-4"
            placeholder="Password"
          />

        </div>

      </div>

      {error && (

        <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-red-400">

          {error}

        </div>

      )}

      <button
        disabled={loading}
        className="w-full bg-cyan-600 hover:bg-cyan-700 rounded-xl py-3 font-semibold disabled:opacity-60"
      >

        {loading ? "Signing In..." : "Login"}

      </button>

    </form>

  );

};

export default LoginForm;