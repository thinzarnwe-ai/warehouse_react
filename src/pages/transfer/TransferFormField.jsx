import React from "react";

export default function StockOutFormFields({ form, setForm, errors }) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

 const fields = [
  { label: "Product Code", name: "product_code", readOnly: true},
  { label: "Product Name", name: "product_name", readOnly: true},
];

return (
  <>
    {fields.map(({ label, name, readOnly, type = "text", colSpan }) => (
      <div
        key={name}
        
      >
        <label className="block text-sm font-medium text-primary">
          {label} <span className="text-red-600">*</span>
        </label>
        <input
          type={type}
          name={name}
          value={form[name] || ""}
          onChange={handleInputChange}
          readOnly={readOnly}
          onKeyDown={(e) => {
            if (name === "qty" && ["-", "+", "e"].includes(e.key))
              e.preventDefault();
          }}
          className={`mt-2 border-primary block w-full rounded-md px-3 py-1.5 text-base text-gray-900 ${
            readOnly ? "bg-gray-200" : ""
          }`}
        />
        {errors[name] && (
          <p className="text-red-500 text-sm">{errors[name][0]}</p>
        )}
      </div>
    ))}
    </>
  );
}
