import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, TrendingUp, Calendar, Target } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const Stats = () => {
  const [timeRange, setTimeRange] = useState('week');

  // Mock data - in real app this would come from state/API
  const weeklyData = [
    { day: 'Lun', calories: 1950, goal: 2000 },
    { day: 'Mar', calories: 2100, goal: 2000 },
    { day: 'Mer', calories: 1800, goal: 2000 },
    { day: 'Gio', calories: 2200, goal: 2000 },
    { day: 'Ven', calories: 1900, goal: 2000 },
    { day: 'Sab', calories: 2300, goal: 2000 },
    { day: 'Dom', calories: 1750, goal: 2000 }
  ];

  const monthlyData = [
    { week: 'Sett 1', calories: 14000, goal: 14000 },
    { week: 'Sett 2', calories: 13500, goal: 14000 },
    { week: 'Sett 3', calories: 14200, goal: 14000 },
    { week: 'Sett 4', calories: 13800, goal: 14000 }
  ];

  const stats = {
    avgDaily: 1971,
    bestDay: 'Sabato',
    streak: 12,
    totalWeek: 13800
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <BarChart3 className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Statistiche</h1>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 floating-card">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Target className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="text-lg font-semibold">{stats.avgDaily}</div>
              <div className="text-xs text-muted-foreground">Media giornaliera</div>
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
              <div className="text-xs text-muted-foreground">Giorni consecutivi</div>
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
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
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
          Ottimo lavoro! Hai mantenuto una media di {stats.avgDaily} calorie giornaliere. 
          Il tuo giorno migliore è stato {stats.bestDay}.
        </p>
      </Card>

      {/* Goals */}
      <Card className="p-4">
        <h3 className="font-medium mb-3">Obiettivi</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Calorie giornaliere</span>
            <span className="text-sm font-medium">2000 kcal</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Giorni consecutivi</span>
            <span className="text-sm font-medium text-success">{stats.streak}/30</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Peso obiettivo</span>
            <span className="text-sm font-medium">70 kg</span>
          </div>
        </div>
      </Card>
    </div>
  );
};