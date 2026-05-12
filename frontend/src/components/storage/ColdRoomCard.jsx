import StatusBadge from "../common/StatusBadge";

export default function ColdRoomCard({ room }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{room.name}</h3>
          <p className="text-sm text-slate-500">{room.code}</p>
        </div>
        <StatusBadge status={room.active ? "ACTIVE" : "CANCELLED"} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600">
        <p>Total: {room.totalCapacity}</p>
        <p>Available: {room.availableCapacity}</p>
        <p>Pricing: {room.pricingType}</p>
        <p>Price: {room.pricePerUnit}</p>
      </div>
      <div className="mt-4 text-sm text-slate-600">
        <p className="font-medium text-slate-700">Supported produce types</p>
        <p className="mt-1">
          {room.supportedCategories?.length
            ? room.supportedCategories.map((category) => category.name).join(", ")
            : "No produce types assigned yet"}
        </p>
      </div>
    </div>
  );
}
