//hooks
import { useState, useEffect } from 'react';
//components
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
//icons
import { Apple, Mail, Lock, User, ArrowRight, Sparkles} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import heroFood from '../assets/hero-food.jpg';

export const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect se già autenticato
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent, type: 'login' | 'register') => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (type === 'login') {
        await login(loginEmail, loginPassword);
        toast({
          title: "Accesso effettuato!",
          description: "Benvenuto di nuovo!",
        });
        navigate('/', { replace: true });
      } else {
        await register(registerName, registerEmail, registerPassword);
        toast({
          title: "Account creato!",
          description: "Il tuo account è stato creato con successo!",
        });
        navigate('/', { replace: true });
      }
    } catch (error) {
      toast({
        title: "Errore",
        description: type === 'login'
          ? "Email o password non corretti"
          : "Errore durante la registrazione. Riprova.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex overflow-hidden">
      {/* Left Side - Image with Logo & Slogan */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Diagonal clip */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroFood})`,
            clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0% 100%)',
          }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-accent/90" />
        </div>

        {/* Content over image */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-12 text-white">
          {/* Logo AI-powered style Gemini */}
          <div className="relative flex items-center justify-center w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-sm mb-8 shadow-2xl">
            <Apple className="w-12 h-12 text-white" />
            {/* Stellina animata stile AI */}
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-6 h-6 text-white animate-pulse" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 text-center">
            CalorieSnap AI
          </h1>
          <p className="text-xl text-white/90 text-center max-w-md">
            Analisi nutrizionale intelligente con AI
          </p>

          {/* Features cards */}
          <div className="mt-16 flex gap-8">
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-[140px]">
              <Sparkles className="w-8 h-8 text-white mx-auto mb-2" />
              <div className="text-sm text-white/90">Analisi foto</div>
            </div>
            <div className="w-px bg-white/30" />
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-[140px]">
              <Sparkles className="w-8 h-8 text-white mx-auto mb-2" />
              <div className="text-sm text-white/90">AI powered</div>
            </div>
            <div className="w-px bg-white/30" />
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-[140px]">
              <Sparkles className="w-8 h-8 text-white mx-auto mb-2" />
              <div className="text-sm text-white/90">Tracciamento</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-background px-6 sm:px-12">
        <div className="w-full max-w-md border-2 rounded-2xl p-6 shadow-xl bg-card">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-6">
            <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 mb-3 shadow-lg">
              <Apple className="w-7 h-7 text-white" />
              {/* Stellina animata stile AI */}
              <div className="absolute -top-1 -right-1">
                <Sparkles className="w-4 h-4 text-white animate-pulse" />
              </div>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              CalorieSnap AI
            </h1>
            <p className="text-muted-foreground text-xs mt-1">
              Analisi nutrizionale intelligente con AI
            </p>
          </div>

          {/* Welcome message */}
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-1">Benvenuto</h2>
            <p className="text-muted-foreground text-xs">
              Accedi o crea un account per iniziare
            </p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-3">
              <TabsTrigger value="login">Accedi</TabsTrigger>
              <TabsTrigger value="register">Registrati</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <form onSubmit={(e) => handleSubmit(e, 'login')} className="space-y-2.5">
                <div className="space-y-1.5">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="text"
                      placeholder="nome@esempio.com"
                      className="pl-10"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="login-password">Password</Label>
                    <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                      Dimenticata?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-10 text-sm group"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                      Accesso in corso...
                    </>
                  ) : (
                    <>
                      Accedi
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register">
              <form onSubmit={(e) => handleSubmit(e, 'register')} className="space-y-2.5">
                <div className="space-y-1.5">
                  <Label htmlFor="register-name">Nome completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Mario Rossi"
                      className="pl-10"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="register-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="nome@esempio.com"
                      className="pl-10"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="register-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-10 text-sm group"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                      Creazione account...
                    </>
                  ) : (
                    <>
                      Crea account
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Creando un account accetti i nostri{' '}
                  <Link to="/terms" className="text-primary hover:underline">
                    Termini di servizio
                  </Link>{' '}
                  e la{' '}
                  <Link to="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </form>
            </TabsContent>
          </Tabs>

          {/* Divider 
          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Oppure continua con
              </span>
            </div>
          </div>*/}

          {/* Social Login 
          <div className="grid grid-cols-2 gap-2.5">
            <Button variant="outline" className="w-full h-9 text-sm" type="button">
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>
            <Button variant="outline" className="w-full h-9 text-sm" type="button">
              <Apple className="mr-2 h-4 w-4" />
              Apple
            </Button>
          </div>*/}

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground mt-3">
            Problemi di accesso?{' '}
            <Link to="/support" className="text-primary hover:underline font-medium">
              Contatta il supporto
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};