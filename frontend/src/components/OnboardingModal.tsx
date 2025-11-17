import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/use-toast";
import {
  ArrowRight,
  ArrowLeft,
  User,
  Activity,
  Target,
  Sparkles,
} from "lucide-react";
import { Progress } from "./ui/progress";

interface OnboardingModalProps {
  open: boolean;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ open }) => {
  const { completeOnboarding } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    age: "",
    height: "",
    weight: "",
    gender: "" as "male" | "female" | "other" | "",
    activityLevel: "",
    goal: "",
  });

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleNext = () => {
    // Validazione per ogni step
    if (step === 1) {
      if (
        !formData.name ||
        !formData.surname ||
        !formData.age ||
        !formData.height ||
        !formData.weight ||
        !formData.gender
      ) {
        toast({
          title: "Campi mancanti",
          description: "Compila tutti i campi per continuare",
          variant: "destructive",
        });
        return;
      }
    } else if (step === 2) {
      if (!formData.activityLevel) {
        toast({
          title: "Seleziona un livello",
          description: "Seleziona il tuo livello di attività",
          variant: "destructive",
        });
        return;
      }
    }

    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (!formData.goal) {
      toast({
        title: "Seleziona un obiettivo",
        description: "Seleziona il tuo obiettivo per continuare",
        variant: "destructive",
      });
      return;
    }

    console.log("🚀 Inizio handleSubmit con dati:", formData);
    setIsLoading(true);

    setIsLoading(true);
    try {
      const onboardingData = {
        name: formData.name,
        surname: formData.surname,
        age: parseInt(formData.age),
        height: parseInt(formData.height),
        weight: parseInt(formData.weight),
        gender: formData.gender as "male" | "female" | "other",
        activityLevel: formData.activityLevel,
        goal: formData.goal,
      };

      console.log("📋 Dati da inviare:", onboardingData);

      await completeOnboarding(onboardingData);

      console.log("✅ completeOnboarding completata con successo!");

      toast({
        title: "Profilo completato!",
        description: "Il tuo profilo è stato configurato con successo",
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Si è verificato un errore. Riprova.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-[500px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">
            {step === 1 && "Parliamo di te"}
            {step === 2 && "La tua attività"}
            {step === 3 && "Il tuo obiettivo"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {step === 1 &&
              "Inserisci le tue informazioni base per calcolare il fabbisogno calorico"}
            {step === 2 && "Quanto sei attivo durante la giornata?"}
            {step === 3 && "Qual è il tuo obiettivo principale?"}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="mb-6">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground text-center mt-2">
            Step {step} di {totalSteps}
          </p>
        </div>

        {/* Step 1: Informazioni personali */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Mario"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="surname">Cognome</Label>
                <Input
                  id="surname"
                  type="text"
                  placeholder="Rossi"
                  value={formData.surname}
                  onChange={(e) => updateField("surname", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Età</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="28"
                  value={formData.age}
                  onChange={(e) => updateField("age", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Altezza (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="175"
                  value={formData.height}
                  onChange={(e) => updateField("height", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="70"
                value={formData.weight}
                onChange={(e) => updateField("weight", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Sesso</Label>
              <RadioGroup
                value={formData.gender}
                onValueChange={(value) => updateField("gender", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male" className="cursor-pointer">
                    Maschio
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female" className="cursor-pointer">
                    Femmina
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other" className="cursor-pointer">
                    Altro
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )}

        {/* Step 2: Livello di attività */}
        {step === 2 && (
          <div className="space-y-4">
            <Select
              value={formData.activityLevel}
              onValueChange={(value) => updateField("activityLevel", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleziona il tuo livello di attività" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Sedentario</span>
                    <span className="text-xs text-muted-foreground">
                      Poco o nessun esercizio
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="light">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Leggermente attivo</span>
                    <span className="text-xs text-muted-foreground">
                      Esercizio leggero 1-3 giorni/settimana
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="moderate">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Moderatamente attivo</span>
                    <span className="text-xs text-muted-foreground">
                      Esercizio moderato 3-5 giorni/settimana
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="active">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Molto attivo</span>
                    <span className="text-xs text-muted-foreground">
                      Esercizio intenso 6-7 giorni/settimana
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="extra-active">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Estremamente attivo</span>
                    <span className="text-xs text-muted-foreground">
                      Esercizio molto intenso, lavoro fisico
                    </span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <Activity className="w-5 h-5 text-primary mb-2" />
              <p className="text-sm text-muted-foreground">
                Il livello di attività ci aiuta a calcolare con precisione il
                tuo fabbisogno calorico giornaliero
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Obiettivo */}
        {step === 3 && (
          <div className="space-y-4">
            <RadioGroup
              value={formData.goal}
              onValueChange={(value) => updateField("goal", value)}
            >
              <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary transition-colors cursor-pointer">
                <RadioGroupItem
                  value="lose_1kg_week" // Cambiato da "lose-weight"
                  id="lose-weight"
                  className="mt-1"
                />
                <Label htmlFor="lose-weight" className="cursor-pointer flex-1">
                  <div className="font-medium">Perdere peso</div>
                  <div className="text-sm text-muted-foreground">
                    Deficit calorico per dimagrimento graduale
                  </div>
                </Label>
              </div>

              <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary transition-colors cursor-pointer">
                <RadioGroupItem
                  value="maintain"
                  id="maintain"
                  className="mt-1"
                />
                <Label htmlFor="maintain" className="cursor-pointer flex-1">
                  <div className="font-medium">Mantenere il peso</div>
                  <div className="text-sm text-muted-foreground">
                    Equilibrio calorico per peso stabile
                  </div>
                </Label>
              </div>

              <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary transition-colors cursor-pointer">
                <RadioGroupItem
                  value="gain_1kg_week" // Cambiato da "gain-weight"
                  id="gain-weight"
                  className="mt-1"
                />
                <Label htmlFor="gain-weight" className="cursor-pointer flex-1">
                  <div className="font-medium">Aumentare la massa</div>
                  <div className="text-sm text-muted-foreground">
                    Surplus calorico per crescita muscolare
                  </div>
                </Label>
              </div>
            </RadioGroup>

            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <Target className="w-5 h-5 text-primary mb-2" />
              <p className="text-sm text-muted-foreground">
                Calcoleremo il tuo fabbisogno calorico ideale in base al tuo
                obiettivo
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-3 mt-6">
          {step > 1 && (
            <Button variant="outline" onClick={handleBack} className="flex-1">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Indietro
            </Button>
          )}

          {step < totalSteps ? (
            <Button onClick={handleNext} className="flex-1 ml-auto">
              Continua
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 ml-auto"
            >
              {isLoading ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                  Completamento...
                </>
              ) : (
                <>
                  Completa
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
