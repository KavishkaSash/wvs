"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const currentPath = usePathname(); // Get the current pathname

  const tabs = [
    { label: "Create Header", path: "/createheader" },
    { label: "Weight Verify", path: "/weightverify" },
    { label: "Reports", path: "/#" },
  ];

  return (
    <div className="bg-gray-200 text-gray-800 p-4 shadow-md w-full">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* Logo or Branding */}
        <div className="text-lg font-bold text-blue-600">
          <Link href="/">WVS</Link>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center">
          <div className="bg-gray-100 rounded-full shadow-sm overflow-hidden flex">
            {tabs.map((tab, index) => (
              <Link
                key={tab.path}
                href={tab.path}
                className={`py-2 px-4 text-sm font-medium transition-all duration-300 ease-in-out ${
                  currentPath === tab.path
                    ? "bg-blue-500 text-white shadow-md"
                    : "text-gray-600 hover:bg-blue-100 hover:text-blue-600"
                } ${index === 0 ? "rounded-l-full" : ""} ${
                  index === tabs.length - 1 ? "rounded-r-full" : ""
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
