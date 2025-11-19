import React from "react";
import { BottomNav } from "../components/Navigation/BottomNav";
import { AppSidebar } from "../components/Navigation/AppSidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "../components/ui/sidebar";
import { useIsMobile } from "../hooks/use-mobile";
import { Menu, User } from "lucide-react";
import { ThemeToggle } from "../components/ui/theme-toggle";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <main className="pb-20 px-4 pt-4 max-w-lg mx-auto">{children}</main>
        <BottomNav />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="h-screen flex w-full bg-gradient-to-br from-background via-background to-primary/5">
        <AppSidebar />
        <SidebarInset className="flex flex-col h-screen w-full">
          <header className="sticky top-0 z-10 h-16 flex items-center px-6 bg-card border-b border-border">
            <SidebarTrigger className="h-8 w-8 p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md transition-colors">
              <Menu className="w-4 h-4" />
            </SidebarTrigger>
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <Link to="/profile">
                  <User className="w-4 h-4" />
                </Link>
              </Button>
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 overflow-y-auto gap-4 p-6 bg-[hsl(var(--main-background))]">
            <div className="max-w-6xl mx-auto w-full">{children}</div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
