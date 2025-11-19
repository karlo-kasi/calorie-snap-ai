import React from "react";
import { Card } from "../../components/ui/card";
import { format, isToday } from "date-fns";
import { it } from "date-fns/locale";
import { Flame, Target, TrendingDown } from "lucide-react";

interface CalorieCardProps {
  consumed: number;
  goal: number;
  remaining: number;
  date?: Date;
}

export const CalorieCard: React.FC<CalorieCardProps> = ({
  consumed,
  goal,
  remaining,
  date = new Date(),
}) => {
  const percentage = Math.min((consumed / goal) * 100, 100);
  const isCurrentDay = isToday(date);
  const isOverGoal = consumed > goal;

  // SVG circle settings
  const size = 140;
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percentage / 100);

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-primary/5 h-full flex flex-col relative">
      {/* Header con data */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg">Calorie</h3>
        </div>
        <div className="">
          {isCurrentDay && (
            <span className="inline-flex items-center px-2 py-0.5 text-sm font-medium rounded-full bg-green-100 text-green-800">
              Oggi
            </span>
          )}
        </div>
      </div>

      {/* Circular Progress - PIÙ GRANDE */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative">
          <svg
            className="w-36 h-36"
            viewBox={`0 0 ${size} ${size}`}
            aria-label={`${consumed} calorie consumate su ${goal}`}
          >
            <defs>
              <linearGradient id="calorieGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isOverGoal ? "#ef4444" : "#06b6d4"} />
                <stop offset="100%" stopColor={isOverGoal ? "#dc2626" : "#10b981"} />
              </linearGradient>
            </defs>

            {/* Background ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="hsl(var(--muted))"
              strokeWidth={stroke}
              fill="transparent"
            />

            {/* Progress ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="url(#calorieGradient)"
              strokeWidth={stroke}
              strokeLinecap="round"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              className="transition-all duration-500"
            />
          </svg>

          {/* Testo centrale */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-primary">{consumed}</div>
            <div className="text-sm text-muted-foreground">/ {goal} kcal</div>
            <div className={`text-xs font-medium mt-1 ${isOverGoal ? 'text-red-600' : 'text-green-600'}`}>
              {Math.round(percentage)}%
            </div>
          </div>
        </div>
      </div>

      {/* Stats compatte sotto */}
      <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t">
        <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 dark:bg-green-500/20">
          <div className="w-8 h-8 rounded-full bg-green-500/20 dark:bg-green-500/30 flex items-center justify-center">
            <TrendingDown className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <div className="text-lg font-bold text-green-700 dark:text-green-400">{remaining > 0 ? remaining : 0}</div>
            <div className="text-xs text-green-600 dark:text-green-500">Rimaste</div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-500/10 dark:bg-blue-500/20">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 dark:bg-blue-500/30 flex items-center justify-center">
            <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <div className="text-lg font-bold text-blue-700 dark:text-blue-400">{goal}</div>
            <div className="text-xs text-blue-600 dark:text-blue-500">Obiettivo</div>
          </div>
        </div>
      </div>
    </Card>
  );
};