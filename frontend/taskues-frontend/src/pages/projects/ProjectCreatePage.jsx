import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FolderPlus, ArrowLeft } from "lucide-react";
import { MainLayout } from "../../components/layout/MainLayout";
import { Card } from "../../components/common/Card";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { Toast } from "../../components/common/Toast";
import { projectService } from "../../services/projectService";
import { useAuth } from "../../hooks/useAuth";

const STATES = [
  { value: "ACTIVE",    label: "Activo" },
  { value: "ARCHIVED",  label: "Archivado" },
  { value: "COMPLETED", label: "Completado" },
];

export const ProjectCreatePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [state, setState] = useState("ACTIVE");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "El nombre del proyecto es obligatorio";
    if (!description.trim()) newErrors.description = "La descripción es obligatoria";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const created = await projectService.create({
        name: name.trim(),
        description: description.trim(),
        state,
        ownerId: user.userId,
      });

      setToast({ message: "Proyecto creado correctamente", type: "success" });
      setTimeout(() => navigate(`/projects/${created.projectId}`), 600);
    } catch (err) {
      setToast({ message: err.message || "Error al crear el proyecto", type: "danger" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/projects")}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Volver a proyectos</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-blue-900 p-3 rounded-xl">
              <FolderPlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Nuevo Proyecto</h1>
              <p className="text-gray-500 text-sm">Completa los datos para crear tu proyecto</p>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <Card>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Nombre del proyecto"
              type="text"
              placeholder="Ej: Proyecto Final DAW"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
              notNull
            />

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Descripción <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                placeholder="Describe el objetivo y alcance del proyecto..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`w-full px-4 py-2 text-black border rounded-lg focus:outline-none
                  focus:ring-2 focus:ring-blue-500 resize-none
                  ${errors.description ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Estado inicial
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {STATES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="secondary"
                size="lg"
                className="flex-1"
                onClick={() => navigate("/projects")}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="flex-1"
                loading={loading}
              >
                Crear Proyecto
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </MainLayout>
  );
};