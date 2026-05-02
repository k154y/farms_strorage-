import { useEffect, useState } from "react";
import { getMyDocuments, uploadDocument } from "../../services/documentService";
import {
  getTransporterProfile,
  updateTransporterProfile,
} from "../../services/transporterProfileService";
import { getUser } from "../../utilis/auth";

const transporterDocumentTypes = [
  "DRIVING_LICENSE",
  "VEHICLE_REGISTRATION",
  "TRANSPORT_LICENSE",
  "VEHICLE_INSPECTION_CERTIFICATE",
  "NATIONAL_ID",
  "OTHER",
];

const initialProfileForm = {
  fullName: "",
  phoneNumber: "",
  businessName: "",
  drivingLicenseNumber: "",
  district: "",
  sector: "",
  contactPhone: "",
  ruraCertificateId: "",
  commercialInsurance: "",
  ownershipDetails: "",
};

export default function TransportProfilePage() {
  const user = getUser();
  const [profile, setProfile] = useState(null);
  const [profileForm, setProfileForm] = useState(initialProfileForm);
  const [type, setType] = useState(transporterDocumentTypes[0]);
  const [file, setFile] = useState(null);
  const [items, setItems] = useState([]);
  const [savingProfile, setSavingProfile] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const syncProfileForm = (data) => {
    setProfile(data);
    setProfileForm({
      fullName: data?.fullName || "",
      phoneNumber: data?.phoneNumber || "",
      businessName: data?.businessName || "",
      drivingLicenseNumber: data?.drivingLicenseNumber || "",
      district: data?.district || "",
      sector: data?.sector || "",
      contactPhone: data?.contactPhone || "",
      ruraCertificateId: data?.ruraCertificateId || "",
      commercialInsurance: data?.commercialInsurance || "",
      ownershipDetails: data?.ownershipDetails || "",
    });
  };

  useEffect(() => {
    getTransporterProfile()
      .then((data) => {
        syncProfileForm(data);
      })
      .catch((err) => {
        setError(err?.response?.data?.message || err?.message || "Failed to load profile");
      });
    getMyDocuments()
      .then((data) => {
        setItems(data || []);
      })
      .catch((err) => {
        setError(err?.response?.data?.message || err?.message || "Failed to load documents");
      });
  }, []);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfileForm((current) => ({ ...current, [name]: value }));
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setSavingProfile(true);
    setError("");
    setMessage("");

    try {
      const data = await updateTransporterProfile(profileForm);
      syncProfileForm(data);
      setMessage(
        data?.profileComplete
          ? "Profile completed successfully. You can now add vehicles."
          : "Profile saved. Add the remaining required fields to complete it."
      );
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to save profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError("Please choose a file first.");
      return;
    }

    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      await uploadDocument({ file, type });
      setMessage("Document uploaded. Admin can now review your account.");
      setFile(null);
      event.target.reset();
      const data = await getMyDocuments();
      setItems(data || []);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Upload failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Transporter Profile</h2>
        <p className="mt-2 text-slate-500">
          Your account status is <span className="font-semibold">{user?.status || "UNKNOWN"}</span>. Complete your transporter profile, upload documents, and wait for admin approval before farmers can work with your account.
        </p>
      </div>

      {!profile?.profileComplete ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-900">
          Complete your profile first. You will not be able to add vehicles until the required transporter details are filled in here.
        </div>
      ) : null}

      {message && <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div>}
      {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <form onSubmit={handleProfileSubmit} className="rounded-2xl bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Complete Transporter Profile</h3>
        <p className="mt-2 text-slate-500">
          Fill in your transport business details before adding vehicles.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <input name="fullName" value={profileForm.fullName} onChange={handleProfileChange} className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Full name" required />
          <input name="phoneNumber" value={profileForm.phoneNumber} onChange={handleProfileChange} className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Phone number" required />
          <input name="businessName" value={profileForm.businessName} onChange={handleProfileChange} className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Business name" required />
          <input name="drivingLicenseNumber" value={profileForm.drivingLicenseNumber} onChange={handleProfileChange} className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Driving license number" required />
          <input name="district" value={profileForm.district} onChange={handleProfileChange} className="rounded-xl border border-slate-300 px-4 py-3" placeholder="District" required />
          <input name="sector" value={profileForm.sector} onChange={handleProfileChange} className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Sector" required />
          <input name="contactPhone" value={profileForm.contactPhone} onChange={handleProfileChange} className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Contact phone" required />
          <input name="ruraCertificateId" value={profileForm.ruraCertificateId} onChange={handleProfileChange} className="rounded-xl border border-slate-300 px-4 py-3" placeholder="RURA certificate ID" />
          <input name="commercialInsurance" value={profileForm.commercialInsurance} onChange={handleProfileChange} className="rounded-xl border border-slate-300 px-4 py-3 md:col-span-2" placeholder="Commercial insurance details" />
          <textarea name="ownershipDetails" value={profileForm.ownershipDetails} onChange={handleProfileChange} className="min-h-28 rounded-xl border border-slate-300 px-4 py-3 md:col-span-2" placeholder="Ownership details" />
        </div>

        <button
          type="submit"
          disabled={savingProfile}
          className="mt-6 rounded-xl bg-[#304F3A] px-5 py-3 font-semibold text-white disabled:opacity-60"
        >
          {savingProfile ? "Saving Profile..." : "Save Profile"}
        </button>
      </form>

      <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Upload Verification Document</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
          >
            {transporterDocumentTypes.map((item) => (
              <option key={item} value={item}>
                {item.replaceAll("_", " ")}
              </option>
            ))}
          </select>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="rounded-xl border border-slate-300 px-4 py-3"
            required
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 rounded-xl bg-[#47A369] px-5 py-3 font-semibold text-white disabled:opacity-60"
        >
          {submitting ? "Uploading..." : "Upload Document"}
        </button>
      </form>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Submitted Documents</h3>
        <div className="mt-4 space-y-3">
          {items.length === 0 ? (
            <p className="text-slate-500">No documents uploaded yet.</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-200 px-4 py-3">
                <p className="font-medium text-slate-900">{item.documentType}</p>
                <p className="mt-1 text-sm text-slate-500">Status: {item.status}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
