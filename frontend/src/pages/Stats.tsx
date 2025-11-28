import { useState, useEffect } from "react";
import { Card } from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { BarChart3, Loader2 } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "../contexts/AuthContext";
import {
  getWeeklyStats,
  getMonthlyStats,
} from "../services/api/profile.service";
import { getGoalLabel } from "../utils/goals";

interface ChartData {
  day?: string;
  week?: string;
  calories: number;
  goal: number;
}

const DAY_NAMES = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];
const CHART_HEIGHT = 200;

export const Stats = () => {
  const { user, token } = useAuth();
  const [timeRange, setTimeRange] = useState<"week" | "month">("week");
  const [weeklyData, setWeeklyData] = useState<ChartData[]>([]);
  const [monthlyData, setMonthlyData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch statistiche in base al timeRange
  useEffect(() => {
    if (!token) return;

    const fetchStats = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (timeRange === "week") {
          const res = await getWeeklyStats(token);
          if (res.success) {
            setWeeklyData(
              res.data.dailyBreakdown.map((day) => ({
                day: DAY_NAMES[new Date(day.date).getDay()],
                calories: day.calories,
                goal: res.data.summary.targetCalories,
              }))
            );
          }
        } else {
          const res = await getMonthlyStats(token);
          if (res.success) {
            const weeks = Array.from({ length: 4 }, (_, i) => {
              const start = i * 7;
              const end = Math.min(start + 7, res.data.dailyBreakdown.length);
              const weekDays = res.data.dailyBreakdown.slice(start, end);
              return {
                week: `Sett ${i + 1}`,
                calories: weekDays.reduce((sum, d) => sum + d.calories, 0),
                goal: res.data.summary.targetCalories * 7,
              };
            });
            setMonthlyData(weeks);
          }
        }
      } catch (err) {
        console.error("Errore caricamento statistiche:", err);
        setError("Errore nel caricamento delle statistiche");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [token, timeRange]);

  const currentData = timeRange === "week" ? weeklyData : monthlyData;
  const bestDay = weeklyData.length
    ? weeklyData.reduce((max, d) => (d.calories > max.calories ? d : max)).day
    : "-";

  if (isLoading && !currentData.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <BarChart3 className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Statistiche</h1>
      </div>

      {error && (
        <Card className="p-4 bg-destructive/10 border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
        </Card>
      )}

      <Tabs
        value={timeRange}
        onValueChange={(v) => setTimeRange(v as "week" | "month")}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="week">Settimana</TabsTrigger>
          <TabsTrigger value="month">Mese</TabsTrigger>
        </TabsList>

        <TabsContent value="week" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Calorie Giornaliere</h3>
            <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="calories"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
                <Bar dataKey="goal" fill="#9ca3af" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Tendenza Settimanale</h3>
            <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="calories"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="month" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Calorie Settimanali</h3>
            <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="calories"
                  fill="hsl(var(--energy))"
                  radius={[4, 4, 0, 0]}
                />
                <Bar dataKey="goal" fill="#9ca3af" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="p-4 bg-gradient-to-r from-success/10 to-primary/10 border-success/20">
        <h3 className="font-medium mb-2 flex items-center gap-2">
          🎯 <span>Insight della Settimana</span>
        </h3>
        <p className="text-sm text-muted-foreground">
          Ottimo lavoro! Il tuo giorno migliore è stato {bestDay}.
        </p>
      </Card>

      <Card className="p-4">
        <h3 className="font-medium mb-3">Obiettivi</h3>
        <div className="space-y-3">
          <GoalItem
            label="Calorie giornaliere"
            value={`${user?.profile?.dailyCalories || 0} kcal`}
          />
          {user?.profile?.weight && (
            <GoalItem
              label="Peso attuale"
              value={`${user.profile.weight} kg`}
            />
          )}
          {user?.profile?.goal && (
            <GoalItem
              label="Obiettivo"
              value={getGoalLabel(user.profile.goal)}
            />
          )}
        </div>
      </Card>
    </div>
  );
};

const GoalItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm">{label}</span>
    <span className="text-sm font-medium">{value}</span>
  </div>
);
