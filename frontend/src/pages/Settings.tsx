import { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Settings as SettingsIcon,
  Bell,
  Moon,
  Sun,
  Globe,
  Shield,
  Trash2,
  Download,
  LogOut,
  User,
  Mail,
  Database,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/use-toast";
import { useTheme } from "next-themes";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";

export const Settings = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  // State per le impostazioni
  const [notifications, setNotifications] = useState({
    mealReminders: true,
    weeklyReport: true,
    achievements: false,
  });
  const [language, setLanguage] = useState("it");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  // Handlers
  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    toast({
      title: "Impostazione aggiornata",
      description: "Le modifiche sono state salvate con successo",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Esportazione dati",
      description: "I tuoi dati verranno scaricati a breve...",
    });
    // Implementare logica di export
  };

  const handleDeleteAccount = () => {
    // Implementare logica eliminazione account
    toast({
      title: "Account eliminato",
      description: "Il tuo account è stato eliminato definitivamente",
      variant: "destructive",
    });
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logout effettuato",
      description: "Sei stato disconnesso con successo",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <SettingsIcon className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Impostazioni</h1>
      </div>

      {/* Account Info */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <User className="h-5 w-5" />
          Informazioni Account
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Email</span>
            </div>
            <span className="text-sm font-medium">{user?.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Nome</span>
            </div>
            <span className="text-sm font-medium">
              {user?.profile?.name || user?.name || "Non specificato"}
            </span>
          </div>
        </div>
      </Card>

      {/* Appearance */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          {theme === "dark" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
          Aspetto
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="theme" className="text-sm">
              Tema
            </Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Seleziona tema" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    Chiaro
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    Scuro
                  </div>
                </SelectItem>
                <SelectItem value="system">Sistema</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifiche
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="meal-reminders">Promemoria pasti</Label>
              <p className="text-sm text-muted-foreground">
                Ricevi promemoria per registrare i tuoi pasti
              </p>
            </div>
            <Switch
              id="meal-reminders"
              checked={notifications.mealReminders}
              onCheckedChange={() => handleNotificationChange("mealReminders")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="weekly-report">Report settimanale</Label>
              <p className="text-sm text-muted-foreground">
                Ricevi un riepilogo settimanale dei tuoi progressi
              </p>
            </div>
            <Switch
              id="weekly-report"
              checked={notifications.weeklyReport}
              onCheckedChange={() => handleNotificationChange("weeklyReport")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="achievements">Traguardi</Label>
              <p className="text-sm text-muted-foreground">
                Ricevi notifiche quando raggiungi un traguardo
              </p>
            </div>
            <Switch
              id="achievements"
              checked={notifications.achievements}
              onCheckedChange={() => handleNotificationChange("achievements")}
            />
          </div>
        </div>
      </Card>

      {/* Language & Region */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Lingua e Regione
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="language" className="text-sm">
              Lingua
            </Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Seleziona lingua" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="it">🇮🇹 Italiano</SelectItem>
                <SelectItem value="en">🇬🇧 English</SelectItem>
                <SelectItem value="es">🇪🇸 Español</SelectItem>
                <SelectItem value="fr">🇫🇷 Français</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Privacy & Security */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Privacy e Sicurezza
        </h2>
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleExportData}
          >
            <Download className="mr-2 h-4 w-4" />
            Esporta i miei dati
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start text-destructive hover:text-destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Elimina account
          </Button>
        </div>
      </Card>

      {/* Storage Info */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Database className="h-5 w-5" />
          Archiviazione
        </h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Pasti registrati</span>
            <span className="font-medium">45</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Immagini caricate</span>
            <span className="font-medium">32</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Spazio utilizzato</span>
            <span className="font-medium">12.4 MB</span>
          </div>
        </div>
      </Card>

      {/* Logout */}
      <Card className="p-6">
        <Button
          variant="outline"
          className="w-full justify-start text-destructive hover:text-destructive"
          onClick={() => setShowLogoutDialog(true)}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Disconnetti
        </Button>
      </Card>

      {/* App Version */}
      <div className="text-center text-sm text-muted-foreground pb-4">
        CalorieSnap AI v1.0.0
      </div>

      {/* Delete Account Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminare l'account?</AlertDialogTitle>
            <AlertDialogDescription>
              Questa azione è irreversibile. Tutti i tuoi dati, inclusi pasti,
              statistiche e immagini, verranno eliminati definitivamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Elimina definitivamente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Logout Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnettersi?</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler uscire dall'applicazione?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>
              Disconnetti
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
