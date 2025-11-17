import React from "react";
import { Card } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";

interface CalorieCardProps {
  consumed: number;
  goal: number;
  remaining: number;
}

export const CalorieCard = ({
  consumed,
  goal,
  remaining,
}: CalorieCardProps) => {
  const percentage = Math.min((consumed / goal) * 100, 100);

  return (
    <Card className="p-6 bg-gradient-to-br from-white h-full flex flex-col justify-center">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-primary/20 to-energy/20 p-1">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {consumed}
                </div>
                <div className="text-xs text-muted-foreground">consumate</div>
              </div>
            </div>
          </div>
          <div
            className="absolute inset-0 w-32 h-32 mx-auto rounded-full calorie-progress"
            style={{ "--progress": percentage } as React.CSSProperties}
          />
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-energy">{goal}</div>
            <div className="text-xs text-muted-foreground">Obiettivo</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-success">
              {remaining}
            </div>
            <div className="text-xs text-muted-foreground">Rimaste</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-primary">
              {Math.round(percentage)}%
            </div>
            <div className="text-xs text-muted-foreground">Raggiunto</div>
          </div>
        </div>

        <Progress value={percentage} className="h-2" />
      </div>
    </Card>
  );
};
