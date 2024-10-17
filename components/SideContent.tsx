"use client";

import { useState } from "react";
import { Button } from "@components/ui/button"; // New import
import { ChevronLeft, ChevronRight } from "lucide-react"; // New import

export function SideContent() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  return (
    <>
      <div
        className={`shadow-sm shadow-gray-950 hidden md:block h-full bg-secondary rounded-tr-xl rounded-br-xl relative z-10 transition-all duration-300 ease-in-out ${
          isDrawerOpen ? "w-[45%]" : "w-0 overflow-hidden"
        }`}
      >
        <div className="p-6">
          <h1 className="text-6xl text-primary">MOS</h1>
          {/* Add more drawer content here */}
          <p className="mt-4 text-muted-foreground">
            Welcome to Master of Self
          </p>
          <ul className="mt-8 space-y-2">
            <li className="text-muted-foreground">Dashboard</li>
            <li className="text-muted-foreground">Profile</li>
            <li className="text-muted-foreground">Settings</li>
          </ul>
        </div>
      </div>
      <Button
        variant="secondary"
        size="icon"
        className="absolute top-4 left-4 z-50 md:flex hidden"
        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
      >
        {isDrawerOpen ? <ChevronLeft /> : <ChevronRight />}
      </Button>
    </>
  );
}
