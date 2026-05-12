import { useEffect, useState } from "react";
import { getMyDocuments, uploadDocument } from "../../services/documentService";
import { getFacilities, getFacilityPhotos, uploadFacilityPhoto } from "../../services/facilityService";
import {
  getStorageManagerProfile,
  updateStorageManagerProfile,
} from "../../services/storageManagerProfileService";
import { getUser } from "../../utilis/auth";

const storageDocumentTypes = [
  "RDB_CERTIFICATE",
  "STORAGE_OWNERSHIP_PROOF",
  "FOOD_STORAGE_LICENSE",
  "RSB_CERTIFICATION",
  "NATIONAL_ID",
  "OTHER",
];

const initialProfileForm = {
  fullName: "",
  phoneNumber: "",
  businessName: "",
  ownerName: "",
  district: "",
  sector: "",
  contactPhone: "",
  businessAddress: "",
  rdbRegistrationNumber: "",
  fdaLicenseId: "",
  rsbCertificationId: "",
};

export default function StorageProfilePage() {
  const user = getUser();
  const [profile, setProfile] = useState(null);
  const [profileForm, setProfileForm] = useState(initialProfileForm);
  const [type, setType] = useState(storageDocumentTypes[0]);
  const [file, setFile] = useState(null);
  const [items, setItems] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [facilityPhotos, setFacilityPhotos] = useState([]);
  const [savingProfile, setSavingProfile] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const syncProfileForm = (data) => {
    setProfile(data);
    setProfileForm({
      fullName: data?.fullName || "",
      phoneNumber: data?.phoneNumber || "",
      businessName: data?.businessName || "",
      ownerName: data?.ownerName || "",
      district: data?.district || "",
      sector: data?.sector || "",
      contactPhone: data?.contactPhone || "",
      businessAddress: data?.businessAddress || "",
      rdbRegistrationNumber: data?.rdbRegistrationNumber || "",
      fdaLicenseId: data?.fdaLicenseId || "",
      rsbCertificationId: data?.rsbCertificationId || "",
    });
  };

  useEffect(() => {
    getStorageManagerProfile()
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
    getFacilities()
      .then((data) => {
        const managerFacilities = (data || []).filter((facility) => facility.manager?.id === user?.id);
        setFacilities(managerFacilities);
        if (managerFacilities[0]) {
          setSelectedFacilityId(String(managerFacilities[0].id));
        }
      })
      .catch(console.error);
  }, [user?.id]);

  useEffect(() => {
    if (!selectedFacilityId) {
      return;
    }

    getFacilityPhotos(selectedFacilityId)
      .then((data) => setFacilityPhotos(data || []))
      .catch(console.error);
  }, [selectedFacilityId]);

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
      const data = await updateStorageManagerProfile(profileForm);
      syncProfileForm(data);
      setMessage(
        data?.profileComplete
          ? "Profile completed successfully. You can now create facilities."
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

  const handlePhotoSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFacilityId || !photoFile) {
      setError("Choose a facility and a photo file first.");
      return;
    }

    setUploadingPhoto(true);
    setError("");
    setMessage("");

    try {
      await uploadFacilityPhoto({ facilityId: selectedFacilityId, file: photoFile });
      setMessage("Facility photo uploaded successfully.");
      setPhotoFile(null);
      event.target.reset();
      const data = await getFacilityPhotos(selectedFacilityId);
      setFacilityPhotos(data || []);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Facility photo upload failed");
    } finally {
      setUploadingPhoto(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Storage Manager Profile</h2>
        <p className="mt-2 text-slate-500">
          Your account status is <span className="font-semibold">{user?.status || "UNKNOWN"}</span>. Complete your business profile, upload the required documents, and wait for admin approval before your facilities are visible to farmers.
        </p>
      </div>

      {!profile?.profileComplete ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-900">
          Complete your profile first. You will not be able to create storage facilities until the required business details are filled in here.
        </div>
      ) : null}

      {message && <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div>}
      {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <form onSubmit={handleProfileSubmit} className="rounded-2xl bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Complete Business Profile</h3>
        <p className="mt-2 text-slate-500">
          Fill in the business and contact details needed before creating facilities.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <input name="fullName" value={profileForm.fullName} onChange={handleProfileChange} className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Full name" required />
          <input name="phoneNumber" value={profileForm.phoneNumber} onChange={handleProfileChange} className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Phone number" required />
          <input name="businessName" value={profileForm.businessName} onChange={handleProfileChange} className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Business name" required />
          <input name="ownerName" value={profileForm.ownerName} onChange={handleProfileChange} className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Owner name" required />
          <input name="district" value={profileForm.district} onChange={handleProfileChange} className="rounded-xl border border-slate-300 px-4 py-3" placeholder="District" required />
          <input name="sector" value={profileForm.sector} onChange={handleProfileChange} className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Sector" required />
          <input name="contactPhone" value={profileForm.contactPhone} onChange={handleProfileChange} className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Contact phone" required />
          <input name="rdbRegistrationNumber" value={profileForm.rdbRegistrationNumber} onChange={handleProfileChange} className="rounded-xl border border-slate-300 px-4 py-3" placeholder="RDB registration number" />
          <input name="fdaLicenseId" value={profileForm.fdaLicenseId} onChange={handleProfileChange} className="rounded-xl border border-slate-300 px-4 py-3" placeholder="FDA license ID" />
          <input name="rsbCertificationId" value={profileForm.rsbCertificationId} onChange={handleProfileChange} className="rounded-xl border border-slate-300 px-4 py-3" placeholder="RSB certification ID" />
          <textarea name="businessAddress" value={profileForm.businessAddress} onChange={handleProfileChange} className="min-h-28 rounded-xl border border-slate-300 px-4 py-3 md:col-span-2" placeholder="Business address" />
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
            {storageDocumentTypes.map((item) => (
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

      <form onSubmit={handlePhotoSubmit} className="rounded-2xl bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Facility Photos</h3>
        <p className="mt-2 text-slate-500">
          Upload facility photos here. Farmers will see these photos when they browse storage facilities.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <select
            value={selectedFacilityId}
            onChange={(e) => {
              setSelectedFacilityId(e.target.value);
              setFacilityPhotos([]);
            }}
            className="rounded-xl border border-slate-300 px-4 py-3"
            required
          >
            <option value="">Select Facility</option>
            {facilities.map((facility) => (
              <option key={facility.id} value={facility.id}>
                {facility.name}
              </option>
            ))}
          </select>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
            className="rounded-xl border border-slate-300 px-4 py-3"
            required
          />
        </div>
        <button
          type="submit"
          disabled={uploadingPhoto}
          className="mt-6 rounded-xl bg-[#304F3A] px-5 py-3 font-semibold text-white disabled:opacity-60"
        >
          {uploadingPhoto ? "Uploading Photo..." : "Upload Facility Photo"}
        </button>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {facilityPhotos.map((photo) => (
            <img key={photo.id} src={photo.filePath} alt={photo.fileName} className="h-48 w-full rounded-2xl object-cover" />
          ))}
        </div>
      </form>
    </div>
  );
}
