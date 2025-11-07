import React from "react";

export default function TransferLocation({ form, setForm, errors ,startScan }) {
  return (
    <>
     <div className="w-full md:col-span-2">
        <label
          htmlFor="transfer_location"
          className="block text-sm font-medium text-primary"
        >
          To Location <span className=" text-red-600">*</span>
        </label>
        <div className="flex gap-5">
          <input
            type="text"
            name="transfer_location"
            value={form.transfer_location ?? ""}
            onChange={(e) =>
            setForm((prev) => ({ ...prev, transfer_location: e.target.value }))
          }
            className="mt-2 border-primary block w-full rounded-md px-3 py-1.5 text-base text-gray-900 bg-gray-100" readOnly
          />

          <button
            className="border-2 px-2 rounded border-primary"
            type="button"
            onClick={() => startScan("transfer_location")}
          >
          📷
          </button>
        </div>
        {errors.transfer_location && (
          <p className="text-red-500">{errors.transfer_location[0]}</p>
        )}
      </div>
  

    </>


  );
}
