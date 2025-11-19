import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "../../lib/utils";
import { useEffect, useState } from "react";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && resolvedTheme) {
      // Add small delay to let the component render before syncing
      const timer = setTimeout(() => {
        setIsChecked(resolvedTheme === "dark");
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [resolvedTheme, mounted]);

  if (!mounted) {
    return (
      <div className="inline-flex h-8 w-14 items-center rounded-full bg-slate-300">
        <span className="inline-flex h-6 w-6 rounded-full bg-white shadow-lg" style={{ transform: "translateX(4px)" }} />
      </div>
    );
  }

  const handleToggle = () => {
    const newTheme = isChecked ? "light" : "dark";
    setIsChecked(!isChecked);

    // Set theme slightly after state change so transition happens first
    setTimeout(() => {
      setTheme(newTheme);
    }, 50);
  };

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "theme-toggle relative inline-flex h-8 w-14 items-center rounded-full focus:outline-none",
        className
      )}
      style={{
        backgroundColor: isChecked ? "#10b981" : "#e2e8f0"
      }}
      aria-label="Toggle theme"
    >
      {/* Switch circle */}
      <span
        className={cn(
          "theme-toggle-circle inline-flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-lg"
        )}
        style={{
          transform: isChecked ? "translateX(28px)" : "translateX(4px)"
        }}
      >
        {/* Icon inside the circle */}
        <span className="relative w-3.5 h-3.5">
          <Sun
            className="theme-toggle-icon absolute inset-0 h-3.5 w-3.5 text-amber-500"
            style={{
              opacity: isChecked ? 0 : 1,
              transform: isChecked ? "scale(0) rotate(180deg)" : "scale(1.2) rotate(0deg)"
            }}
          />
          <Moon
            className="theme-toggle-icon absolute inset-0 h-3.5 w-3.5 text-slate-700"
            style={{
              opacity: isChecked ? 1 : 0,
              transform: isChecked ? "scale(1.2) rotate(0deg)" : "scale(0) rotate(-180deg)"
            }}
          />
        </span>
      </span>
    </button>
  );
}