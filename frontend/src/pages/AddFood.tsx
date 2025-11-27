import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Camera, Upload, Loader2, Plus, UtensilsCrossed } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { createMeal } from '../services/api/meal.service';
import { useAuth } from '../contexts/AuthContext';
import type { MealType } from '../types/meal.types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

// Utility per indovinare il pasto in base all'orario
const getTimeBasedMealType = (): MealType => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return 'breakfast';
  if (hour >= 11 && hour < 15) return 'lunch';
  if (hour >= 15 && hour < 19) return 'snack';
  return 'dinner';
};

export const AddFood = () => {
  // State
  const [activeTab, setActiveTab] = useState('photo');
  const [mealType, setMealType] = useState<MealType>(getTimeBasedMealType());

  // Form Manuale
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [calories, setCalories] = useState('');

  // Foto
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();
  const { token } = useAuth();

  // Aggiorna il tipo di pasto se l'utente apre l'app in orari diversi
  useEffect(() => {
    setMealType(getTimeBasedMealType());
  }, []);

  const handleManualAdd = () => {
    if (!foodName) {
      toast({ title: "Nome richiesto", description: "Inserisci il nome del cibo", variant: "destructive" });
      return;
    }
    // Logica di salvataggio manuale...
    toast({ title: "Pasto aggiunto", description: `${foodName} aggiunto con successo` });
    setFoodName('');
    setQuantity('');
    setCalories('');
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File troppo grande", description: "Dimensione massima 5MB", variant: "destructive" });
      return;
    }

    setIsAnalyzing(true);

    try {
      if (!token) throw new Error("Login richiesto");

      const result = await createMeal(file, token, {
        mealType,
        imageBase64: '',
        mediaType: ''
      });

      if (result?.success) {
        toast({
          title: "Analisi completata",
          description: `${result.data.dishName} - ${result.data.totalCalories} kcal`,
        });
      }
    } catch (error) {
      toast({
        title: "Errore analisi",
        description: "Impossibile riconoscere il piatto. Riprova.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const triggerCamera = () => fileInputRef.current?.click();

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center space-x-2">
        <UtensilsCrossed className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Aggiungi Pasto</h1>
      </div>

      {/* Meal Type Selector */}
      <Card className="p-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Tipo di pasto</Label>
          <Select value={mealType} onValueChange={(v) => setMealType(v as MealType)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="breakfast">Colazione</SelectItem>
              <SelectItem value="lunch">Pranzo</SelectItem>
              <SelectItem value="dinner">Cena</SelectItem>
              <SelectItem value="snack">Snack</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="photo">
            <Camera className="h-4 w-4 mr-2" />
            Scatta Foto
          </TabsTrigger>
          <TabsTrigger value="manual">
            <Plus className="h-4 w-4 mr-2" />
            Manuale
          </TabsTrigger>
        </TabsList>

        {/* TAB FOTO (AI) */}
        <TabsContent value="photo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Analisi con AI</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

              {/* Upload Area */}
              <div
                onClick={!isAnalyzing ? triggerCamera : undefined}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isAnalyzing
                    ? 'border-primary bg-primary/5'
                    : 'border-muted-foreground/25 hover:border-primary'
                }`}
              >
                {isAnalyzing ? (
                  <div className="space-y-3">
                    <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
                    <p className="font-medium">Analisi in corso...</p>
                    <p className="text-sm text-muted-foreground">Riconoscimento ingredienti e calorie</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Camera className="h-12 w-12 mx-auto text-muted-foreground" />
                    <div>
                      <p className="font-medium">Scatta o carica una foto</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        L'AI riconoscerà automaticamente il piatto
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Hidden Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isAnalyzing}
              />

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={triggerCamera}
                  disabled={isAnalyzing}
                  className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Fotocamera
                </Button>
                <Button
                  variant="outline"
                  onClick={triggerCamera}
                  disabled={isAnalyzing}
                  className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Galleria
                </Button>
              </div>

            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB MANUALE */}
        <TabsContent value="manual">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Inserimento manuale</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

              <div className="space-y-2">
                <Label htmlFor="foodName">Nome cibo</Label>
                <Input
                  id="foodName"
                  placeholder="es. Pasta al pomodoro"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantità (g)</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="100"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="calories">Calorie (kcal)</Label>
                  <Input
                    id="calories"
                    type="number"
                    placeholder="Opzionale"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                  />
                </div>
              </div>

              <Button onClick={handleManualAdd} className="w-full">
                Aggiungi al diario
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
