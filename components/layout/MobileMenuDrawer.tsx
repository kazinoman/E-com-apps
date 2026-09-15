import { X, User, LogOut, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/UserInfoContext';
import { PageUrls } from '@/constants/PageUrls';
import { ThemeToggle } from '../common/ThemeToggleButton';

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: { name: string; href: string }[];
}

export function MobileMenuDrawer({ isOpen, onClose, navLinks }: MobileMenuDrawerProps) {
  const { user } = useAuth();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[100] animate-in fade-in duration-300" 
          onClick={onClose} 
        />
      )}
      
      {/* Drawer Panel */}
      <div 
        className={cn(
          "fixed top-0 left-0 h-full w-[85%] max-w-[320px] bg-background z-[100] shadow-2xl transition-transform duration-300 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-border">
          <span className="text-2xl font-black tracking-tight text-foreground">Zaag</span>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button 
              onClick={onClose} 
              className="p-1.5 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground"
            >
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-6">
          <div className="px-6 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Menu
          </div>
          <ul className="flex flex-col">
            {navLinks.map((link, idx) => (
              <li key={idx}>
                <Link 
                  href={link.href} 
                  onClick={onClose} 
                  className="flex items-center justify-between px-6 py-3.5 text-[15px] font-medium text-foreground hover:bg-secondary/50 hover:text-primary transition-colors"
                >
                  {link.name}
                  <ChevronRight size={16} className="text-muted-foreground/50" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Footer / User actions */}
        <div className="p-6 border-t border-border bg-secondary/20">
          {user ? (
            <Link 
              href={PageUrls.profile} 
              onClick={onClose}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                {user.fullName.charAt(0)}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">{user.fullName}</span>
                <span className="text-xs text-muted-foreground hover:text-primary transition-colors">View Profile</span>
              </div>
            </Link>
          ) : (
            <div className="flex flex-col gap-3">
              <Link 
                href={PageUrls.login} 
                onClick={onClose} 
                className="w-full text-center bg-primary text-primary-foreground py-2.5 rounded-lg text-[15px] font-semibold shadow-sm hover:bg-primary/90 transition-all active:scale-[0.98]"
              >
                Sign In
              </Link>
              <Link 
                href={PageUrls.signup} 
                onClick={onClose} 
                className="w-full text-center bg-background border border-border text-foreground py-2.5 rounded-lg text-[15px] font-semibold hover:bg-secondary transition-all active:scale-[0.98]"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
