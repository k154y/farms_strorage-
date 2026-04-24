import { useState } from "react";

const initialForm = {
  buyerName: "",
  buyerPhone: "",
  buyerEmail: "",
  requestedQuantity: "",
  deliveryLocation: "",
  message: "",
};

export default function OrderRequestForm({ onSubmit }) {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(form);
      setForm(initialForm);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 rounded-3xl border border-slate-200 bg-white p-6">
      <h2 className="text-2xl font-bold text-slate-900">Request Order</h2>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <input name="buyerName" value={form.buyerName} onChange={handleChange} className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Your Name" required />
        <input name="buyerPhone" value={form.buyerPhone} onChange={handleChange} className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Phone Number" required />
      </div>

      <input name="buyerEmail" type="email" value={form.buyerEmail} onChange={handleChange} className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-3" placeholder="Email Address" />
      <input name="requestedQuantity" type="number" min="1" value={form.requestedQuantity} onChange={handleChange} className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-3" placeholder="Quantity" required />
      <input name="deliveryLocation" value={form.deliveryLocation} onChange={handleChange} className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-3" placeholder="Delivery Location" />
      <textarea name="message" value={form.message} onChange={handleChange} className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-3" rows="4" placeholder="Message" />

      <button disabled={submitting} className="mt-4 w-full rounded-xl bg-[#47A369] px-6 py-3 font-semibold text-white disabled:opacity-70">
        {submitting ? "Submitting..." : "Submit Order Request"}
      </button>
    </form>
  );
}
