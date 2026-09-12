import { useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, Mail, RefreshCw, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function VerifyEmail() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyEmail } = useAuth();
  const email = location.state?.email || "your-email@system.com";

  const handleChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Auto-focus previous input on backspace
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = code.join("");
    if (otp.length !== 6) return;

    setError(null);
    setLoading(true);
    try {
      await verifyEmail(email, otp);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[var(--color-brutal-bg)] overflow-hidden">
      
      {/* Left/Top Side: Massive Typography & Context */}
      <div className="lg:w-1/2 p-8 md:p-16 flex flex-col justify-between border-b-3 lg:border-b-0 lg:border-r-3 border-black bg-[var(--color-brutal-black)] text-white relative overflow-hidden">
        
        {/* Abstract Grid Noise */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(#fff 2px, transparent 2px)", backgroundSize: "48px 48px" }}></div>

        <div className="relative z-10 flex items-center gap-3 stagger-enter stagger-1">
          <div className="w-12 h-12 bg-white border-3 border-black flex items-center justify-center">
            <Mail className="text-black" size={24} strokeWidth={3} />
          </div>
          <span className="text-3xl font-black tracking-tighter">X-PENSE</span>
        </div>

        <div className="relative z-10 mt-16 md:mt-24 mb-12 stagger-enter stagger-2">
          <h1 className="text-[4.5rem] md:text-[6rem] lg:text-[7rem] leading-[0.85] font-black uppercase tracking-tighter mix-blend-difference">
            Protocol
            <br />
            <span className="text-[var(--color-brutal-blue)] text-shadow-solid">Verify.</span>
          </h1>
        </div>

        <div className="relative z-10 flex justify-between items-end border-t-3 border-white/30 pt-6">
          <div className="text-xl font-bold uppercase tracking-widest">
            Protocol // 0x4B
          </div>
          <div className="text-xl font-bold text-[var(--color-brutal-blue)] uppercase">
            Awaiting Input
          </div>
        </div>
      </div>

      {/* Right/Bottom Side: Verification Form */}
      <div className="lg:w-1/2 p-8 md:p-16 lg:p-24 flex items-center justify-center relative bg-[var(--color-brutal-bg)]">
        <div className="w-full max-w-xl stagger-enter stagger-3">
          <div className="mb-12">
            <h2 className="text-5xl font-black mb-4">Verify Identity</h2>
            <p className="text-xl font-bold text-black/60 uppercase">
              Enter the 6-digit code sent to <br />
              <span className="text-black">{email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {error && (
              <div className="bg-[var(--color-brutal-accent)] text-white p-4 flex items-start gap-3 border-3 border-black brutal-shadow">
                <AlertCircle className="mt-0.5 shrink-0" size={24} strokeWidth={3} />
                <p className="font-bold uppercase text-lg leading-tight">{error}</p>
              </div>
            )}

            <div className="flex gap-2 sm:gap-4 justify-between">
              {code.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputRefs.current[idx] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-12 h-16 sm:w-16 sm:h-20 md:w-20 md:h-24 text-center text-4xl md:text-5xl font-black bg-white border-3 border-black brutal-shadow focus:outline-none focus:-translate-y-1 focus:-translate-x-1 focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
                  placeholder="0"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading || code.some(d => !d)}
              className="w-full bg-[var(--color-brutal-blue)] text-white text-3xl font-black uppercase p-6 border-3 border-black brutal-shadow flex justify-between items-center group hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{loading ? "Validating..." : "Confirm"}</span>
              <ArrowRight size={36} strokeWidth={4} className="transform group-hover:translate-x-2 transition-transform" />
            </button>
          </form>

          {/* Auxiliary Actions */}
          <div className="mt-16 flex flex-col sm:flex-row gap-6 justify-between items-center border-t-3 border-black pt-8">
            <button className="flex items-center gap-2 text-xl font-bold uppercase text-[var(--color-brutal-accent)] hover:text-black transition-colors group">
              <RefreshCw size={24} strokeWidth={3} className="group-hover:rotate-180 transition-transform duration-500" />
              <span>Resend Signal</span>
            </button>
            <Link to="/login" className="text-xl font-bold uppercase text-black/50 hover:text-black transition-colors">
              Abort & Return
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
