export default function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        {subtitle && <p className="mt-1 text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}