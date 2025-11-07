import React from "react";

export default function LocationScanner({ form, setForm, startScan }) {
  
  return (
    <div className="col-span-2 relative">
      <label
        htmlFor="location_name"
        className="block text-sm font-medium text-primary"
      >
        Location <span className="text-red-600">*</span>
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          name="location_name"
          value={form.location_name}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, location_name: e.target.value }))
          }
          className=" border-primary block w-full rounded-md px-3 py-2 text-base text-gray-900 bg-gray-200"
          readOnly
        />
        <button
          type="button"
          className="border px-2 rounded border-primary"
          onClick={() => startScan("location")}
          title="Scan Location"
        >
          📷
        </button>
      </div>
    </div>
  );
}
