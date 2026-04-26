import { useEffect, useState } from "react";
import TransportTable from "../../components/tables/TransportTable";
import {
  acceptTransportRequest,
  getAvailableTransportRequests,
  getMyAssignedTransportRequests,
  getMyVehicles,
} from "../../services/transportService";

export default function TransportRequestsPage() {
  const [availableItems, setAvailableItems] = useState([]);
  const [assignedItems, setAssignedItems] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicles, setSelectedVehicles] = useState({});
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [acceptingId, setAcceptingId] = useState(null);

  const loadData = () => {
    setError("");

    return Promise.all([
      getAvailableTransportRequests(),
      getMyAssignedTransportRequests(),
      getMyVehicles(),
    ])
      .then(([availableRequests, assignedRequests, myVehicles]) => {
        setAvailableItems(availableRequests || []);
        setAssignedItems(assignedRequests || []);
        setVehicles(myVehicles || []);
        setSelectedVehicles((current) => {
          const next = { ...current };

          (availableRequests || []).forEach((request) => {
            const eligibleVehicle = (myVehicles || []).find(
              (vehicle) => vehicle.active && Number(vehicle.capacity) >= Number(request.quantityToTransport)
            );

            if (eligibleVehicle && !next[request.id]) {
              next[request.id] = String(eligibleVehicle.id);
            }
          });

          return next;
        });
      })
      .catch((err) => {
        setError(err?.response?.data?.message || err?.message || "Failed to load transport requests");
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const getEligibleVehicles = (request) =>
    vehicles.filter(
      (vehicle) => vehicle.active && Number(vehicle.capacity) >= Number(request.quantityToTransport)
    );

  const handleAccept = async (requestId) => {
    const vehicleId = selectedVehicles[requestId];

    if (!vehicleId) {
      setError("Please choose a vehicle that meets the request quantity.");
      return;
    }

    setAcceptingId(requestId);
    setError("");
    setMessage("");

    try {
      await acceptTransportRequest({ requestId, vehicleId: Number(vehicleId) });
      setMessage(`Transport request #${requestId} accepted successfully.`);
      await loadData();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Another transporter may have accepted this request already."
      );
      await loadData();
    } finally {
      setAcceptingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {message && <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div>}

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Available Requests</h2>
        <p className="mt-1 text-sm text-slate-500">
          Only requests your active vehicles can handle are shown here. Once you accept one, it disappears from other transporter accounts.
        </p>

        {availableItems.length === 0 ? (
          <div className="mt-4 text-slate-500">No open transport requests match your vehicle capacity right now.</div>
        ) : (
          <div className="mt-6 space-y-4">
            {availableItems.map((item) => {
              const eligibleVehicles = getEligibleVehicles(item);

              return (
                <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
                    <div className="space-y-1">
                      <p className="text-lg font-semibold text-slate-900">Request #{item.id}</p>
                      <p className="text-sm text-slate-600">Pickup: {item.pickupLocation}</p>
                      <p className="text-sm text-slate-600">Destination: {item.destinationLocation}</p>
                      <p className="text-sm text-slate-600">Quantity: {item.quantityToTransport}</p>
                      <p className="text-sm text-slate-600">
                        Preferred pickup date: {item.preferredPickupDate || "Not specified"}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 lg:min-w-72">
                      <select
                        value={selectedVehicles[item.id] || ""}
                        onChange={(event) =>
                          setSelectedVehicles((current) => ({
                            ...current,
                            [item.id]: event.target.value,
                          }))
                        }
                        className="rounded-xl border border-slate-300 px-4 py-3"
                      >
                        <option value="">Select vehicle</option>
                        {eligibleVehicles.map((vehicle) => (
                          <option key={vehicle.id} value={vehicle.id}>
                            {vehicle.plateNumber} - {vehicle.vehicleType} - {vehicle.capacity} capacity
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        disabled={acceptingId === item.id || eligibleVehicles.length === 0}
                        onClick={() => handleAccept(item.id)}
                        className="rounded-xl bg-[#47A369] px-4 py-3 font-semibold text-white disabled:opacity-60"
                      >
                        {acceptingId === item.id ? "Accepting..." : "Accept Request"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">My Assigned Requests</h2>
        {assignedItems.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 shadow-sm text-slate-500">
            No transport requests have been assigned to this transporter yet.
          </div>
        ) : (
          <TransportTable items={assignedItems} />
        )}
      </section>
    </div>
  );
}
