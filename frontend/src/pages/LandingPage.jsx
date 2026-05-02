import { Link } from "react-router-dom";
import {
  ArrowRight,
  CircleGauge,
  ClipboardCheck,
  Snowflake,
  Store,
  Truck,
} from "lucide-react";

const workflowSteps = [
  {
    icon: ClipboardCheck,
    title: "Create your working account",
    description: "Farmers, storage managers, and transporters each get a focused setup that matches how they operate.",
  },
  {
    icon: Snowflake,
    title: "Secure cold storage",
    description: "Review facility details, compare room capacity, and choose space before produce quality slips.",
  },
  {
    icon: Truck,
    title: "Coordinate delivery",
    description: "Request transport when stock needs to move between farms, storage sites, and buyers.",
  },
  {
    icon: Store,
    title: "Sell from the same flow",
    description: "List produce in the marketplace once inventory is ready, without starting over in another system.",
  },
];

const productHighlights = [
  {
    title: "Storage decisions with real context",
    body: "See facility location, available rooms, and booking access in one flow instead of calling around for answers.",
  },
  {
    title: "One place for post-harvest operations",
    body: "ColdChain connects storage, transport, and produce sales so teams can keep moving without fragmented tools.",
  },
  {
    title: "Built for everyday coordination",
    body: "Managers update facilities, transporters handle vehicles, and farmers track bookings from role-based accounts.",
  },
];

const heroMetrics = [
  { label: "Cold storage search", value: "Live facility access" },
  { label: "Transport coordination", value: "From request to delivery" },
  { label: "Marketplace listing", value: "Ready when produce is ready" },
];

export default function LandingPage() {
  return (
    <div className="bg-white text-[#1a202c]">
      <section className="relative overflow-hidden bg-[#f7fafc]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(98deg, rgba(17,24,39,0.88) 0%, rgba(17,24,39,0.74) 38%, rgba(17,24,39,0.54) 66%, rgba(17,24,39,0.68) 100%), url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1800&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_30%)]" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-18 lg:grid-cols-[minmax(0,1.05fr)_390px] lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/84 shadow-[0_10px_30px_rgba(0,0,0,0.16)] backdrop-blur-sm">
              Cold storage, logistics, and produce sales in one operating layer
            </div>

            <h1 className="mt-8 max-w-xl text-4xl font-medium tracking-[-0.05em] text-white sm:text-5xl lg:text-[4.5rem] lg:leading-[1.02]">
              Store smarter.
              <br />
              Sell faster.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-white/78 sm:text-lg">
              ColdChain helps farmers move from harvest to storage to sale with fewer delays, clearer choices, and less back-and-forth.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to="/marketplace"
                className="inline-flex items-center gap-2 rounded-xl bg-[#2f855a] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(47,133,90,0.35)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#276e4b]"
              >
                Browse Products
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/find-storage"
                className="inline-flex items-center rounded-xl border border-white/28 bg-white/7 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:bg-white/12"
              >
                Find Storage
              </Link>
            </div>

            <div className="mt-12 grid gap-3 sm:grid-cols-3">
              {heroMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-2xl border border-white/12 bg-white/10 px-4 py-4 shadow-[0_12px_32px_rgba(0,0,0,0.12)] backdrop-blur-sm"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/58">
                    {metric.label}
                  </p>
                  <p className="mt-2 text-sm font-medium text-white/88">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:justify-self-end">
            <div className="rounded-[1.75rem] border border-white/14 bg-white/92 p-6 shadow-[0_32px_90px_rgba(15,23,42,0.24)] backdrop-blur">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#2f855a]">
                    Operations snapshot
                  </p>
                  <h2 className="mt-3 text-2xl font-medium tracking-[-0.04em] text-slate-900">
                    Keep post-harvest work moving.
                  </h2>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e6f4ed] text-[#2f855a]">
                  <CircleGauge className="h-6 w-6" />
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {productHighlights.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-slate-200/80 bg-[#f7fafc] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
                  >
                    <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200/80 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="max-w-md">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#2f855a]">
              Why it works
            </p>
            <h2 className="mt-3 text-3xl font-medium tracking-[-0.04em] text-[#1a202c]">
              Built around the work that happens after harvest.
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              "Facility browsing stays practical, with location and availability where people actually need them.",
              "Role-based accounts keep each user focused on the actions they own.",
              "Storage, transport, and marketplace tasks connect instead of living in separate tools.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl bg-[#f7fafc] px-5 py-4 text-sm leading-6 text-slate-600 shadow-[0_10px_24px_rgba(15,23,42,0.05)]"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-[#f7fafc] py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#2f855a]">
              How it works
            </p>
            <h2 className="mt-4 text-3xl font-medium tracking-[-0.04em] text-[#1a202c] sm:text-4xl">
              A clearer path from storage planning to produce sales.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              ColdChain is structured to support the actual sequence people follow, without making the interface feel heavy.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-4">
            {workflowSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.title}
                  className="group rounded-[1.5rem] border border-slate-200/80 bg-white p-6 shadow-[0_14px_34px_rgba(15,23,42,0.06)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(15,23,42,0.12)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e6f4ed] text-[#2f855a] shadow-sm transition duration-200 group-hover:bg-[#2f855a] group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Step {index + 1}
                    </span>
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
