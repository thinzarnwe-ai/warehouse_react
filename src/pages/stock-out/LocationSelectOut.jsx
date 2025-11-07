import React from "react";
import Select from "react-select";

export default function LocationSelectOut({
  form,
  setForm,
  selectedLocation,
  setSelectedLocation,
  locationOptions,
  errors,
}) {
  return (
    <div className="col-span-2 relative">
      <label className="block text-sm font-medium text-primary">
        From Location  <span className="text-red-600">*</span>
      </label>
      <Select
        options={locationOptions}
        value={selectedLocation}
        onChange={(selected) => {
          setSelectedLocation(selected);
          setForm((prev) => ({
            ...prev,
            location_name: selected?.value || "",
            qty: selected?.qty || "",
          }));
        }}
        placeholder="Select location"
        className="border border-primary"
        isClearable
      />
      {errors.location_name && (
        <p className="text-red-500 text-sm">{errors.location_name[0]}</p>
      )}
    </div>
  );
}
