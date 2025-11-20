import { useState, useRef } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Camera, Search, Upload, Plus, Loader2} from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { createMeal } from '../services/api/meal.service';
import { useAuth } from '../contexts/AuthContext';
import type { MealType, Ingredient } from '../types/meal.types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

export const AddFood = () => {
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [calories, setCalories] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mealType, setMealType] = useState<MealType>('lunch');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { token } = useAuth();

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


  // Invia foto al backend e crea il pasto
  const sendPhotoToBackend = async (file: File) => {
    setIsAnalyzing(true);

    try {
      // Verifica autenticazione
      if (!token) {
        toast({
          title: "Autenticazione richiesta",
          description: "Effettua il login per continuare",
          variant: "destructive"
        });
        return;
      }

      // Crea il pasto con analisi AI
      const result = await createMeal(file, token, {
        mealType,
        imageBase64: '', // Verrà popolato da createMeal
        mediaType: ''    // Verrà popolato da createMeal
      });

      if (result.success && result.data) {
        const meal = result.data;

        toast({
          title: "Pasto creato! 🎉",
          description: `${meal.dishName} aggiunto al diario`,
        });

        // Log dettagli completi
        console.log('✅ Pasto creato con successo:');
        console.log('🍝 Piatto:', meal.dishName);
        console.log('⚖️ Peso totale:', meal.totalWeight + 'g');
        console.log('📊 Calorie totali:', meal.totalCalories);
        console.log('🥗 Ingredienti:');
        meal.ingredients.forEach((ing: Ingredient) => {
          console.log(`  - ${ing.name}: ${ing.quantity}g (${ing.calories}kcal)`);
        });
        console.log('💪 Macronutrienti totali:');
        console.log('  - Proteine:', meal.totalMacros.proteins + 'g');
        console.log('  - Carboidrati:', meal.totalMacros.carbohydrates + 'g');
        console.log('  - Grassi:', meal.totalMacros.fats + 'g');
        console.log('🎯 Confidenza:', meal.confidence);

        // Opzionale: redirect al diario o refresh della lista
        // navigate('/diary');
      }

    } catch (error) {
      console.error('❌ Errore:', error);
      toast({
        title: "Errore nella creazione del pasto",
        description: error instanceof Error ? error.message : 'Riprova più tardi',
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Carica da galleria
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) return;

    // Valida il tipo di file
    if (!file.type.startsWith('image/')) {
      toast({
        title: "File non valido",
        description: "Carica solo immagini (JPG, PNG, etc.)",
        variant: "destructive"
      });
      return;
    }

    // Valida la dimensione (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File troppo grande",
        description: "L'immagine deve essere inferiore a 5MB",
        variant: "destructive"
      });
      return;
    }

    setPhotoFile(file);
    
    // Invia al backend
    await sendPhotoToBackend(file);
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
                {isAnalyzing ? (
                  <Loader2 className="h-10 w-10 text-primary animate-spin" />
                ) : (
                  <Camera className="h-10 w-10 text-primary" />
                )}
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Riconoscimento AI</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Scatta una foto del tuo piatto e l'AI riconoscerà automaticamente il cibo e calcolerà le calorie.
                </p>
              </div>

              {/* Selettore tipo pasto */}
              <div className="space-y-2">
                <Label htmlFor="mealType">Tipo di pasto</Label>
                <Select value={mealType} onValueChange={(value) => setMealType(value as MealType)}>
                  <SelectTrigger id="mealType">
                    <SelectValue placeholder="Seleziona il tipo di pasto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">🌅 Colazione</SelectItem>
                    <SelectItem value="lunch">☀️ Pranzo</SelectItem>
                    <SelectItem value="dinner">🌙 Cena</SelectItem>
                    <SelectItem value="snack">🍪 Spuntino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Input nascosto per file */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              <div className="space-y-3">
                <Button 
                  className="w-full gradient-energy"
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analisi in corso...
                    </>
                  ) : (
                    <>
                      <Camera className="mr-2 h-4 w-4" />
                      Scatta Foto
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isAnalyzing}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Carica da Galleria
                </Button>
              </div>
              
              {photoFile && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700">
                    ✅ Foto caricata: {photoFile.name}
                  </p>
                </div>
              )}
              
              <div className="mt-6 p-4 bg-energy/10 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  🤖 <strong>Powered by Claude AI:</strong> L'analisi viene effettuata da modelli AI avanzati che riconoscono automaticamente cibi e ingredienti.
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      
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