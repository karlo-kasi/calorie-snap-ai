import { useState, useEffect } from "react";
import { Card } from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { BarChart3, TrendingUp, Target, Loader2 } from "lucide-react";
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
import { getWeeklyStats, getMonthlyStats } from "../services/api/profile.service";

interface WeeklyData {
  day: string;
  calories: number;
  goal: number;
}

interface MonthlyData {
  week: string;
  calories: number;
  goal: number;
}

export const Stats = () => {
  const { user, token, isLoading } = useAuth();
  const [timeRange, setTimeRange] = useState("week");
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carica le statistiche settimanali
  useEffect(() => {
    const loadWeeklyStats = async () => {
      if (!token || timeRange !== "week") return;

      try {
        setIsLoadingStats(true);
        setError(null);
        const response = await getWeeklyStats(token);

        if (response.success) {
          const chartData = response.data.dailyBreakdown.map((day) => {
            const date = new Date(day.date);
            const dayNames = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];
            return {
              day: dayNames[date.getDay()],
              calories: day.calories,
              goal: response.data.summary.targetCalories,
            };
          });
          setWeeklyData(chartData);
        }
      } catch (err) {
        console.error("Errore caricamento statistiche settimanali:", err);
        setError("Errore nel caricamento delle statistiche settimanali");
      } finally {
        setIsLoadingStats(false);
      }
    };

    loadWeeklyStats();
  }, [token, timeRange]);

  // Carica le statistiche mensili
  useEffect(() => {
    const loadMonthlyStats = async () => {
      if (!token || timeRange !== "month") return;

      try {
        setIsLoadingStats(true);
        setError(null);
        const response = await getMonthlyStats(token);

        if (response.success) {
          const dailyData = response.data.dailyBreakdown;
          const weeklyGroups: MonthlyData[] = [];

          for (let i = 0; i < 4; i++) {
            const weekStart = i * 7;
            const weekEnd = Math.min(weekStart + 7, dailyData.length);
            const weekDays = dailyData.slice(weekStart, weekEnd);

            const weekCalories = weekDays.reduce(
              (sum, day) => sum + day.calories,
              0
            );

            weeklyGroups.push({
              week: `Sett ${i + 1}`,
              calories: weekCalories,
              goal: response.data.summary.targetCalories * 7,
            });
          }

          setMonthlyData(weeklyGroups);
        }
      } catch (err) {
        console.error("Errore caricamento statistiche mensili:", err);
        setError("Errore nel caricamento delle statistiche mensili");
      } finally {
        setIsLoadingStats(false);
      }
    };

    loadMonthlyStats();
  }, [token, timeRange]);

  const stats = {
    avgDaily:
      weeklyData.length > 0
        ? Math.round(
            weeklyData.reduce((sum, d) => sum + d.calories, 0) /
              (weeklyData.filter((d) => d.calories > 0).length || 1)
          )
        : 0,
    bestDay:
      weeklyData.length > 0
        ? weeklyData.reduce((max, d) =>
            d.calories > max.calories ? d : max,
            weeklyData[0]
          ).day
        : "-",
    streak: 0,
    totalWeek: weeklyData.reduce((sum, d) => sum + d.calories, 0),
  };

  if (isLoadingStats && weeklyData.length === 0 && monthlyData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <BarChart3 className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Statistiche</h1>
      </div>

      {error && (
        <Card className="p-4 bg-destructive/10 border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 floating-card">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Target className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="text-lg font-semibold">
                {stats.avgDaily || 0}
              </div>
              <div className="text-xs text-muted-foreground">
                Media giornaliera
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 floating-card">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-energy/10 rounded-full flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-energy" />
            </div>
            <div>
              <div className="text-lg font-semibold">{stats.streak}</div>
              <div className="text-xs text-muted-foreground">
                Giorni consecutivi
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <Tabs value={timeRange} onValueChange={setTimeRange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="week">Settimana</TabsTrigger>
          <TabsTrigger value="month">Mese</TabsTrigger>
        </TabsList>

        <TabsContent value="week" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Calorie Giornaliere</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="calories" fill="hsl(var(--primary))" radius={4} />
                <Bar dataKey="goal" fill="hsl(var(--muted))" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Tendenza Settimanale</h3>
            <ResponsiveContainer width="100%" height={200}>
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
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="calories" fill="hsl(var(--energy))" radius={4} />
                <Bar dataKey="goal" fill="hsl(var(--muted))" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Insights */}
      <Card className="p-4 bg-gradient-to-r from-success/10 to-primary/10 border-success/20">
        <h3 className="font-medium mb-2 flex items-center gap-2">
          🎯 <span>Insight della Settimana</span>
        </h3>
        <p className="text-sm text-muted-foreground">
          Ottimo lavoro! Hai mantenuto una media di {stats.avgDaily} calorie
          giornaliere. Il tuo giorno migliore è stato {stats.bestDay}.
        </p>
      </Card>

      {/* Goals */}
      <Card className="p-4">
        <h3 className="font-medium mb-3">Obiettivi</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Calorie giornaliere</span>
            <span className="text-sm font-medium">
              {user?.profile?.dailyCalories || 0} kcal
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Giorni consecutivi</span>
            <span className="text-sm font-medium text-success">
              {stats.streak}/30
            </span>
          </div>
          {user?.profile?.weight && (
            <div className="flex items-center justify-between">
              <span className="text-sm">Peso attuale</span>
              <span className="text-sm font-medium">
                {user.profile.weight} kg
              </span>
            </div>
          )}
          {user?.profile?.goal && (
            <div className="flex items-center justify-between">
              <span className="text-sm">Obiettivo</span>
              <span className="text-sm font-medium capitalize">
                {user.profile.goal}
              </span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
