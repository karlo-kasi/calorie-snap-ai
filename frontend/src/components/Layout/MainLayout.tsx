import React from 'react';
import { BottomNav } from '../Navigation/BottomNav';
import { AppSidebar } from '../Navigation/AppSidebar';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, User } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <header className="flex h-14 items-center justify-between px-4 border-b border-border bg-card/50 backdrop-blur-sm">
          <h1 className="text-lg font-semibold text-primary">CalorieTracker</h1>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="icon">
              <Link to="/profile">
                <User className="w-5 h-5" />
              </Link>
            </Button>
            <ThemeToggle />
          </div>
        </header>
        <main className="pb-20 px-4 pt-4 max-w-lg mx-auto">
          {children}
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-background to-primary/5">
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-card/50 backdrop-blur-sm px-4">
            <SidebarTrigger className="p-2 hover:bg-primary/10 rounded-lg transition-colors">
              <Menu className="w-5 h-5" />
            </SidebarTrigger>
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="icon">
                <Link to="/profile">
                  <User className="w-5 h-5" />
                </Link>
              </Button>
              <ThemeToggle />
            </div>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-6">
            <div className="max-w-6xl mx-auto w-full">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};