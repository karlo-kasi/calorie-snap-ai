import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FoodCard } from '@/components/FoodCard/FoodCard';
import { BookOpen, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, subDays } from 'date-fns';
import { it } from 'date-fns/locale';

export const Diary = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Mock data - in real app this would come from state/API
  const dailyFoods = {
    breakfast: [
      { id: '1', name: 'Caffè con latte', calories: 80, quantity: '1 tazza', time: '07:30' },
      { id: '2', name: 'Cornetto', calories: 320, quantity: '1 pezzo', time: '07:35' }
    ],
    lunch: [
      { id: '3', name: 'Insalata mista', calories: 150, quantity: '1 porzione', time: '13:00' },
      { id: '4', name: 'Pollo alla griglia', calories: 280, quantity: '150g', time: '13:15' }
    ],
    dinner: [
      { id: '5', name: 'Pasta al pomodoro', calories: 420, quantity: '80g', time: '19:30' },
      { id: '6', name: 'Insalata verde', calories: 50, quantity: '1 porzione', time: '19:45' }
    ],
    snacks: [
      { id: '7', name: 'Mela', calories: 95, quantity: '1 media', time: '16:00' }
    ]
  };

  const totalCalories = Object.values(dailyFoods)
    .flat()
    .reduce((sum, food) => sum + food.calories, 0);

  const mealSections = [
    { key: 'breakfast', title: 'Colazione', icon: '🌅', foods: dailyFoods.breakfast },
    { key: 'lunch', title: 'Pranzo', icon: '🍽️', foods: dailyFoods.lunch },
    { key: 'dinner', title: 'Cena', icon: '🌙', foods: dailyFoods.dinner },
    { key: 'snacks', title: 'Spuntini', icon: '🍎', foods: dailyFoods.snacks }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <BookOpen className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Diario Alimentare</h1>
      </div>

      {/* Date Navigator */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSelectedDate(subDays(selectedDate, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="text-center">
            <div className="font-semibold">
              {format(selectedDate, 'EEEE d MMMM', { locale: it })}
            </div>
            <div className="text-sm text-muted-foreground">
              {totalCalories} kcal totali
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setSelectedDate(addDays(selectedDate, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      {/* Daily Summary */}
      <Card className="p-4 gradient-primary text-primary-foreground">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-lg font-semibold">{totalCalories} kcal</div>
            <div className="text-sm opacity-90">Consumate oggi</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold">580 kcal</div>
            <div className="text-sm opacity-90">Rimaste</div>
          </div>
        </div>
      </Card>

      {/* Meal Sections */}
      {mealSections.map((section) => (
        <div key={section.key} className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold flex items-center gap-2">
              <span>{section.icon}</span>
              {section.title}
              <span className="text-sm text-muted-foreground">
                ({section.foods.reduce((sum, food) => sum + food.calories, 0)} kcal)
              </span>
            </h2>
            <Button variant="ghost" size="sm">
              + Aggiungi
            </Button>
          </div>
          
          <div className="space-y-2">
            {section.foods.length > 0 ? (
              section.foods.map((food) => (
                <FoodCard key={food.id} {...food} />
              ))
            ) : (
              <Card className="p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Nessun cibo aggiunto per {section.title.toLowerCase()}
                </p>
                <Button variant="ghost" size="sm" className="mt-2">
                  + Aggiungi cibo
                </Button>
              </Card>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};