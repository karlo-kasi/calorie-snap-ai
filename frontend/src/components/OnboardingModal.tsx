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
  Sparkles,
  Activity,
  Target,
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

  // Definizione titoli e descrizioni per ogni step
  const stepInfo = {
    1: {
      title: "Parliamo di te",
      description: "Inserisci le tue informazioni base per iniziare",
      icon: <Sparkles className="w-5 h-5 text-white" />,
    },
    2: {
      title: "La tua attività",
      description: "Quanto sei attivo durante la giornata?",
      icon: <Activity className="w-5 h-5 text-white" />,
    },
    3: {
      title: "Il tuo obiettivo",
      description: "Qual è il tuo obiettivo principale?",
      icon: <Target className="w-5 h-5 text-white" />,
    },
  };

  const validateStep = (currentStep: number) => {
    if (currentStep === 1) {
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
        return false;
      }
    } else if (currentStep === 2) {
      if (!formData.activityLevel) {
        toast({
          title: "Seleziona un livello",
          description: "Seleziona il tuo livello di attività",
          variant: "destructive",
        });
        return false;
      }
    } else if (currentStep === 3) {
      if (!formData.goal) {
        toast({
          title: "Seleziona un obiettivo",
          description: "Seleziona il tuo obiettivo per continuare",
          variant: "destructive",
        });
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep(step)) return;

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
    if (!validateStep(step)) return;

    console.log("🚀 Inizio handleSubmit con dati:", formData);
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
      console.error("❌ Errore:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore. Riprova.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Render del contenuto in base allo step
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Nome
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Mario"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="surname" className="text-sm font-medium">
                  Cognome
                </Label>
                <Input
                  id="surname"
                  type="text"
                  placeholder="Rossi"
                  value={formData.surname}
                  onChange={(e) => updateField("surname", e.target.value)}
                  className="h-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="age" className="text-sm font-medium">
                  Età
                </Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="28"
                  value={formData.age}
                  onChange={(e) => updateField("age", e.target.value)}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height" className="text-sm font-medium">
                  Altezza (cm)
                </Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="175"
                  value={formData.height}
                  onChange={(e) => updateField("height", e.target.value)}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight" className="text-sm font-medium">
                  Peso (kg)
                </Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="70"
                  value={formData.weight}
                  onChange={(e) => updateField("weight", e.target.value)}
                  className="h-10"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Sesso</Label>
              <RadioGroup
                value={formData.gender}
                onValueChange={(value) => updateField("gender", value)}
                className="grid grid-cols-2 gap-3"
              >
                <div className="flex items-center space-x-2 border-2 border-border rounded-lg p-3 hover:border-primary transition-colors cursor-pointer">
                  <RadioGroupItem value="male" id="male" />
                  <Label
                    htmlFor="male"
                    className="cursor-pointer text-sm font-normal flex-1"
                  >
                    Maschio
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border-2 border-border rounded-lg p-3 hover:border-primary transition-colors cursor-pointer">
                  <RadioGroupItem value="female" id="female" />
                  <Label
                    htmlFor="female"
                    className="cursor-pointer text-sm font-normal flex-1"
                  >
                    Femmina
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <RadioGroup
              value={formData.activityLevel}
              onValueChange={(value) => updateField("activityLevel", value)}
              className="space-y-3"
            >
              <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary transition-colors cursor-pointer">
                <RadioGroupItem
                  value="sedentary"
                  id="sedentary"
                  className="mt-1"
                />
                <Label htmlFor="sedentary" className="cursor-pointer flex-1">
                  <div className="font-medium mb-1">Sedentario</div>
                  <div className="text-xs text-muted-foreground">
                    Poco o nessun esercizio, lavoro da scrivania
                  </div>
                </Label>
              </div>

              <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary transition-colors cursor-pointer">
                <RadioGroupItem value="light" id="light" className="mt-1" />
                <Label htmlFor="light" className="cursor-pointer flex-1">
                  <div className="font-medium mb-1">Leggermente attivo</div>
                  <div className="text-xs text-muted-foreground">
                    Esercizio leggero 1-3 giorni/settimana
                  </div>
                </Label>
              </div>

              <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary transition-colors cursor-pointer">
                <RadioGroupItem
                  value="moderate"
                  id="moderate"
                  className="mt-1"
                />
                <Label htmlFor="moderate" className="cursor-pointer flex-1">
                  <div className="font-medium mb-1">Moderatamente attivo</div>
                  <div className="text-xs text-muted-foreground">
                    Esercizio moderato 3-5 giorni/settimana
                  </div>
                </Label>
              </div>

              <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary transition-colors cursor-pointer">
                <RadioGroupItem value="active" id="active" className="mt-1" />
                <Label htmlFor="active" className="cursor-pointer flex-1">
                  <div className="font-medium mb-1">Molto attivo</div>
                  <div className="text-xs text-muted-foreground">
                    Esercizio intenso 6-7 giorni/settimana
                  </div>
                </Label>
              </div>

              <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary transition-colors cursor-pointer">
                <RadioGroupItem
                  value="extra-active"
                  id="extra-active"
                  className="mt-1"
                />
                <Label htmlFor="extra-active" className="cursor-pointer flex-1">
                  <div className="font-medium mb-1">Estremamente attivo</div>
                  <div className="text-xs text-muted-foreground">
                    Esercizio molto intenso quotidiano o lavoro fisico pesante
                  </div>
                </Label>
              </div>
            </RadioGroup>

            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <div className="flex items-start gap-3">
                <Activity className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium mb-1">
                    Perché è importante?
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Il livello di attività ci aiuta a calcolare con precisione
                    il tuo fabbisogno calorico giornaliero (TDEE) per
                    raggiungere i tuoi obiettivi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <RadioGroup
              value={formData.goal}
              onValueChange={(value) => updateField("goal", value)}
              className="space-y-3"
            >
              <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary transition-colors cursor-pointer">
                <RadioGroupItem
                  value="lose_1kg_week"
                  id="lose-weight"
                  className="mt-1"
                />
                <Label htmlFor="lose-weight" className="cursor-pointer flex-1">
                  <div className="font-medium mb-1">Perdere peso</div>
                  <div className="text-xs text-muted-foreground">
                    Deficit calorico per dimagrimento graduale e sostenibile
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
                  <div className="font-medium mb-1">Mantenere il peso</div>
                  <div className="text-xs text-muted-foreground">
                    Equilibrio calorico per mantenere il peso attuale
                  </div>
                </Label>
              </div>

              <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary transition-colors cursor-pointer">
                <RadioGroupItem
                  value="gain_1kg_week"
                  id="gain-weight"
                  className="mt-1"
                />
                <Label htmlFor="gain-weight" className="cursor-pointer flex-1">
                  <div className="font-medium mb-1">Aumentare la massa</div>
                  <div className="text-xs text-muted-foreground">
                    Surplus calorico per crescita muscolare e aumento di peso
                  </div>
                </Label>
              </div>
            </RadioGroup>

            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium mb-1">
                    Il tuo piano personalizzato
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Calcoleremo il tuo fabbisogno calorico ideale in base al tuo
                    obiettivo e creeremo un piano alimentare su misura.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-[600px] max-h-[90vh] flex flex-col gap-0 p-0"
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* Header fisso */}
        <div className="px-6 pt-6 pb-4 border-b">
          <DialogHeader className="space-y-3">
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                {stepInfo[step as keyof typeof stepInfo].icon}
              </div>
            </div>
            <DialogTitle className="text-center text-2xl">
              {stepInfo[step as keyof typeof stepInfo].title}
            </DialogTitle>
            <DialogDescription className="text-center">
              {stepInfo[step as keyof typeof stepInfo].description}
            </DialogDescription>
          </DialogHeader>

          {/* Progress Bar */}
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground text-center mt-2">
              Passaggio {step} di {totalSteps}
            </p>
          </div>
        </div>

        {/* Content scrollabile */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {renderStepContent()}
        </div>

        {/* Footer fisso con bottoni */}
        <div className="px-6 pb-6 pt-4 border-t bg-background">
          <div className="flex gap-3">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex-1 h-11"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Indietro
              </Button>
            )}

            {step < totalSteps ? (
              <Button onClick={handleNext} className="flex-1 h-11 ml-auto">
                Continua
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 h-11 ml-auto"
              >
                {isLoading ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                    Completamento...
                  </>
                ) : (
                  <>
                    Completa profilo
                    <Sparkles className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
