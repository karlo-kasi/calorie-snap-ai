import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Trash2, Loader2 } from 'lucide-react';
import type { Meal } from '../../types/meal.types';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { deleteMeal } from '../../services/api/meal.service';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/use-toast';

interface MealDetailModalProps {
  meal: Meal | null;
  open: boolean;
  onClose: () => void;
}

export const MealDetailModal = ({ meal, open, onClose }: MealDetailModalProps) => {
  const { token, refreshMeals } = useAuth();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!meal) return null;

  const confidenceBadgeVariant = {
    high: 'default' as const,
    medium: 'secondary' as const,
    low: 'outline' as const,
  };

  const confidenceLabel = {
    high: 'Alta',
    medium: 'Media',
    low: 'Bassa',
  };

  const handleDelete = async () => {
    if (!token || !meal._id) return;

    try {
      setIsDeleting(true);
      await deleteMeal(token, meal._id);

      toast({
        title: 'Pasto eliminato',
        description: 'Il pasto è stato eliminato con successo',
      });

      // Ricarica i pasti e chiudi la modale
      await refreshMeals();
      onClose();
    } catch (error) {
      toast({
        title: 'Errore',
        description: 'Impossibile eliminare il pasto. Riprova.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{meal.dishName}</DialogTitle>
          <DialogDescription>
            {format(new Date(meal.date), "EEEE d MMMM 'alle' HH:mm", { locale: it })}
          </DialogDescription>
        </DialogHeader>

        {/* Immagine se disponibile */}
        {meal.imageBase64 && (
          <div className="rounded-lg overflow-hidden shadow-lg border border-border">
            <img
              src={`data:image/jpeg;base64,${meal.imageBase64}`}
              alt={meal.dishName}
              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* Riepilogo Nutrizionale */}
        <Card className="p-4 bg-gradient-to-r from-primary/10 to-energy/10">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-3xl font-bold text-primary">
                {Math.round(meal.totalCalories)}
              </div>
              <div className="text-sm text-muted-foreground">Calorie totali</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-foreground">
                {meal.totalWeight}g
              </div>
              <div className="text-sm text-muted-foreground">Peso totale</div>
            </div>
          </div>
        </Card>

        {/* Macronutrienti */}
        <div>
          <h3 className="font-semibold mb-3">Macronutrienti</h3>
          <div className="grid grid-cols-3 gap-3">
            <Card className="p-3 text-center">
              <div className="text-xl font-bold text-blue-600">
                {Math.round(meal.totalMacros.proteins)}g
              </div>
              <div className="text-xs text-muted-foreground">Proteine</div>
            </Card>
            <Card className="p-3 text-center">
              <div className="text-xl font-bold text-amber-600">
                {Math.round(meal.totalMacros.carbohydrates)}g
              </div>
              <div className="text-xs text-muted-foreground">Carboidrati</div>
            </Card>
            <Card className="p-3 text-center">
              <div className="text-xl font-bold text-orange-600">
                {Math.round(meal.totalMacros.fats)}g
              </div>
              <div className="text-xs text-muted-foreground">Grassi</div>
            </Card>
          </div>
        </div>

        {/* Ingredienti */}
        <div>
          <h3 className="font-semibold mb-3">Ingredienti</h3>
          <div className="space-y-2">
            {meal.ingredients.map((ingredient, index) => (
              <Card key={index} className="p-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium">{ingredient.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {ingredient.quantity}g
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-primary">
                      {Math.round(ingredient.calories)} kcal
                    </div>
                    <div className="text-xs text-muted-foreground space-x-2">
                      <span>P: {Math.round(ingredient.macros.proteins)}g</span>
                      <span>C: {Math.round(ingredient.macros.carbohydrates)}g</span>
                      <span>G: {Math.round(ingredient.macros.fats)}g</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Note di preparazione */}
        {meal.preparationNotes && (
          <div>
            <h3 className="font-semibold mb-2">Note di preparazione</h3>
            <Card className="p-3">
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {meal.preparationNotes}
              </p>
            </Card>
          </div>
        )}

        {/* Confidenza AI */}
        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-sm text-muted-foreground">
            Confidenza analisi AI
          </span>
          <Badge variant={confidenceBadgeVariant[meal.confidence]}>
            {confidenceLabel[meal.confidence]}
          </Badge>
        </div>

        {/* Footer con bottone elimina */}
        <DialogFooter className="mt-4">
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-full sm:w-auto"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Eliminazione...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Elimina pasto
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
