import React from "react";
import { FiBell, FiUser } from "react-icons/fi";

export default function Topbar() {
  return (
    <div className="w-full bg-white h-16 shadow-sm px-6 flex items-center justify-between">
      <h1 className="text-xl font-semibold text-gray-700">Smart Clinic System</h1>

      <div className="flex items-center gap-6 text-gray-600 text-xl cursor-pointer">
        <FiBell />
        <FiUser />
      </div>
    </div>
  );
}
