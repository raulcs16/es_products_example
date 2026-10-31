import LoginComponent from "@/src/authentication/components/LoginComponent";
import { AuthContextProvider } from "@/src/authentication/context/AuthContext";

export default function LoginPage() {
  return (
    <main className="w-full h-full flex items-center justify-center">
      <AuthContextProvider user={null}>
        <LoginComponent></LoginComponent>
      </AuthContextProvider>
    </main>
  );
}
