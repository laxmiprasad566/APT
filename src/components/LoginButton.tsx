import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, LogOut } from "lucide-react";

export const LoginButton = () => {
    const { user, login, logout } = useAuth();

    if (user) {
        return (
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    {user.avatar_url && (
                        <img src={user.avatar_url} alt={user.name} className="w-8 h-8 rounded-full" />
                    )}
                    <span className="text-sm font-medium hidden md:inline">{user.name}</span>
                </div>
                <Button variant="outline" size="sm" onClick={logout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                </Button>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <Button onClick={login} className="bg-primary text-primary-foreground hover:bg-primary/90">
                <LogIn className="w-4 h-4 mr-2" />
                Login with Google
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.href = 'http://localhost:3000/auth/dev'}
                className="text-xs text-muted-foreground"
            >
                Dev Bypass
            </Button>
        </div>
    );
};
