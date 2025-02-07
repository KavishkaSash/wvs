import React, { useState, useEffect, useMemo, useRef } from "react";
import { salesOrderService } from "@/app/_services/salesOrderService";
import { Search, X } from "lucide-react";

interface Option {
  id: number;
  name: string;
}

interface PreShipmentDropDownProps {
  onSelect: (selectedId: number | 0) => void; // Prop to pass selected ID to the parent
}

const PreShipmentDropDown: React.FC<PreShipmentDropDownProps> = ({
  onSelect,
}) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedID, setSelectedID] = useState<number | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchOptions();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        onSelect(selectedOption?.id || 0); // Notify parent on close
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedOption, onSelect]);

  const fetchOptions = async () => {
    try {
      const response = await salesOrderService.getSaleOrders();
      const data = response.data.map((order) => ({
        id: order.id,
        name: order.name,
      }));

      setOptions(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching options:", error);
      setIsLoading(false);
    }
  };

  const filteredOptions = useMemo(() => {
    return options.filter((option) =>
      option.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  const handleSelect = (option: Option) => {
    setSelectedOption(option);
    setSelectedID(option.id);
    setSearchTerm(""); // Reset search term after selection
    setIsDropdownOpen(false); // Close dropdown after selection
    onSelect(option.id); // Notify parent of the selected ID
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSelectedOption(null);
    setSelectedID(null);
    setIsDropdownOpen(false); // Close dropdown when cleared
    onSelect(0); // Notify parent of no selection
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto relative" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          placeholder="Search and select a sale order..."
          value={searchTerm || selectedOption?.name || ""}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsDropdownOpen(true); // Open dropdown when typing
          }}
          onFocus={() => setIsDropdownOpen(true)} // Open dropdown on focus
          className="w-full p-2 pl-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {searchTerm || selectedOption ? (
          <X
            className="absolute right-3 top-3 text-gray-400 cursor-pointer hover:text-gray-600"
            size={20}
            onClick={clearSearch}
          />
        ) : (
          <Search className="absolute left-2 top-3 text-gray-400" size={20} />
        )}
      </div>
      {isDropdownOpen && (
        <ul className="absolute w-full bg-white border border-gray-300 rounded-md mt-1 max-h-48 overflow-y-auto z-10">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <li
                key={option.id}
                className="p-2 hover:bg-blue-100 cursor-pointer"
                onClick={() => handleSelect(option)}
              >
                {option.name}
              </li>
            ))
          ) : (
            <li className="p-2 text-gray-500 text-center">
              No sale orders found
            </li>
          )}
        </ul>
      )}
      {selectedOption && (
        <p className="text-gray-500 text-sm mt-2">
          Selected: <span className="font-semibold">{selectedOption.name}</span>
        </p>
      )}
    </div>
  );
};

export default PreShipmentDropDown;
