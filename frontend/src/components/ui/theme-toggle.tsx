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
    if (mounted) {
      setIsChecked(resolvedTheme === "dark");
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
    setTheme(newTheme);
  };

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "relative inline-flex h-8 w-14 items-center rounded-full focus:outline-none transition-colors duration-300 ease-in-out",
        isChecked ? "bg-slate-700" : "bg-slate-300",
        className
      )}
      aria-label="Toggle theme"
    >
      {/* Switch circle */}
      <span
        className={cn(
          "inline-flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-lg transition-transform duration-300 ease-in-out",
          isChecked ? "translate-x-7" : "translate-x-1"
        )}
      >
        {/* Icon inside the circle */}
        <span className="relative w-3.5 h-3.5">
          <Sun
            className={cn(
              "absolute inset-0 h-3.5 w-3.5 text-amber-500 transition-all duration-300",
              isChecked ? "opacity-0 scale-0 rotate-90" : "opacity-100 scale-100 rotate-0"
            )}
          />
          <Moon
            className={cn(
              "absolute inset-0 h-3.5 w-3.5 text-slate-700 transition-all duration-300",
              isChecked ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-0 -rotate-90"
            )}
          />
        </span>
      </span>
    </button>
  );
}