import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { User, Settings, Target, Bell, HelpCircle, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Mario Rossi',
    email: 'mario.rossi@email.com',
    age: 32,
    height: 175,
    weight: 75,
    goal: 'Mantenimento',
    dailyCalories: 2000
  });

  const { toast } = useToast();

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profilo aggiornato",
      description: "Le tue informazioni sono state salvate con successo.",
    });
  };

  const menuItems = [
    { icon: Target, label: 'Obiettivi', action: () => {} },
    { icon: Bell, label: 'Notifiche', action: () => {} },
    { icon: Settings, label: 'Impostazioni', action: () => {} },
    { icon: HelpCircle, label: 'Aiuto', action: () => {} },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <User className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Profilo</h1>
      </div>

      {/* Profile Card */}
      <Card className="p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
              {profile.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{profile.name}</h2>
            <p className="text-muted-foreground">{profile.email}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {profile.age} anni • {profile.height}cm • {profile.weight}kg
            </p>
          </div>
          <Button 
            variant={isEditing ? "default" : "outline"}
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          >
            {isEditing ? 'Salva' : 'Modifica'}
          </Button>
        </div>

        {isEditing && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="age">Età</Label>
                <Input
                  id="age"
                  type="number"
                  value={profile.age}
                  onChange={(e) => setProfile({...profile, age: parseInt(e.target.value)})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="height">Altezza (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={profile.height}
                  onChange={(e) => setProfile({...profile, height: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={profile.weight}
                  onChange={(e) => setProfile({...profile, weight: parseInt(e.target.value)})}
                />
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="text-lg font-semibold text-primary">{profile.dailyCalories}</div>
          <div className="text-xs text-muted-foreground">Calorie/giorno</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-lg font-semibold text-energy">12</div>
          <div className="text-xs text-muted-foreground">Giorni attivi</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-lg font-semibold text-success">-2kg</div>
          <div className="text-xs text-muted-foreground">Questo mese</div>
        </Card>
      </div>

      {/* Menu Items */}
      <Card className="p-4">
        <h3 className="font-medium mb-4">Impostazioni</h3>
        <div className="space-y-1">
          {menuItems.map((item, index) => (
            <div key={item.label}>
              <Button 
                variant="ghost" 
                className="w-full justify-start h-12"
                onClick={item.action}
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.label}
              </Button>
              {index < menuItems.length - 1 && <Separator />}
            </div>
          ))}
        </div>
      </Card>

      {/* Goals Card */}
      <Card className="p-4 bg-gradient-to-r from-primary/10 to-energy/10 border-primary/20">
        <h3 className="font-medium mb-2">🎯 Il tuo obiettivo</h3>
        <p className="text-sm text-muted-foreground mb-3">
          Stai lavorando per: <strong>{profile.goal}</strong>
        </p>
        <Button size="sm" variant="outline">
          Cambia obiettivo
        </Button>
      </Card>

      {/* Logout */}
      <Card className="p-4">
        <Button variant="ghost" className="w-full text-destructive justify-start">
          <LogOut className="mr-3 h-4 w-4" />
          Disconnetti
        </Button>
      </Card>
    </div>
  );
};