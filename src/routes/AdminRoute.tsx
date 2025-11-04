import { Navigate } from "react-router-dom";
import { useUserProfile } from "@/hooks/useUserProfile";
import ProtectedRoute from "@/routes/ProtectedRoute";

export default function AdminRoute({ children }: { children: JSX.Element }) {
  return (
    <ProtectedRoute>
      <AdminOnly>{children}</AdminOnly>
    </ProtectedRoute>
  );
}

function AdminOnly({ children }: { children: JSX.Element }) {
  const { data: profile, isLoading } = useUserProfile();

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <span className="animate-pulse text-sm text-zinc-500">Carregando...</span>
      </div>
    );
  }

  if (profile?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
