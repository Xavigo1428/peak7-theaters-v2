import React, { useState } from "react";
import { Lock, Mail, Film, ArrowRight, Eye, EyeOff } from "lucide-react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Por favor, introduce todas las credenciales.");
      return;
    }

    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess();
    } catch (error: any) {
      console.error("Firebase Login error:", error);
      if (error.code === "auth/invalid-credential" || error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        setErrorMsg("Credenciales inválidas. Por favor verifique el correo y la contraseña.");
      } else {
        setErrorMsg("Error de autenticación: " + (error.message || "Inténtalo de nuevo más tarde."));
      }
      setIsLoading(false);
    }
  };



  return (
    <div className="w-full max-w-md mx-auto my-12 md:my-20">
      <div
        id="login-form-container"
        className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-8 md:p-10 shadow-[0_15px_35px_rgba(0,0,0,0.5)] flex flex-col gap-6"
      >
        {/* Header decoration */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container shadow-lg">
            <Film className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold font-display text-on-surface tracking-tight mt-2">
            Peak7 Management Portal
          </h2>
          <p className="text-xs text-on-surface-variant font-sans max-w-xs">
            Authenticate to update schedules, catalog arrays, and theater showcases.
          </p>
        </div>

        {/* Message Indicator */}
        {errorMsg && (
          <div className="bg-red-950/40 border border-red-500/40 text-red-200 text-xs py-3 px-4 rounded-lg flex items-start gap-2">
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase font-display">
              Administrative Email
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant">
                <Mail className="w-4 h-4" />
              </span>
              <input
                id="login-email"
                type="email"
                placeholder="admin@peak7theaters.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/40 rounded-lg py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary-container focus:border-primary-container text-on-surface"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase font-display">
              Secure Keys / Password
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant">
                <Lock className="w-4 h-4" />
              </span>
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/40 rounded-lg py-2.5 pl-11 pr-11 text-sm focus:outline-none focus:ring-1 focus:ring-primary-container focus:border-primary-container text-on-surface"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-white transition-colors focus:outline-none cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-container text-on-primary-container py-3 rounded-lg text-sm font-bold tracking-wide hover:shadow-[0_0_15px_rgba(229,9,20,0.4)] hover:bg-red-700 active:scale-98 transition-all duration-300 flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? "Validating security..." : "Sign In"}
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}
