import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  GraduationCap,
  CheckCircle2,
} from "lucide-react";
import { Card } from "../../components/common/Card";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { useUsers } from "../../context/UsersContext";
import { validators } from "../../utils/validators";
import { Toast } from "../../components/common/Toast";
export const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { users, setUsers } = useUsers();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = "El correo es requerido";
    } else if (!validators.email(email)) {
      newErrors.email = "Por favor ingresa un correo válido";
    }
    const isExisted = users.some(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );
    if (isExisted) {
      newErrors.email = "El correo ya está registrado";
    }
    if (!name) {
      newErrors.name = "El nombre es requerido";
    }
    if (!name) {
      newErrors.lastName = "El apellido es requerido";
    }
    if (!password) newErrors.password = "La contraseña es requerida.";
    if (!passwordConfirm) {
      newErrors.passwordConfirm = "Confirma tu contraseña.";
    } else if (password !== passwordConfirm) {
      newErrors.passwordConfirm = "Las contraseñas no coinciden.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!validateForm()) {
      return;
    }
    const newUser = {
      user_id: Math.max(...users.map((u) => u.user_id)) + 1,
      name: name,
      last_name: lastName,
      email: email,
      password_hash: "hashed",
      state: true,
      date_created: new Date().toISOString(),
      last_access: new Date().toISOString(),
    };
    users.push(newUser);
    setUsers(users);
    setToast({
      message: `¡Usuario registrado exitosamente!`,
      type: "success",
    });
    setTimeout(() => navigate("/login"), 500);
  };
  return (
    <div className="min-h-screen bg-zinc-100">
      {/* Container */}
      <main className="flex items-center justify-center px-4 py-8 sm:py-12">
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
        {/* Card */}
        <Card className="w-full max-w-md md:max-w-lvh p-6 sm:p-10 shadow-md">
          {/* ── Header móvil – solo visible en mobile ── */}
          <div
            className="flex flex-col items-center justify-center gap-3 py-10 px-6 mb-5"
            style={{
              background:
                "linear-gradient(145deg, #1a56db 0%, #1e40af 60%, #1e3a8a 100%)",
            }}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 size={30} color="white" strokeWidth={2} />
              <span className="text-white text-2xl font-bold tracking-tight">
                Task<span className="font-extrabold">UES</span>
              </span>
            </div>
          </div>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Crear Cuenta</h1>
          </div>
          <div className="flex flex-col gap-4">
            {/* Nombre y Apellido — stacked en mobile, lado a lado en md+ */}
            <div className="flex flex-col gap-4 md:flex-row">
              <Input
                label="Nombre"
                type="text"
                placeholder="Ingrese un nombre"
                icon={<User size={16} />}
                className="flex-1"
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
                value={name}
                notNull
              />
              <Input
                label="Apellido"
                type="text"
                placeholder="Ingrese un apellido"
                icon={<User size={16} />}
                className="flex-1"
                error={errors.lastName}
                notNull
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            {/* Correo */}
            <Input
              type="email"
              notNull
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Correo electrónico"
              type="email"
              placeholder="Ingrese un correo electrónico"
              icon={<Mail size={16} />}
              error={errors.email}
            />
            <div className="mb-4">
              <label
                className="block text-sm font-semibold 
                                text-gray-700 mb-2 text-center sm:text-left"
              >
                Contraseña <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  className={`w-full pl-10 pr-10 text-black py-2 border rounded-lg focus:outlinenone focus:ring-2 ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  label="Contraseña"
                  type={showPassword ? "text" : "password"}
                  placeholder="Crea una contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock size={16} />}
                  error={errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff size={18} className="text-zinc-400" />
                  ) : (
                    <Eye size={18} className="text-zinc-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-semibold text-gray-700 mb-2 text-center
sm:text-left"
              >
                Confirmar contraseña <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  label="Confirmar Contraseña"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirma tu contraseña"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  icon={<Lock size={16} />}
                  error={errors.passwordConfirm}
                  className={`w-full pl-10 pr-10 text-black py-2 border rounded-lg focus:outlinenone focus:ring-2 ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? (
                    <EyeOff size={18} className="text-zinc-400" />
                  ) : (
                    <Eye size={18} className="text-zinc-400" />
                  )}
                </button>
              </div>
              {errors.passwordConfirm && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.passwordConfirm}
                </p>
              )}
            </div>
            {/* Botón */}
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleSubmit}
              className="mt-2 flex items-center justify-center gap-2"
            >
              Crear Cuenta
              <ArrowRight size={18} />
            </Button>
          </div>
          {/* Divider */}
          <div className="my-8 border-t border-zinc-200"></div>
          {/* Register */}
          <p className="text-center text-sm sm:text-base text-zinc-500">
            ¿Ya tienes una cuenta?{" "}
            <span
              className="font-semibold text-blue-600 cursor-pointer hover:underline"
              onClick={() => navigate("/login")}
            >
              Inica sesión aquí
            </span>
          </p>
        </Card>
      </main>
    </div>
  );
};
