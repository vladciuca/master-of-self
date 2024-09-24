import { useState, useMemo, useEffect, useCallback } from "react";
import * as GiIcons from "react-icons/gi";
import { useDebounce } from "./useDebounce";

export function useIconPickerSearch(initialIcon?: string) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIconName, setSelectedIconName] = useState<string | null>(
    initialIcon || null
  );
  const [isSearching, setIsSearching] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const icons = useMemo(() => {
    return Object.entries(GiIcons).map(([name, icon]) => ({
      name,
      icon,
    }));
  }, []);

  const filteredIcons = useMemo(() => {
    if (!debouncedSearchTerm) return icons;
    return icons.filter((icon) =>
      icon.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [icons, debouncedSearchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm !== searchTerm) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  }, [debouncedSearchTerm, searchTerm]);

  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
    setIsSearching(true);
  }, []);

  return {
    searchTerm,
    setSearchTerm: handleSearchChange,
    selectedIconName,
    setSelectedIconName,
    filteredIcons,
    isSearching,
  };
}
