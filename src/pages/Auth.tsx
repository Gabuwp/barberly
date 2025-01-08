import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { AuthError, AuthApiError } from "@supabase/supabase-js";

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/admin");
        toast({
          title: "Bem-vindo!",
          description: "Login realizado com sucesso.",
        });
      }
      if (event === "SIGNED_OUT") {
        setErrorMessage(""); // Clear errors on sign out
      }
      if (event === "USER_UPDATED") {
        const { error } = await supabase.auth.getSession();
        if (error) {
          setErrorMessage(getErrorMessage(error));
        } else {
          setErrorMessage(""); // Clear errors on successful user update
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const getErrorMessage = (error: AuthError) => {
    if (error instanceof AuthApiError) {
      switch (error.code) {
        case 'invalid_credentials':
          return 'Email ou senha inválidos. Por favor, verifique suas credenciais e tente novamente.';
        case 'email_not_confirmed':
          return 'Por favor, verifique seu email antes de fazer login.';
        case 'user_not_found':
          return 'Nenhum usuário encontrado com essas credenciais.';
        case 'invalid_grant':
          return 'Credenciais de login inválidas.';
        default:
          return error.message;
      }
    }
    return error.message;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Área Administrativa
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Faça login para gerenciar os estilos em alta
          </p>
        </div>
        <div className="mt-8 bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
          {errorMessage && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          <SupabaseAuth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme="light"
            providers={[]}
          />
        </div>
      </div>
    </div>
  );
}