import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Plus, BookOpen, BarChart3, User, Utensils, Settings } from 'lucide-react';
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
} from '@/components/ui/sidebar';


const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/add', icon: Plus, label: 'Aggiungi Cibo' },
  { to: '/diary', icon: BookOpen, label: 'Diario' },
  { to: '/stats', icon: BarChart3, label: 'Statistiche' },
  { to: '/profile', icon: User, label: 'Profilo' },
];

export function AppSidebar() {
  const location = useLocation();
  
  return (
    <Sidebar className="border-r border-border bg-card w-72">
      <SidebarHeader className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
            <Utensils className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">CalorieTracker</h2>
            <p className="text-sm text-muted-foreground">Monitora la tua dieta</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton 
                    asChild
                    isActive={location.pathname === item.to}
                  >
                    <Link to={item.to} className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarSeparator className="mb-4" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/settings" className="flex items-center space-x-3">
                <Settings className="w-5 h-5" />
                <span>Impostazioni</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}