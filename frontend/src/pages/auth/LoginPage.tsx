import { useState } from "react";
import { Link } from "react-router-dom";
import { validateLogin } from "@/features/auth/validation";
import { useLogin } from "@/features/auth/hooks";
import { Logo } from "@/shared/ui/Logo"

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    credentials?: string;
  }>({});

  const mutation = useLogin();

  const handleSubmit = () => {
    const validationErrors = validateLogin({ email, password });

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    mutation.mutate(
      { email, password },
      {
        onError: (error: any) => {
          const errors = error.response?.data?.detail;

          if (errors && typeof errors === "object") {
            setErrors(errors);
          }
        },
      }
    );
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">

      {/* BACKGROUND GRADIENT */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-indigo-50 to-blue-100" />

      {/* RADIAL DEPTH EFFECT */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(99,102,241,0.15),_transparent_40%)]" />

      {/* BACKGROUND BLUR GLOW */}
      <div className="absolute top-[-150px] right-[-150px] w-[400px] h-[400px] bg-indigo-300/40 rounded-full blur-3xl" />
      <div className="absolute bottom-[-150px] left-[-150px] w-[400px] h-[400px] bg-blue-300/40 rounded-full blur-3xl" />

      {/* WRAPPER CARD */}
      <div className="relative w-full max-w-5xl h-[600px] bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden flex">

        {/* LEFT PANEL */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-700 via-indigo-700 to-blue-900 text-white p-14 flex-col justify-between relative overflow-hidden">

          <div>
            <div className="mb-3">
              <Logo size={56} variant="transparent" />
            </div>

            <h1 className="text-4xl font-bold leading-tight mb-6">
              CloudStore
            </h1>

            <p className="text-lg text-blue-100 max-w-md">
              Securely upload, store and share your files anywhere.
            </p>
          </div>

          <p className="text-sm text-blue-200">
            © 2026 CloudStore.
          </p>

          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        </div>

        {/* RIGHT PANEL */}
        <div className="flex flex-1 items-center justify-center bg-white px-10">

          <div className="w-full max-w-sm space-y-6">

            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-slate-800">
                Welcome Back!
              </h2>
              <p className="text-sm text-slate-500">
                Sign in to access your storage
              </p>
            </div>

            <div className="space-y-4">

              {errors.credentials && (
                <div className="text-sm text-red-500">
                  {errors.credentials}
                </div>
              )}

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-slate-700">
                    Email
                  </label>
                  {errors.email && (
                    <span className="text-xs text-red-500">
                      {errors.email}
                    </span>
                  )}
                </div>

                <input
                  type="text"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({ ...prev, email: undefined, credentials: undefined }));
                  }}
                  placeholder="Enter your email"
                  className={`w-full px-3 py-2 border rounded-lg transition
                             ${errors.email
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-slate-300 focus:ring-indigo-500 focus:border-indigo-500"}
                             focus:outline-none focus:ring-2`}
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-slate-700">
                    Password
                  </label>
                  {errors.password && (
                    <span className="text-xs text-red-500">
                      {errors.password}
                    </span>
                  )}
                </div>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, password: undefined, credentials: undefined }));
                  }}
                  placeholder="Enter your password"
                  className={`w-full px-3 py-2 border rounded-lg transition
                             ${errors.password
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-slate-300 focus:ring-indigo-500 focus:border-indigo-500"}
                             focus:outline-none focus:ring-2`}
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={mutation.isPending}
                className="w-full py-2.5 bg-indigo-600 text-white rounded-lg
                           hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-[1px]
                           active:scale-[0.98]
                           transition font-semibold disabled:opacity-50"
              >
                {mutation.isPending ? "Signing in..." : "Sign In"}
              </button>

              <button
                className="w-full py-2.5 bg-white border border-slate-300 
                           text-slate-700 rounded-lg hover:bg-slate-50 
                           hover:border-slate-400 transition font-medium 
                           flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.72 1.22 9.22 3.61l6.85-6.85C35.91 2.43 30.39 0 24 0 14.61 0 6.27 5.38 2.22 13.26l7.98 6.19C12.02 13.33 17.55 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.1 24.5c0-1.63-.15-3.2-.43-4.71H24v9h12.4c-.53 2.87-2.14 5.31-4.56 6.94l7.06 5.49C43.78 37.17 46.1 31.35 46.1 24.5z" />
                  <path fill="#FBBC05" d="M10.2 28.45a14.5 14.5 0 010-8.9l-7.98-6.19A23.99 23.99 0 000 24c0 3.88.93 7.55 2.22 10.64l7.98-6.19z" />
                  <path fill="#34A853" d="M24 48c6.39 0 11.76-2.1 15.68-5.7l-7.06-5.49c-2.03 1.36-4.63 2.17-8.62 2.17-6.45 0-11.98-3.83-13.8-9.95l-7.98 6.19C6.27 42.62 14.61 48 24 48z" />
                </svg>
                Login with Google
              </button>

              <div className="flex justify-center text-sm text-slate-600">
                <span>Forgot password?</span>
                <button
                  className="ml-1 text-indigo-600 font-medium hover:underline hover:text-indigo-800 transition"
                >
                  Reset password
                </button>
              </div>

              <div className="flex justify-center text-sm text-slate-600">
                <span>Don’t have an account?</span>
                <Link to="/register" className="ml-1 text-indigo-600 font-medium hover:underline hover:text-indigo-800 transition">
                  Sign up
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}