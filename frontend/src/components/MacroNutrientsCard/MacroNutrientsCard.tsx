import React from "react";
import { Card } from "../ui/card";
import { Drumstick, Wheat, Droplet } from "lucide-react";

interface MacroNutrient {
  name: string;
  current: number;
  goal: number;
  unit: string;
  color: string;
  bgColor: string;
  icon: React.ElementType;
}

interface MacroNutrientsCardProps {
  proteins?: number;
  carbs?: number;
  fats?: number;
  proteinsGoal?: number;
  carbsGoal?: number;
  fatsGoal?: number;
}

export const MacroNutrientsCard: React.FC<MacroNutrientsCardProps> = ({
  proteins,
  carbs,
  fats,
  proteinsGoal,
  carbsGoal,
  fatsGoal,
}) => {
  const macros: MacroNutrient[] = [
    {
      name: "Proteine",
      current: proteins,
      goal: proteinsGoal,
      unit: "g",
      color: "#ef4444", // red
      bgColor: "rgba(239, 68, 68, 0.1)", // red with opacity
      icon: Drumstick,
    },
    {
      name: "Carboidrati",
      current: carbs,
      goal: carbsGoal,
      unit: "g",
      color: "#f59e0b", // amber
      bgColor: "rgba(245, 158, 11, 0.1)", // amber with opacity
      icon: Wheat,
    },
    {
      name: "Grassi",
      current: fats,
      goal: fatsGoal,
      unit: "g",
      color: "#3b82f6", // blue
      bgColor: "rgba(59, 130, 246, 0.1)", // blue with opacity
      icon: Droplet,
    },
  ];

  const calculatePercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-primary/5 h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg">Macronutrienti</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Progressione giornaliera
        </p>
      </div>

      {/* Macro nutrients list */}
      <div className="space-y-5 flex-1">
        {macros.map((macro) => {
          const percentage = calculatePercentage(macro.current, macro.goal);
          const Icon = macro.icon;

          return (
            <div key={macro.name} className="space-y-2">
              {/* Header row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: macro.bgColor }}
                  >
                    <Icon className="w-4 h-4" style={{ color: macro.color }} />
                  </div>
                  <span className="font-medium text-sm">{macro.name}</span>
                </div>
                <div className="text-sm font-semibold">
                  <span style={{ color: macro.color }}>{macro.current}</span>
                  <span className="text-muted-foreground">
                    {" "}
                    / {macro.goal} {macro.unit}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: macro.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
