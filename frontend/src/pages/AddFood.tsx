import { useState, useRef } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Camera, Search, Upload, Plus, Loader2} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export const AddFood = () => {
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [calories, setCalories] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  // Converti File in Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        
        // 🔍 DEBUG: Mostra la stringa completa prima della pulizia
        console.log('📸 Base64 RAW (primi 100 caratteri):', base64String.substring(0, 100));
        
        // Rimuovi il prefisso data:image/jpeg;base64,
        const base64Data = base64String.split(',')[1];
        
        // 🔍 DEBUG: Mostra dopo la pulizia
        console.log('✅ Base64 PULITO (primi 100 caratteri):', base64Data.substring(0, 100));
        console.log('📊 Lunghezza totale:', base64Data.length);
        console.log('🔤 Ultimi 10 caratteri:', base64Data.slice(-10));
        
        // Verifica caratteri validi
        const isValidBase64 = /^[A-Za-z0-9+/]*={0,2}$/.test(base64Data);
        console.log('✓ Base64 valido?', isValidBase64);
        
        resolve(base64Data);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Invia foto al backend
  const sendPhotoToBackend = async (file: File) => {
    setIsAnalyzing(true);
    
    try {
      // Converti in base64
      const base64Image = await fileToBase64(file);
      
      // Determina il tipo MIME
      const mediaType = file.type || 'image/jpeg';

      console.log('📤 Invio foto al backend...');
      console.log('   - Tipo:', mediaType);
      console.log('   - Dimensione base64:', base64Image.length);

      // Chiamata POST al backend
      const response = await fetch('http://localhost:3000/api/analysis/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: base64Image,
          mediaType: mediaType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Errore durante l\'analisi');
      }

      console.log('✅ Analisi completata:', data);

      // ✅ CORREZIONE: Usa la struttura corretta
      if (data.success && data.data) {
        const analysis = data.data;
        
        toast({
          title: "Analisi completata! 🎉",
          description: `Rilevato: ${analysis.dishName}`,
        });

        // Popola i campi
        setFoodName(analysis.dishName);
        setCalories(analysis.calories.toString());
        setQuantity(analysis.portionSize);
        
        // Log dettagli
        console.log('🍝 Piatto:', analysis.dishName);
        console.log('📊 Calorie:', analysis.calories);
        console.log('🥗 Ingredienti:', analysis.ingredients.join(', '));
        console.log('💪 Proteine:', analysis.macronutrients.proteins + 'g');
        console.log('🍞 Carboidrati:', analysis.macronutrients.carbohydrates + 'g');
        console.log('🥑 Grassi:', analysis.macronutrients.fats + 'g');
      }

    } catch (error) {
      console.error('❌ Errore:', error);
      toast({
        title: "Errore nell'analisi",
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