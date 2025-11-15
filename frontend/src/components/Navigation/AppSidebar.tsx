import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Plus, BookOpen, BarChart3, User, Utensils, Settings, LogOut } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from '../../components/ui/sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/use-toast';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/add', icon: Plus, label: 'Aggiungi Cibo' },
  { to: '/diary', icon: BookOpen, label: 'Diario' },
  { to: '/stats', icon: BarChart3, label: 'Statistiche' },
  { to: '/profile', icon: User, label: 'Profilo' },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Disconnesso",
      description: "Sei stato disconnesso con successo",
    });
    navigate('/login');
  };

  return (
    <Sidebar collapsible="icon" className="transition-all duration-300 ease-in-out">
      <SidebarHeader className="p-4 transition-all duration-300">
        <Link to="/" className="flex items-center gap-3 group/logo w-full min-h-[48px]">
          {/* Logo con transizione - centrato quando collassata */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shrink-0 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group-data-[collapsible=icon]/sidebar-wrapper:mx-auto">
            <Utensils className="w-6 h-6 text-white" />
          </div>

          {/* Testo con fade out - nascosto quando sidebar è collapsed */}
          <div className="flex flex-col overflow-hidden transition-all duration-300 group-data-[collapsible=icon]/sidebar-wrapper:w-0 group-data-[collapsible=icon]/sidebar-wrapper:opacity-0">
            <h2 className="text-xl font-bold text-foreground whitespace-nowrap">CalorieTracker</h2>
            <p className="text-sm text-muted-foreground whitespace-nowrap">Monitora la tua dieta</p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2 px-2 group-data-[collapsible=icon]/sidebar-wrapper:px-0 group-data-[collapsible=icon]/sidebar-wrapper:space-y-3">
              {navItems.map((item) => (
                <SidebarMenuItem
                  key={item.to}
                  className="group-data-[collapsible=icon]/sidebar-wrapper:flex group-data-[collapsible=icon]/sidebar-wrapper:justify-center"
                >
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.to}
                    tooltip={item.label}
                    className="group-data-[collapsible=icon]/sidebar-wrapper:h-12 group-data-[collapsible=icon]/sidebar-wrapper:w-12 group-data-[collapsible=icon]/sidebar-wrapper:justify-center group-data-[collapsible=icon]/sidebar-wrapper:p-0"
                  >
                    <Link to={item.to} className="flex items-center gap-3">
                      <item.icon className="shrink-0 w-5 h-5 group-data-[collapsible=icon]/sidebar-wrapper:w-6 group-data-[collapsible=icon]/sidebar-wrapper:h-6" />
                      <span className="whitespace-nowrap group-data-[collapsible=icon]/sidebar-wrapper:hidden">
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarSeparator className="mb-2 group-data-[collapsible=icon]/sidebar-wrapper:hidden" />
        <SidebarMenu className="px-2 group-data-[collapsible=icon]/sidebar-wrapper:px-0">
          <SidebarMenuItem className="group-data-[collapsible=icon]/sidebar-wrapper:flex group-data-[collapsible=icon]/sidebar-wrapper:justify-center">
            <SidebarMenuButton
              asChild
              tooltip="Impostazioni"
              className="group-data-[collapsible=icon]/sidebar-wrapper:h-12 group-data-[collapsible=icon]/sidebar-wrapper:w-12 group-data-[collapsible=icon]/sidebar-wrapper:justify-center group-data-[collapsible=icon]/sidebar-wrapper:p-0"
            >
              <Link to="/settings" className="flex items-center gap-3">
                <Settings className="shrink-0 w-5 h-5 group-data-[collapsible=icon]/sidebar-wrapper:w-6 group-data-[collapsible=icon]/sidebar-wrapper:h-6" />
                <span className="whitespace-nowrap group-data-[collapsible=icon]/sidebar-wrapper:hidden">
                  Impostazioni
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className="group-data-[collapsible=icon]/sidebar-wrapper:flex group-data-[collapsible=icon]/sidebar-wrapper:justify-center">
            <SidebarMenuButton
              tooltip="Esci"
              onClick={handleLogout}
              className="group-data-[collapsible=icon]/sidebar-wrapper:h-12 group-data-[collapsible=icon]/sidebar-wrapper:w-12 group-data-[collapsible=icon]/sidebar-wrapper:justify-center group-data-[collapsible=icon]/sidebar-wrapper:p-0"
            >
              <LogOut className="shrink-0 w-5 h-5 group-data-[collapsible=icon]/sidebar-wrapper:w-6 group-data-[collapsible=icon]/sidebar-wrapper:h-6" />
              <span className="whitespace-nowrap group-data-[collapsible=icon]/sidebar-wrapper:hidden">
                Esci
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}