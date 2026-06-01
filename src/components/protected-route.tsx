import { useAuth } from "@/context/auth-context";
import { redirect } from "next/navigation";
import { Spinner } from "./ui/spinner";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  if (!user) {
    redirect("/login");
  }

  if (loading) {
    return (
      <div className="min-h-[100vh] flex justify-center items-center">
        <Spinner className="size-6" />
      </div>
    );
  }

  return children;
}
