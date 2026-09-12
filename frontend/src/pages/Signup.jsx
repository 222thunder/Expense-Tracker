import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Fingerprint, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register({ username, email, password });
      navigate("/verify-email", { state: { email } });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row-reverse bg-brutal-bg overflow-hidden">
      {/* Right side (visually): Graphic/Typographic */}
      <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-between border-b-3 md:border-b-0 md:border-l-3 border-black bg-brutal-accent text-black relative overflow-hidden">
        {/* Background Noise/Grid */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#000 2px, transparent 2px)",
            backgroundSize: "32px 32px",
          }}
        ></div>
        <a href="/">
          <div className="relative z-10 flex items-center gap-3 justify-end stagger-enter stagger-1">
            <span className="text-3xl font-black tracking-tighter">
              X-PENSE
            </span>

            <div className="w-12 h-12 bg-brutal-blue border-3 border-black brutal-shadow flex items-center justify-center">
              <Fingerprint className="text-white" size={24} strokeWidth={3} />
            </div>
          </div>
        </a>

        <div className="relative z-10 mt-16 md:mt-0 stagger-enter stagger-2 text-right">
          <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black uppercase leading-none tracking-tighter">
            Join
            <br />
            System.
          </h1>
          <p className="mt-6 text-xl font-bold max-w-sm uppercase ml-auto">
            Establish your identity vector and track capital outflows.
          </p>
        </div>

        <div className="relative z-10 text-xl font-bold uppercase tracking-widest border-t-3 border-black/30 pt-6 text-right">
          Onboarding // 2026
        </div>
      </div>

      {/* Left side: Form */}
      <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-center relative bg-brutal-bg">
        <div className="w-full max-w-md stagger-enter stagger-3">
          <div className="mb-12">
            <h2 className="text-5xl font-black mb-4">Create an Account.</h2>
            <p className="text-xl font-bold uppercase text-black/60 mb-8 md:mb-12">
              Join the elite. Register your identity in the system.
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-500 text-white border-3 border-black font-bold uppercase flex items-center gap-3 brutal-shadow">
              <AlertCircle size={24} strokeWidth={3} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label
                className="block text-2xl font-black uppercase tracking-tight"
                htmlFor="name"
              >
                Designation (Name)
              </label>
              <input
                id="name"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-white border-3 border-black p-4 text-xl font-bold placeholder:text-black/30 focus:outline-none focus:border-brutal-blue focus:ring-0 brutal-shadow transition-all"
                placeholder="JOHN DOE"
              />
            </div>

            <div className="space-y-3">
              <label
                className="block text-2xl font-black uppercase tracking-tight"
                htmlFor="email"
              >
                Ident (Email)
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white border-3 border-black p-4 text-xl font-bold placeholder:text-black/30 focus:outline-none focus:border-brutal-blue focus:ring-0 brutal-shadow transition-all"
                placeholder="USER@SYSTEM.COM"
              />
            </div>

            <div className="space-y-3">
              <label
                className="block text-2xl font-black uppercase tracking-tight"
                htmlFor="password"
              >
                Passcode
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white border-3 border-black p-4 text-xl font-bold placeholder:text-black/30 focus:outline-none focus:border-brutal-accent focus:ring-0 brutal-shadow transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !username || !email || !password}
              className="w-full bg-brutal-blue text-white border-3 border-black p-5 text-3xl font-black uppercase flex items-center justify-between group brutal-shadow mt-12 hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{loading ? "Creating..." : "Create Record"}</span>
              <ArrowRight
                size={36}
                strokeWidth={3}
                className="transform group-hover:translate-x-2 transition-transform"
              />
            </button>
          </form>

          <div className="mt-16 text-center border-t-3 border-black pt-8">
            <p className="text-xl font-bold uppercase">
              Already tracked?{" "}
              <Link
                to="/login"
                className="text-brutal-accent hover:bg-brutal-accent hover:text-white px-2 py-1 transition-colors"
              >
                Initialize Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
