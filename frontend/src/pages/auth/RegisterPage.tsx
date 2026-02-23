import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { register } from "@/features/auth/api";
import { validateRegister } from "@/features/auth/validation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<{
    email?: string;
    username?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: () => {
      navigate("/login");
    },
  });

  const handleSubmit = () => {
    const validationErrors = validateRegister({
      email,
      username,
      password,
      confirmPassword,
    });

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    mutation.mutate({ email, username, password });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">

      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-indigo-50 to-blue-100" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.15),_transparent_40%)]" />

      <div className="relative w-full max-w-5xl h-[650px] bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden flex">

        {/* LEFT PANEL */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-700 via-indigo-700 to-blue-900 text-white p-14 flex-col justify-between relative overflow-hidden">
          <div>
            <h1 className="text-4xl font-bold mb-6">
              Join Cloud Storage
            </h1>
            <p className="text-lg text-blue-100 max-w-md">
              Create your account and start storing your files securely.
            </p>
          </div>
          <p className="text-sm text-blue-200">
            © 2026 Cloud Storage.
          </p>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex flex-1 items-center justify-center bg-white px-10">
          <div className="w-full max-w-sm space-y-6">

            <div>
              <h2 className="text-2xl font-semibold text-slate-800">
                Create Account
              </h2>
            </div>

            <div className="space-y-4">

              {/* EMAIL */}
              <div>
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
                    setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  placeholder="Enter your email"
                  className={`w-full px-3 py-2 border rounded-lg transition
                    ${errors.email
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-slate-300 focus:ring-indigo-500 focus:border-indigo-500"}
                    focus:outline-none focus:ring-2`}
                />
              </div>

              {/* USERNAME */}
              <div>
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-slate-700">
                    Username
                  </label>
                  {errors.username && (
                    <span className="text-xs text-red-500">
                      {errors.username}
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setErrors((prev) => ({ ...prev, username: undefined }));
                  }}
                  placeholder="Choose a username"
                  className={`w-full px-3 py-2 border rounded-lg transition
                    ${errors.username
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-slate-300 focus:ring-indigo-500 focus:border-indigo-500"}
                    focus:outline-none focus:ring-2`}
                />
              </div>

              {/* PASSWORD */}
              <div>
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
                    setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  placeholder="Create a password"
                  className={`w-full px-3 py-2 border rounded-lg transition
                    ${errors.password
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-slate-300 focus:ring-indigo-500 focus:border-indigo-500"}
                    focus:outline-none focus:ring-2`}
                />
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-slate-700">
                    Confirm Password
                  </label>
                  {errors.confirmPassword && (
                    <span className="text-xs text-red-500">
                      {errors.confirmPassword}
                    </span>
                  )}
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                  }}
                  placeholder="Repeat your password"
                  className={`w-full px-3 py-2 border rounded-lg transition
                    ${errors.confirmPassword
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-slate-300 focus:ring-indigo-500 focus:border-indigo-500"}
                    focus:outline-none focus:ring-2`}
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={mutation.isPending}
                className="w-full py-2.5 bg-indigo-600 text-white rounded-lg
                           hover:bg-indigo-700 transition font-semibold disabled:opacity-50"
              >
                {mutation.isPending ? "Creating..." : "Create Account"}
              </button>

              <div className="flex justify-center text-sm text-slate-600">
                <span>Already have an account?</span>
                <Link
                  to="/login"
                  className="ml-1 text-indigo-600 font-medium hover:underline"
                >
                  Sign in
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}