import React from "react";

export default function SubmitButton({ isSubmitting }) {
  return (
    <div className="col-span-2 flex justify-end">
      <button
        type="submit"
        disabled={isSubmitting}
        className={`rounded-md bg-primary px-10 py-3 text-md font-semibold text-white shadow transition 
          ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-[#6ac9c9]"}`}
      >
        {isSubmitting ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
