export default function SearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full rounded-xl border border-slate-300 px-4 py-3"
    />
  );
}