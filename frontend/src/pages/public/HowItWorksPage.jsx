export default function HowItWorksPage() {
  const steps = [
    "Register as Farmer, Storage Manager, or Transporter",
    "Storage and transporter accounts submit verification",
    "Admin reviews and approves accounts",
    "Farmer books storage and requests transport",
    "Farmer lists produce in marketplace and receives orders",
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-4xl font-bold text-slate-900">How It Works</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {steps.map((step, i) => (
          <div key={i} className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="text-3xl font-black text-[#47A369]">0{i + 1}</div>
            <p className="mt-4 text-slate-700">{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
}