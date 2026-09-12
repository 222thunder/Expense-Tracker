import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Activity, Shield, Zap } from "lucide-react";
import Navbar from "../components/Header/Navbar";
import Footer from "../components/Footer/Footer";

export default function Landing() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] },
    },
  };

  return (
    <div className="min-h-screen bg-[var(--color-brutal-bg)] text-[var(--color-brutal-black)] font-body selection:bg-[var(--color-brutal-accent)] selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative border-b-3 border-black overflow-hidden">
        {/* Noise Grid */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#0a0a0a 2px, transparent 2px)",
            backgroundSize: "48px 48px",
          }}
        ></div>

        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-2/3 p-8 md:p-16 lg:p-24 lg:border-r-3 border-black relative z-10 flex flex-col justify-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <motion.div
                variants={itemVariants}
                className="inline-block border-3 border-black px-4 py-1 mb-8 bg-[var(--color-brutal-blue)] text-white font-bold uppercase tracking-widest text-sm"
              >
                System v2.0 Live
              </motion.div>
              <motion.h1
                variants={itemVariants}
                className="text-[4rem] md:text-[6rem] lg:text-[8rem] leading-[0.85] font-black uppercase tracking-tighter mb-8"
              >
                Master
                <br />
                Your
                <br />
                <span className="text-[var(--color-brutal-accent)]">
                  Capital.
                </span>
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="text-xl md:text-2xl font-bold max-w-2xl mb-12 uppercase text-black/80"
              >
                Stop using soft, floaty apps to manage hard earned currency.
                X-Pense is the brutalist ledger for those who demand control.
              </motion.p>
              <motion.div variants={itemVariants}>
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-4 bg-[var(--color-brutal-black)] text-white border-3 border-black px-8 py-5 text-2xl font-black uppercase group brutal-shadow hover:bg-[var(--color-brutal-blue)] transition-colors"
                >
                  <span>Enter the System</span>
                  <ArrowRight
                    size={28}
                    strokeWidth={3}
                    className="group-hover:translate-x-2 transition-transform"
                  />
                </Link>
              </motion.div>
            </motion.div>
          </div>

          <div className="lg:w-1/3 bg-[var(--color-brutal-accent)] border-t-3 lg:border-t-0 border-black flex flex-col items-center justify-center p-8 relative overflow-hidden min-h-[400px]">
            {/* Abstract Graphic */}
            <motion.div
              initial={{ rotate: -10, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
              className="w-full max-w-[300px] aspect-square bg-[var(--color-brutal-bg)] border-3 border-black brutal-shadow flex items-center justify-center relative z-10"
            >
              <div className="absolute inset-4 border-3 border-black border-dashed opacity-30"></div>
              <Activity
                size={120}
                strokeWidth={1.5}
                className="text-[var(--color-brutal-black)]"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Marquee Divider */}
      <div className="border-b-3 border-black bg-[var(--color-brutal-black)] text-white py-4 overflow-hidden whitespace-nowrap flex">
        <motion.div
          animate={{ x: [0, -1035] }}
          transition={{ ease: "linear", duration: 10, repeat: Infinity }}
          className="text-2xl font-black uppercase tracking-widest flex gap-8"
        >
          <span>// NO MERCY FOR BAD DATA</span>
          <span className="text-[var(--color-brutal-accent)]">*</span>
          <span>// TOTAL CONTROL</span>
          <span className="text-[var(--color-brutal-accent)]">*</span>
          <span>// PRECISION LOGGING</span>
          <span className="text-[var(--color-brutal-accent)]">*</span>
          <span>// NO MERCY FOR BAD DATA</span>
          <span className="text-[var(--color-brutal-accent)]">*</span>
          <span>// TOTAL CONTROL</span>
          <span className="text-[var(--color-brutal-accent)]">*</span>
          <span>// PRECISION LOGGING</span>
          <span className="text-[var(--color-brutal-accent)]">*</span>
        </motion.div>
      </div>

      {/* Features Grid */}
      <section className="bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="p-12 border-b-3 md:border-b-0 md:border-r-3 border-black flex flex-col group hover:bg-[var(--color-brutal-bg)] transition-colors">
            <div className="w-16 h-16 border-3 border-black bg-[var(--color-brutal-blue)] text-white flex items-center justify-center brutal-shadow mb-8 group-hover:scale-110 transition-transform">
              <Zap size={32} strokeWidth={3} />
            </div>
            <h3 className="text-3xl font-black uppercase mb-4">Hyper Fast</h3>
            <p className="text-lg font-bold text-black/70">
              Engineered for immediate response. No loading spinners, no soft
              transitions. Instant data entry.
            </p>
          </div>

          <div className="p-12 border-b-3 md:border-b-0 md:border-r-3 border-black flex flex-col group hover:bg-[var(--color-brutal-bg)] transition-colors">
            <div className="w-16 h-16 border-3 border-black bg-brutal-accent text-white flex items-center justify-center brutal-shadow mb-8 group-hover:scale-110 transition-transform">
              <Shield size={32} strokeWidth={3} />
            </div>
            <h3 className="text-3xl font-black uppercase mb-4">Bulletproof</h3>
            <p className="text-lg font-bold text-black/70">
              Your financial data locked down with unyielding structural
              integrity. Zero compromise on security.
            </p>
          </div>

          <div className="p-12 flex flex-col justify-center bg-brutal-black text-white border-b-3 md:border-b-0 border-black">
            <h3 className="text-4xl lg:text-5xl font-black uppercase leading-tight">
              Execute
              <br />
              Without
              <br />
              Hesitation.
            </h3>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
