import { useEffect, useState } from "react";
import { getMyDocuments, uploadDocument } from "../../services/documentService";
import { getFacilities, getFacilityPhotos, uploadFacilityPhoto } from "../../services/facilityService";
import { getUser } from "../../utilis/auth";

const storageDocumentTypes = [
  "RDB_CERTIFICATE",
  "STORAGE_OWNERSHIP_PROOF",
  "FOOD_STORAGE_LICENSE",
  "RSB_CERTIFICATION",
  "NATIONAL_ID",
  "OTHER",
];

export default function StorageProfilePage() {
  const user = getUser();
  const [type, setType] = useState(storageDocumentTypes[0]);
  const [file, setFile] = useState(null);
  const [items, setItems] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [facilityPhotos, setFacilityPhotos] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadDocuments = async () => {
    try {
      const data = await getMyDocuments();
      setItems(data || []);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to load documents");
    }
  };

  useEffect(() => {
    loadDocuments();
    getFacilities()
      .then((data) => {
        const managerFacilities = (data || []).filter((facility) => facility.manager?.id === user?.id);
        setFacilities(managerFacilities);
        if (managerFacilities[0]) {
          setSelectedFacilityId(String(managerFacilities[0].id));
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedFacilityId) {
      setFacilityPhotos([]);
      return;
    }

    getFacilityPhotos(selectedFacilityId)
      .then((data) => setFacilityPhotos(data || []))
      .catch(console.error);
  }, [selectedFacilityId]);

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
      await loadDocuments();
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
          Your account status is <span className="font-semibold">{user?.status || "UNKNOWN"}</span>. Upload the required documents here, then wait for admin approval before your facilities are visible to farmers.
        </p>
      </div>

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

        {message && <div className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div>}
        {error && <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

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
            onChange={(e) => setSelectedFacilityId(e.target.value)}
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
