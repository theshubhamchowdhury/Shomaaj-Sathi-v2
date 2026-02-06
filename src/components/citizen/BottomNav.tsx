import { NavLink } from 'react-router-dom';
import { Home, PlusCircle, ClipboardList, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/citizen', icon: Home, label: 'Home' },
  { to: '/citizen/register', icon: PlusCircle, label: 'Register' },
  { to: '/citizen/complaints', icon: ClipboardList, label: 'Complaints' },
  { to: '/citizen/profile', icon: User, label: 'Profile' },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/citizen'}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 touch-target',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={cn(
                    'h-6 w-6 transition-transform duration-200',
                    isActive && 'scale-110'
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className={cn('text-xs font-medium', isActive && 'font-semibold')}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
