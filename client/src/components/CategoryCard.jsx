// src/components/CategoryCard.jsx
import React from "react";

export default function CategoryCard({ color, title }) {
  return (
    <div className={`bg-white ${color} text-white p-4 rounded-2xl shadow-md`}>
      <h3 className="font-bold">{title}</h3>
    </div>
  );
}
