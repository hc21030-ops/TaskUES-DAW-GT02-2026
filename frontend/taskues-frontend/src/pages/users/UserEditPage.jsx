import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ChevronDown,
  Calendar,
  Tag,
  User,
  Mail,
  AlignLeft,
  FileText,
  ShieldCheck,
  Save,
} from "lucide-react";
import { MainLayout } from "../../components/layout/MainLayout";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { MOCK_USERS } from "../../utils/constants";
import { validators } from "../../utils/validators";
import { Toast } from "../../components/common/Toast";
import { useUsers } from "../../context/UsersContext";
export const UserEditPage = () => {
  const { users, setUsers } = useUsers();
  const STATES = ["Activo", "Inactivo"];
  const { id } = useParams();
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [state, setState] = useState("");
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  useEffect(() => {
    const user = users.find((u) => u.user_id === Number(id));
    if (!user) {
      navigate("/users");
      return;
    }
    setName(user.name);
    setLastName(user.last_name);
    setEmail(user.email);
    setState(user.state);
  }, [id, users, navigate]);
  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = "El correo es requerido";
    } else if (!validators.email(email)) {
      newErrors.email = "Por favor ingresa un correo válido";
    }
    const isExisted = MOCK_USERS.some(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );
    if (!name) {
      newErrors.name = "El nombre es requerido";
    }
    if (!name) {
      newErrors.lastName = "El apellido es requerido";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e) => {
    const user = users.find((u) => u.user_id === Number(id));
    e.preventDefault();
    setError("");
    if (!validateForm()) {
      return;
    }
    const editUser = {
      user_id: Number(id),
      name,
      last_name: lastName,
      email,
      password_hash: user.password_hash,
      state: state == "true" || state == true ? true : false,
      date_created: user.date_created,
      last_access: new Date().toISOString(),
    };
    const updatedUsers = users.map((u) =>
      u.user_id === Number(id) ? editUser : u,
    );
    setUsers(updatedUsers);
    setToast({
      message: `¡Usuario registrado exitosamente!`,
      type: "success",
    });
    setTimeout(() => navigate("/users"), 500);
  };
  const handleCancel = () => {
    navigate("/users");
  };
  return (
    <MainLayout>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="max-w-7xl mx-auto">
        <div
          className="min-h-screen bg-white md:bg-gray-50 md:flex md:items-start
md:justify-center md:p-4"
        >
          <div className="w-full md:max-w-2xl">
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm
font-medium transition-colors px-4 pt-6 pb-2 md:px-0 md:pt-0 md:pb-3"
            >
              <ArrowLeft size={15} />
              Regresar
            </button>
            <div className="px-4 pb-4 md:px-0 md:pb-2">
              <p className="text-2xl font-bold text-gray-900 md:text-3xl">
                Editar usuario
              </p>
            </div>
            <Card
              className="rounded-none border-0 shadow-none px-4 md:rounded-xl
md:border md:shadow-sm md:px-8 py-6 flex flex-col gap-5"
            >
              <form onSubmit={handleSubmit} className="space-y-4">
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
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 textcenter sm:text-left">
                    Estado del usuario
                    <span className="text-red-500"> *</span>
                  </label>
                  <div className="relative">
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm
text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none
cursor-pointer"
                    >
                      {STATES.map((op) => (
                        <option key={op} value={op === "Activo" ? true : false}>
                          {op}
                        </option>
                      ))}
                    </select>
                    {/* Ícono de flecha del select */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-eventsnone text-black">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col-reverse gap-3 pt-2 md:flex-row md:justify-end">
                  <Button
                    variant="secondary"
                    size="md"
                    fullWidth
                    onClick={handleCancel}
                    className="md:w-auto md:px-6"
                    type="button"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    fullWidth
                    onClick={handleSubmit}
                    className="md:w-auto md:px-6"
                  >
                    Actualizar
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
