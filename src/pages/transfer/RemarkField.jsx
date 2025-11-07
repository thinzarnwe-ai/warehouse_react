import React from "react";

export default function RemarkField({ form, setForm, errors }) {
  return (
    <>
   
      <div className="w-full md:col-span-2">
        <label className="block text-sm font-medium text-primary">
          Remark <span className="text-red-600">*</span>
        </label>
        <textarea
          name="remark"
          rows="4"
          value={form.remark}
          onChange={(e) => setForm((prev) => ({ ...prev, remark: e.target.value }))}
          className="mt-2 border-primary w-full rounded-md px-3 py-1.5 text-base text-gray-900"
        />
        {errors.remark && <p className="text-red-500 text-sm">{errors.remark[0]}</p>}
      </div>

    </>


  );
}
