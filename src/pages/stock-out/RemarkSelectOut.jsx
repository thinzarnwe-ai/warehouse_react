import React, { useState } from "react";
import Select from "react-select";

export default function RemarkSelectOut({ form, setForm, errors }) {
  const SUGGESTIONS = [
    { value: "Promotion", label: "Promotion" },
    { value: "Display Area", label: "Display Area" },
    { value: "Other", label: "Other" },
  ];
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelectChange = (option) => {
    setSelectedOption(option);
    if (!option || option.value === "Other") {
      setForm({ ...form, remark: "" });
    } else {
      setForm({ ...form, remark: option.value });
    }
  };

  return (
    <div className="col-span-2">
      <label className="block text-sm font-medium text-primary">
        Remark  <span className="text-red-600">*</span>
      </label>
      <Select
        options={SUGGESTIONS}
        value={selectedOption}
        onChange={handleSelectChange}
        placeholder="Select remark"
        className="text-sm w-full border border-primary"
        classNamePrefix="react-select"
        isClearable
      />
      {selectedOption?.value === "Other" && (
        <input
          type="text"
          name="remark"
          value={form.remark}
          onChange={(e) => setForm({ ...form, remark: e.target.value })}
          placeholder="Enter custom remark"
          className="mt-2 border-primary block w-full rounded-md px-3 py-1.5 text-base text-gray-900"
        />
      )}
      {errors.remark && <p className="text-red-500 text-sm">{errors.remark[0]}</p>}
    </div>
  );
}
