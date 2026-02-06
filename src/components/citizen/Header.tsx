import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  title?: string;
  showGreeting?: boolean;
}

export function Header({ title, showGreeting = false }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="gradient-header text-primary-foreground px-4 py-6 pb-8 rounded-b-3xl">
      <div className="max-w-lg mx-auto">
        {showGreeting && user ? (
          <>
            <p className="text-primary-foreground/80 text-sm">Welcome back,</p>
            <h1 className="text-2xl font-bold mt-1">{user.name}</h1>
            <p className="text-primary-foreground/70 text-sm mt-1">
              Ward {user.wardNumber} • Halisahar
            </p>
          </>
        ) : (
          <h1 className="text-xl font-semibold">{title}</h1>
        )}
      </div>
    </header>
  );
}
