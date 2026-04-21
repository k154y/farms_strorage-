export default function Button({ children, className = "", variant = "primary", ...props }) {
  const styles = {
    primary: "bg-[#47A369] text-white hover:bg-[#304F3A]",
    secondary: "border border-slate-300 bg-white text-slate-800",
    dark: "bg-[#304F3A] text-white",
  };

  return (
    <button
      className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}