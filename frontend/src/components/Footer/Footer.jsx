export default function Footer() {
  return (
    <footer className="p-8 md:p-16 flex flex-col md:flex-row justify-between items-start md:items-end bg-[var(--color-brutal-bg)] border-t-3 border-black">
      <div>
        <span className="text-5xl font-black tracking-tighter block mb-4 text-black uppercase">X-PENSE</span>
        <p className="font-bold uppercase text-black/50">© 2026 / System Offline</p>
      </div>
      <div className="mt-8 md:mt-0 font-bold uppercase text-right border-l-4 border-[var(--color-brutal-accent)] pl-4 text-black">
        <p>Status: Operational</p>
        <p>Version: 2.0.4-BRUTAL</p>
      </div>
    </footer>
  );
}
