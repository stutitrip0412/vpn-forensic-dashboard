const Logo = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center font-bold text-black">
        VF
      </div>

      <div>
        <h2 className="font-bold text-lg leading-none">
          VPN Forensic
        </h2>

        <p className="text-xs text-slate-400">
          Investigation Platform
        </p>
      </div>
    </div>
  );
};

export default Logo;