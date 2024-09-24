"use client";

import { useTheme } from "next-themes";
import { Card } from "@components/ui/card";
import { Switch } from "@components/ui/switch";
import { LightbulbOff, Lightbulb } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Card className="flex items-center justify-between w-full p-6">
      <div className="flex items-center space-x-4">
        {theme === "dark" ? (
          <LightbulbOff className="h-8 w-8" />
        ) : (
          <Lightbulb className="h-8 w-8" />
        )}
        <span className="text-sm font-medium pl-1">
          {theme === "dark" ? "Dark" : "Light"} Mode
        </span>
      </div>
      <Switch
        checked={!(theme === "dark")}
        onCheckedChange={toggleTheme}
        aria-label="Toggle theme"
        className="mr-4"
      />
    </Card>
  );
}
