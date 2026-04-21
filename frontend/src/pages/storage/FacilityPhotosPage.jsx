import FacilityPhotoUploader from "../../components/storage/FacilityPhotoUploader";

export default function FacilityPhotosPage() {
  return (
    <FacilityPhotoUploader
      onUpload={(payload) => {
        console.log("Upload facility photo", payload);
      }}
    />
  );
}