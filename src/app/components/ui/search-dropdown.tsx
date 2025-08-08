"use client";

import { useEffect, useRef, useState } from "react";
import Input from "./input";
import { CheckIcon } from "@phosphor-icons/react";

type SearchDropdownProps = {
  options: string[];
  label: string;
  onSelect?: (value: string) => void;
  placeholder?: string;
};

export default function SearchDropdown({
  options,
  label,
  onSelect,
  placeholder = "Search...",
}: SearchDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedValue, setSelectedValue] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter options based on search query
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(query.toLowerCase()),
  );

  // Handle option selection
  const handleSelect = (option: string) => {
    setSelectedValue(option);
    setQuery(""); // Clear search after selection
    setIsOpen(false);
    onSelect?.(option); // Call parent callback if provided
  };

  // Get display value for input
  const getDisplayValue = () => {
    if (query) return query; // Show search query when typing
    if (selectedValue) return selectedValue; // Show selected value
    return ""; // Empty when nothing selected
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        // Reset query to selected value when clicking outside
        setQuery("");
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative w-full">
      <Input
        label={label}
        ref={inputRef}
        type="text"
        value={getDisplayValue()}
        onChange={(e) => {
          const newValue = e.target.value;
          setQuery(newValue);
          setIsOpen(true); // Open dropdown when typing

          // Clear selected value when user starts typing something different
          if (newValue !== selectedValue) {
            setSelectedValue("");
            onSelect?.(""); // Notify parent that selection was cleared
          }
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
      />

      {isOpen && (
        <div className="shadow-l dark:bg-background absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white text-sm dark:border-gray-600">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <div
                key={index}
                onClick={() => handleSelect(option)}
                className={`flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-gray-100 ${
                  option === selectedValue ? "text-green bg-green/10" : ""
                }`}
              >
                {option}
                {option === selectedValue && (
                  <CheckIcon size={12} className="text-green inline" />
                )}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-500">No options found</div>
          )}
        </div>
      )}
    </div>
  );
}
