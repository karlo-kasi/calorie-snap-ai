import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Search, Upload, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const AddFood = () => {
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [calories, setCalories] = useState('');
  const { toast } = useToast();

  const handleManualAdd = () => {
    if (!foodName || !quantity || !calories) {
      toast({
        title: "Campi mancanti",
        description: "Compila tutti i campi per aggiungere il cibo.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Cibo aggiunto!",
      description: `${foodName} (${quantity}, ${calories} kcal) aggiunto al diario.`,
    });

    // Reset form
    setFoodName('');
    setQuantity('');
    setCalories('');
  };

  const handlePhotoCapture = () => {
    toast({
      title: "Funzionalità in arrivo",
      description: "Il riconoscimento AI delle immagini sarà disponibile presto!",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Plus className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Aggiungi Cibo</h1>
      </div>

      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual">Manuale</TabsTrigger>
          <TabsTrigger value="photo">Foto AI</TabsTrigger>
        </TabsList>
        
        <TabsContent value="manual" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="foodName">Nome del cibo</Label>
                <Input
                  id="foodName"
                  placeholder="es. Pasta al pomodoro"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="quantity">Quantità</Label>
                <Input
                  id="quantity"
                  placeholder="es. 100g, 1 porzione"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="calories">Calorie (kcal)</Label>
                <Input
                  id="calories"
                  type="number"
                  placeholder="es. 250"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                />
              </div>
              
              <Button onClick={handleManualAdd} className="w-full gradient-primary">
                <Plus className="mr-2 h-4 w-4" />
                Aggiungi al Diario
              </Button>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="photo" className="space-y-4">
          <Card className="p-6">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Camera className="h-10 w-10 text-primary" />
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Riconoscimento AI</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Scatta una foto del tuo piatto e l'AI riconoscerà automaticamente il cibo e calcolerà le calorie.
                </p>
              </div>
              
              <div className="space-y-3">
                <Button onClick={handlePhotoCapture} className="w-full gradient-energy">
                  <Camera className="mr-2 h-4 w-4" />
                  Scatta Foto
                </Button>
                
                <Button variant="outline" className="w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  Carica da Galleria
                </Button>
              </div>
              
              <div className="mt-6 p-4 bg-energy/10 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  🚀 <strong>Presto disponibile:</strong> Questa funzionalità utilizzerà modelli AI avanzati per riconoscere automaticamente cibi e ingredienti dalle tue foto.
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Add Suggestions */}
      <Card className="p-4">
        <h3 className="font-medium mb-3">Cibi Frequenti</h3>
        <div className="grid grid-cols-2 gap-2">
          {['Banana', 'Caffè', 'Pane tostato', 'Yogurt'].map((food) => (
            <Button key={food} variant="outline" size="sm" className="justify-start">
              <Search className="mr-2 h-3 w-3" />
              {food}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
};