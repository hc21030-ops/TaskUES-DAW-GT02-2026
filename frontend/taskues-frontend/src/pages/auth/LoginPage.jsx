import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/authService";
import { validators } from "../../utils/validators";
import { Card } from "@heroui/react";
import { useUsers } from "../../context/UsersContext";
import { Toast } from "../../components/common/Toast";

import {
  Mail,
  Lock,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { users } = useUsers();
  const [toast, setToast] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = "El email es requerido";
    } else if (!validators.email(email)) {
      newErrors.email = "Por favor ingresa un email válido";
    }
    if (!password) {
      newErrors.password = "La contraseña es requerida";
    } else if (!validators.password(password)) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { user, token } = await authService.login(
        { email, password },
        users,
      );

      login(user, token);

      setToast({
        message: `Bienvenido ${user.name}`,
        type: "success",
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (err) {
      setErrors({
        credentials: "Correo o contraseña incorrectos",
      });

      setToast({
        message: err.message || "Error al iniciar sesión",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-zinc-100">
      {" "}
      {/* Container */}{" "}
      <main className="flex items-center justify-center px-4 py-8 sm:py-12">
        {" "}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}{" "}
        {/* Card */}{" "}
        <Card className="w-full max-w-md p-6 sm:p-10 shadow-md">
          {" "}
          {/* Logo */}{" "}
          <section className="flex flex-col items-center">
            {" "}
            <div className="bg-blue-900 p-4 mb-2 rounded-2xl shadow-md">
              {" "}
              <CheckCircle2 size={40} className="text-white" />{" "}
            </div>{" "}
            <h2 className="mt-5 text-3xl sm:text-4xl font-bold text-blue-700">
              {" "}
              TaskUES{" "}
            </h2>{" "}
            <p className="mt-2 text-center text-sm sm:text-base text-zinc-600">
              {" "}
              Gestión de Tareas Estudiantiles{" "}
            </p>{" "}
          </section>{" "}
          <form onSubmit={handleSubmit} className="space-y-4">
            {" "}
            <Input
              label="Correo Electrónico"
              type="email"
              placeholder="example@ues.edu.sv"
              value={email}
              notNull="true"
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              icon={<Mail className="w-5 h-5" />}
            />{" "}
            <div className="mb-4">
              {" "}
              <label className="block text-sm font-semibold text-gray-700 mb-2 text-center sm:text-left">
                {" "}
                Contraseña <span className="text-red-500">*</span>{" "}
              </label>{" "}
              <div className="relative">
                {" "}
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />{" "}
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 text-black pr-10 py-2 border rounded-lg focus:outlinenone focus:ring-2 ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />{" "}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {" "}
                  {showPassword ? (
                    <EyeOff size={18} className="text-zinc-400" />
                  ) : (
                    <Eye size={18} className="text-zinc-400" />
                  )}{" "}
                </button>{" "}
              </div>{" "}
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}{" "}
            </div>{" "}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
            >
              {" "}
              Iniciar Sesión{" "}
            </Button>{" "}
          </form>{" "}
          {errors.credentials && (
            <p className="text-red-500 text-sm text-center mt-2">
              {errors.credentials}
            </p>
          )}
          {/* Divider */} <div className="my-8 border-t border-zinc-200"></div>{" "}
          {/* Register */}{" "}
          <p className="text-center text-sm sm:text-base text-zinc-500">
            {" "}
            ¿No tienes cuenta?{" "}
            <span
              className="font-semibold text-blue-600 cursor-pointer hover:underline"
              onClick={() => navigate("/register")}
            >
              {" "}
              Regístrate aquí{" "}
            </span>{" "}
          </p>{" "}
        </Card>{" "}
      </main>{" "}
    </div>
  );
};
