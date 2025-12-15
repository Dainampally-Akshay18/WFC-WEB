import { useAuth } from '@hooks/useAuth';
import Button from '@components/ui/Button';
import { LogOut } from 'lucide-react';

const Dashboard = () => {
  const { admin, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {admin?.display_name}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Admin Dashboard - WFC Church Management
            </p>
          </div>

          <Button
            variant="outline"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Content */}
        <div className="bg-card rounded-lg border border-border p-8">
          <h2 className="text-xl font-semibold mb-4">
            🎉 Authentication System Complete!
          </h2>
          
          <div className="space-y-3 text-muted-foreground">
            <p>✅ Login functionality working</p>
            <p>✅ Protected routes implemented</p>
            <p>✅ Token management in place</p>
            <p>✅ Global auth state with Zustand</p>
            <p>✅ Axios interceptors configured</p>
          </div>

          <div className="mt-6 p-4 bg-muted rounded-md">
            <h3 className="font-semibold text-foreground mb-2">Admin Info:</h3>
            <p className="text-sm">Email: {admin?.email}</p>
            <p className="text-sm">Name: {admin?.display_name}</p>
            <p className="text-sm">Active: {admin?.is_active ? 'Yes' : 'No'}</p>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            Phase 3 will add the complete dashboard layout with sidebar and navigation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
