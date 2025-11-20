import React from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { MoreHorizontal, Edit3, Trash2, UtensilsCrossed } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';

interface FoodCardProps {
  id: string;
  name: string;
  calories: number;
  quantity: string;
  time: string;
  image?: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const FoodCard = ({
  id,
  name,
  calories,
  quantity,
  time,
  image,
  onEdit,
  onDelete
}: FoodCardProps) => {
  return (
    <Card className="p-4 floating-card transition-shadow">
      <div className="flex items-center space-x-3">
        {/* Immagine del pasto o placeholder */}
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0 shadow-sm">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
              <UtensilsCrossed className="w-8 h-8 text-primary/40" />
            </div>
          )}
        </div>

        {/* Info pasto */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground truncate">{name}</h3>
          <p className="text-sm text-muted-foreground">{quantity}</p>
          <p className="text-xs text-muted-foreground">{time}</p>
        </div>

        {/* Calorie */}
        <div className="text-right flex-shrink-0">
          <div className="text-lg font-semibold text-primary">{Math.round(calories)}</div>
          <div className="text-xs text-muted-foreground">kcal</div>
        </div>

        {/* Menu azioni */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit?.(id)}>
              <Edit3 className="mr-2 h-4 w-4" />
              Modifica
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete?.(id)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Elimina
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
};