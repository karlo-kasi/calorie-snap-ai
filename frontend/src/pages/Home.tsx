import React from 'react';
import { CalorieCard } from '@/components/CalorieCard/CalorieCard';
import { FoodCard } from '@/components/FoodCard/FoodCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Camera, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/hero-food.jpg';

export const Home = () => {
  // Mock data - in real app this would come from state/API
  const calorieData = {
    consumed: 1420,
    goal: 2000,
    remaining: 580
  };

  const recentFoods = [
    {
      id: '1',
      name: 'Insalata mista',
      calories: 150,
      quantity: '1 porzione',
      time: '13:30'
    },
    {
      id: '2', 
      name: 'Pollo alla griglia',
      calories: 280,
      quantity: '150g',
      time: '12:45'
    }
  ];

  const quickActions = [
    { icon: Camera, label: 'Scatta foto', to: '/add?mode=photo' },
    { icon: Plus, label: 'Aggiungi manuale', to: '/add?mode=manual' },
    { icon: Upload, label: 'Importa', to: '/add?mode=import' }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="p-6 gradient-primary text-primary-foreground overflow-hidden relative">
        <div className="relative z-10">
          <h1 className="text-2xl font-bold mb-2">Ciao! 👋</h1>
          <p className="opacity-90">Oggi stai facendo un ottimo lavoro!</p>
        </div>
        <img 
          src={heroImage} 
          alt="Healthy foods" 
          className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-20"
        />
      </Card>

      {/* Calorie Tracking */}
      <CalorieCard {...calorieData} />

      {/* Quick Actions */}
      <Card className="p-4">
        <h2 className="font-semibold mb-4">Azioni Rapide</h2>
        <div className="grid grid-cols-3 gap-3">
          {quickActions.map((action) => (
            <Link key={action.label} to={action.to}>
              <Button 
                variant="outline" 
                className="h-16 flex-col space-y-1 w-full hover:bg-primary/5 hover:border-primary/30"
              >
                <action.icon size={20} />
                <span className="text-xs">{action.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </Card>

      {/* Recent Foods */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Pasti Recenti</h2>
          <Link to="/diary">
            <Button variant="ghost" size="sm">Vedi tutto</Button>
          </Link>
        </div>
        
        {recentFoods.map((food) => (
          <FoodCard key={food.id} {...food} />
        ))}
      </div>

      {/* Daily Tips */}
      <Card className="p-4 bg-gradient-to-r from-energy/10 to-warning/10 border-energy/20">
        <h3 className="font-medium mb-2 text-energy-foreground">💡 Consiglio del giorno</h3>
        <p className="text-sm text-muted-foreground">
          Bere un bicchiere d'acqua prima dei pasti può aiutarti a sentirti più sazio e controllare le porzioni.
        </p>
      </Card>
    </div>
  );
};