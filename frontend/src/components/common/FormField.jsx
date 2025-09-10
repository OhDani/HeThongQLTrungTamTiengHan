import React from "react";

export const Input = ({ label, value, onChange, placeholder }) => (
  <div className="mb-3">
    {label && <label className="block mb-1 font-medium">{label}</label>}
    <input
      className="w-full border px-3 py-2 rounded"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  </div>
);

export const Textarea = ({ label, value, onChange, placeholder }) => (
  <div className="mb-3">
    {label && <label className="block mb-1 font-medium">{label}</label>}
    <textarea
      className="w-full border px-3 py-2 rounded"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  </div>
);

export const Select = ({ label, value, onChange, options }) => (
  <div className="mb-3">
    {label && <label className="block mb-1 font-medium">{label}</label>}
    <select className="w-full border px-3 py-2 rounded" value={value} onChange={onChange}>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);