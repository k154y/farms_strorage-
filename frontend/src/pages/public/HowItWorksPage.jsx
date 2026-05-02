import { ArrowRight, ClipboardCheck, ShieldCheck, Snowflake, Store, Truck } from "lucide-react";
import { Link } from "react-router-dom";

const steps = [
  {
    icon: ClipboardCheck,
    step: "Step 1",
    title: "Choose the right account",
    description:
      "Farmers, storage managers, and transporters start with role-based accounts built around the work they actually do.",
  },
  {
    icon: ShieldCheck,
    step: "Step 2",
    title: "Complete verification",
    description:
      "Storage and transport accounts finish profile details, upload documents, and wait for review before going live.",
  },
  {
    icon: Snowflake,
    step: "Step 3",
    title: "Book storage with context",
    description:
      "Farmers compare facilities, room availability, and location details before sending a booking request.",
  },
  {
    icon: Truck,
    step: "Step 4",
    title: "Coordinate delivery",
    description:
      "Transport requests can be linked to bookings so pickup and delivery are handled in the same workflow.",
  },
  {
    icon: Store,
    step: "Step 5",
    title: "List produce for sale",
    description:
      "When stock is ready, farmers publish marketplace listings without switching to a different system.",
  },
];

const highlights = [
  "Storage, transport, and marketplace actions stay connected.",
  "Notifications keep farmers, transporters, and managers in sync.",
  "Each account sees the tools and workflow that match its role.",
];

export default function HowItWorksPage() {
  return (
    <div className="bg-[#f7fafc]">
      <section className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#2f855a]">
              How it works
            </p>
            <h1 className="mt-4 text-4xl font-medium tracking-[-0.05em] text-[#1a202c] sm:text-5xl">
              ColdChain is designed around the real sequence of post-harvest work.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600">
              From booking cold rooms to arranging transport and publishing produce, the platform keeps each step practical and connected.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/find-storage"
                className="inline-flex items-center gap-2 rounded-xl bg-[#2f855a] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(47,133,90,0.24)] transition hover:-translate-y-0.5 hover:bg-[#276e4b]"
              >
                Find Storage
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/marketplace"
                className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-[#2f855a]/30 hover:text-[#2f855a]"
              >
                Browse Marketplace
              </Link>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200/80 bg-[#f7fafc] p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#2f855a]">
              What stays connected
            </p>
            <div className="mt-5 space-y-4">
              {highlights.map((item) => (
                <div key={item} className="rounded-2xl bg-white px-4 py-4 text-sm leading-6 text-slate-600 shadow-sm">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {steps.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="group rounded-[1.5rem] border border-slate-200/80 bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.06)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_52px_rgba(15,23,42,0.12)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e6f4ed] text-[#2f855a] transition duration-200 group-hover:bg-[#2f855a] group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      {item.step}
                    </span>
                  </div>

                  <h2 className="mt-6 text-xl font-semibold tracking-[-0.03em] text-slate-900">
                    {item.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
