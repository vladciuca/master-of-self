// import { useState, useMemo } from "react";
// import * as GiIcons from "react-icons/gi";

// type IconType = (props: React.SVGProps<SVGSVGElement>) => JSX.Element;

// export function useIconSearch() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedIcon, setSelectedIcon] = useState<IconType | null>(null);
//   const icons = useMemo(() => {
//     return Object.entries(GiIcons).map(([name, icon]) => ({
//       name,
//       icon: icon as IconType,
//     }));
//   }, []);

//   const filteredIcons = useMemo(() => {
//     if (!searchTerm) return icons;
//     return icons.filter((icon) =>
//       icon.name.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [icons, searchTerm]);

//   return {
//     searchTerm,
//     setSearchTerm,
//     selectedIcon,
//     setSelectedIcon,
//     filteredIcons,
//   };
// }

import { useState, useMemo } from "react";
import * as GiIcons from "react-icons/gi";

export function useIconSearch(initialIcon?: string) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIconName, setSelectedIconName] = useState<string | null>(
    initialIcon || null
  );

  const icons = useMemo(() => {
    return Object.entries(GiIcons).map(([name, icon]) => ({
      name,
      icon,
    }));
  }, []);

  const filteredIcons = useMemo(() => {
    if (!searchTerm) return icons;
    return icons.filter((icon) =>
      icon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [icons, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    selectedIconName,
    setSelectedIconName,
    filteredIcons,
  };
}
