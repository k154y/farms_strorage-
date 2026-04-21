import { useState } from "react";
import Button from "../common/Button";

export default function FacilityPhotoUploader({ onUpload }) {
  const [fileName, setFileName] = useState("");
  const [filePath, setFilePath] = useState("");

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h3 className="text-lg font-semibold text-slate-900">Add Facility Photo</h3>
      <input
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
        className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-3"
        placeholder="File Name"
      />
      <input
        value={filePath}
        onChange={(e) => setFilePath(e.target.value)}
        className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-3"
        placeholder="Cloudinary File URL"
      />
      <Button className="mt-4" onClick={() => onUpload({ fileName, filePath })}>
        Upload
      </Button>
    </div>
  );
}