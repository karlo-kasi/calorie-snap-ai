import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Plus, BookOpen, BarChart3, User } from 'lucide-react';
import { cn } from '../../lib/utils';

const NavItem = ({ to, icon: Icon, label, isActive }: {
  to: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
}) => (
  <Link 
    to={to} 
    className={cn(
      "flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-300",
      isActive 
        ? "text-primary bg-primary/10 scale-110" 
        : "text-muted-foreground hover:text-primary hover:bg-primary/5"
    )}
  >
    <Icon size={24} />
    <span className="text-xs mt-1 font-medium">{label}</span>
  </Link>
);

export const BottomNav = () => {
  const location = useLocation();
  
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/add', icon: Plus, label: 'Aggiungi' },
    { to: '/diary', icon: BookOpen, label: 'Diario' },
    { to: '/stats', icon: BarChart3, label: 'Statistiche' },
    { to: '/profile', icon: User, label: 'Profilo' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-xl border-t border-border z-50">
      <div className="flex justify-around items-center py-2 px-2 max-w-lg mx-auto">
        {navItems.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            isActive={location.pathname === item.to}
          />
        ))}
      </div>
    </nav>
  );
};