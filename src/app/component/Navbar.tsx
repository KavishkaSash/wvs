"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const currentPath = usePathname(); // Get the current pathname

  const tabs = [
    { label: "Create Header", path: "/createheader" },
    { label: "Weight Verify", path: "/weightverify" },
  ];

  return (
    <div className="bg-gray-900 text-white p-4 shadow-lg w-full">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* Logo or Branding */}
        <div className="text-lg font-semibold">
          <Link href="/">WVS</Link>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-6">
          {tabs.map((tab) => (
            <Link
              key={tab.path}
              href={tab.path}
              className={`py-2 px-4 rounded-md transition-all duration-300 ease-in-out ${
                currentPath === tab.path
                  ? "bg-blue-600 text-white shadow-lg transform scale-105"
                  : "bg-gray-700 text-gray-300 hover:bg-blue-500 hover:text-white hover:scale-105"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
