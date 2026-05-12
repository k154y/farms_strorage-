export default function Button({ children, className = "", variant = "primary", ...props }) {
  const styles = {
    primary: "bg-[#47A369] text-white hover:bg-[#304F3A] hover:shadow-md",
    secondary: "border border-slate-300 bg-white text-slate-800 hover:border-[#47A369]/40 hover:text-[#304F3A] hover:shadow-sm",
    dark: "bg-[#304F3A] text-white hover:bg-[#223729] hover:shadow-md",
  };

  return (
    <button
      className={`cursor-pointer rounded-xl px-4 py-3 text-sm font-semibold transition duration-150 hover:-translate-y-0.5 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
