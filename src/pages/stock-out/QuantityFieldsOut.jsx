import React from "react";

export default function QuantityFieldsOut({ form, setForm, errors }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  return (
    <>
      <div className="col-span-2 relative">
        <label className="block text-sm font-medium text-primary">
          Total Quantity  <span className="text-red-600">*</span>
        </label>
        <input
          type="number"
          name="qty"
          value={form.qty}
          onChange={handleChange}
          readOnly
          className="mt-2 border-primary block w-full rounded-md px-3 py-1.5 text-base text-gray-900 bg-gray-100"
        />
        {errors.qty && <p className="text-red-500 text-sm">{errors.qty[0]}</p>}
      </div>

      <div className="col-span-2 relative">
        <label className="block text-sm font-medium text-primary">
          Out Quantity  <span className="text-red-600">*</span>
        </label>
        <input
          type="number"
          name="reduce_qty"
          min="0"
          value={form.reduce_qty}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (["-", "+", "e"].includes(e.key)) e.preventDefault();
          }}
          className="mt-2 border-primary block w-full rounded-md px-3 py-1.5 text-base text-gray-900"
        />
        {errors.reduce_qty && (
          <p className="text-red-500 text-sm">{errors.reduce_qty[0]}</p>
        )}
      </div>
    </>
  );
}
