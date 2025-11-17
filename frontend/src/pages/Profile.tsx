import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Separator } from "../components/ui/separator";
import { User, Settings, Target, Bell, HelpCircle, LogOut } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { useAuth } from "../contexts/AuthContext";

export const Profile = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name,
    age: user.profile?.age,
    height: user.profile?.height,
    weight: user.profile?.weight,
    goal: user.profile?.goal,
    dailyCalories: user.profile?.dailyCalories,
  });

  const { toast } = useToast();

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profilo aggiornato",
      description: "Le tue informazioni sono state salvate con successo.",
    });
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Disconnesso",
      description: "Sei stato disconnesso con successo",
    });
    navigate("/login");
  };

  const menuItems = [
    { icon: Target, label: "Obiettivi", action: () => {} },
    { icon: Bell, label: "Notifiche", action: () => {} },
    { icon: Settings, label: "Impostazioni", action: () => {} },
    { icon: HelpCircle, label: "Aiuto", action: () => {} },
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
        {/* Header con Avatar e Bottone */}
        <div className="flex items-center justify-between md:justify-start gap-4 md:gap-6 mb-6">
          <Avatar className="h-20 w-20 md:h-24 md:w-24 shrink-0">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback className="text-lg md:text-xl font-semibold bg-primary/10 text-primary">
              {profile.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          {/* Nome e Info visibili solo da md in su */}
          <div className="hidden md:flex flex-1 flex-col gap-3">
            <h2 className="text-2xl font-bold">{profile.name}</h2>
            <div className="flex gap-6">
              <div>
                <p className="text-xs text-muted-foreground">Età</p>
                <p className="text-lg font-semibold">{profile.age}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Altezza</p>
                <p className="text-lg font-semibold">{profile.height} cm</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Peso</p>
                <p className="text-lg font-semibold">{profile.weight} kg</p>
              </div>
            </div>
          </div>

          <Button
            variant={isEditing ? "default" : "outline"}
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className="shrink-0"
          >
            {isEditing ? "Salva" : "Modifica"}
          </Button>
        </div>

        {/* Info profilo sotto - visibile solo su mobile */}
        <div className="space-y-3 md:hidden">
          <h2 className="text-2xl font-bold">{profile.name}</h2>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Età</p>
              <p className="text-lg font-semibold">{profile.age}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Altezza</p>
              <p className="text-lg font-semibold">{profile.height} cm</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Peso</p>
              <p className="text-lg font-semibold">{profile.weight} kg</p>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="age">Età</Label>
                <Input
                  id="age"
                  type="number"
                  value={profile.age}
                  onChange={(e) =>
                    setProfile({ ...profile, age: parseInt(e.target.value) })
                  }
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
                  onChange={(e) =>
                    setProfile({ ...profile, height: parseInt(e.target.value) })
                  }
                />
              </div>
              <div>
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={profile.weight}
                  onChange={(e) =>
                    setProfile({ ...profile, weight: parseInt(e.target.value) })
                  }
                />
              </div>
            </div>
          </div>
        )}
      </Card>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Goals Card */}
        <Card className="p-6 bg-gradient-to-r from-primary/10 to-energy/10 border-primary/20 flex-1">
          <h3 className="font-semibold mb-3 text-lg">🎯 Il tuo obiettivo</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Stai lavorando per:{" "}
            <strong className="text-foreground">{profile.goal}</strong>
          </p>
          <Button size="sm" variant="outline">
            Cambia obiettivo
          </Button>
        </Card>

        {/* Stats Summary */}
        <div className="flex flex-col gap-4 flex-1">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {profile.dailyCalories} kcal
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Calorie/giorno
            </div>
          </Card>
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 text-center">
              <div className="text-xl font-bold text-energy">12</div>
              <div className="text-xs text-muted-foreground mt-1">
                Giorni attivi
              </div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-xl font-bold text-success">-2kg</div>
              <div className="text-xs text-muted-foreground mt-1">
                Questo mese
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      {/*<Card className="p-4">
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
      </Card>*/}

      {/* Logout */}
      <Card className="p-4">
        <Button
          variant="ghost"
          className="w-full text-destructive justify-start"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-4 w-4" />
          Disconnetti
        </Button>
      </Card>
    </div>
  );
};
