import React from "react";

export default function TransferQuantityFields({ form, setForm, errors }) {
  return (
    <>
      <div className="w-full">
        <label className="block text-sm font-medium text-primary">
          Total Quantity <span className="text-red-600">*</span>
        </label>
        <input
          type="number"
          name="qty"
          value={form.qty || ""}
          readOnly
          className="mt-2 border-primary w-full rounded-md px-3 py-1.5 text-base text-gray-900 bg-gray-100"
        />
      </div>

      <div className="w-full">
        <label className="block text-sm font-medium text-primary">
          Transfer Quantity <span className="text-red-600">*</span>
        </label>
        <input
          type="number"
          name="transfer_qty"
          min="0"
          value={form.transfer_qty || ""}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, transfer_qty: e.target.value }))
          }
          onKeyDown={(e) => {
            if (["-", "+", "e"].includes(e.key)) e.preventDefault();
          }}
          className="mt-2 border-primary w-full rounded-md px-3 py-1.5 text-base text-gray-900"
        />
        {errors.transfer_qty && (
          <p className="text-red-500 text-sm">{errors.transfer_qty[0]}</p>
        )}
      </div>
    </>
  );
}
