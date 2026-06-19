import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ClipboardList } from "lucide-react";
import { MainLayout } from "../../components/layout/MainLayout";
import { Card } from "../../components/common/Card";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { Toast } from "../../components/common/Toast";
import { taskService } from "../../services/taskService";
import { categoryService } from "../../services/categoryService";
import { projectUserService } from "../../services/projectUserService";

const STATES = [
  { value: "TODO",        label: "Por hacer"   },
  { value: "IN_PROGRESS", label: "En progreso" },
  { value: "IN_REVIEW",   label: "En revisión" },
  { value: "DONE",        label: "Completado"  },
];

export const TaskCreatePage = () => {
  const { id: projectId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle]             = useState("");
  const [description, setDescription] = useState("");
  const [state, setState]             = useState("TODO");
  const [initDate, setInitDate]       = useState("");
  const [endDate, setEndDate]         = useState("");
  const [categoryId, setCategoryId]   = useState("");
  const [userId, setUserId]           = useState("");

  const [categories, setCategories]   = useState([]);
  const [members, setMembers]         = useState([]);
  const [loading, setLoading]         = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [errors, setErrors]           = useState({});
  const [toast, setToast]             = useState(null);

  // Carga categorías y miembros del proyecto al montar
  useEffect(() => {
    const cargar = async () => {
      try {
        const [cats, mems] = await Promise.all([
          categoryService.getByProject(projectId),
          projectUserService.getByProjectId(projectId),
        ]);
        setCategories(cats);
        setMembers(mems);

        // Preseleccionar la primera categoría si existe
        if (cats.length > 0) setCategoryId(String(cats[0].categoryId));
      } catch (err) {
        setToast({
          message: err.message || "No se pudieron cargar los datos del proyecto",
          type: "danger",
        });
      } finally {
        setLoadingData(false);
      }
    };
    cargar();
  }, [projectId]);

  const validate = () => {
    const newErrors = {};
    if (!title.trim())       newErrors.title       = "El título es obligatorio";
    if (!description.trim()) newErrors.description = "La descripción es obligatoria";
    if (!categoryId)         newErrors.categoryId  = "Selecciona una categoría";
    if (!userId)             newErrors.userId      = "Selecciona un responsable";
    if (endDate && initDate && endDate < initDate) {
      newErrors.endDate = "La fecha de fin no puede ser anterior a la de inicio";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await taskService.create({
        title:       title.trim(),
        description: description.trim(),
        state,
        projectId:   parseInt(projectId),
        categoryId:  parseInt(categoryId),
        userId:      parseInt(userId),
        initDate:    initDate ? initDate + ":00" : null,
        endDate:     endDate  ? endDate  + ":00" : null,
      });

      setToast({ message: "Tarea creada correctamente", type: "success" });
      setTimeout(() => navigate(`/projects/${projectId}/kanban`), 600);
    } catch (err) {
      setToast({ message: err.message || "Error al crear la tarea", type: "danger" });
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
            onClick={() => navigate(`/projects/${projectId}/kanban`)}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Volver al tablero</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-blue-900 p-3 rounded-xl">
              <ClipboardList className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Nueva Tarea</h1>
              <p className="text-gray-500 text-sm">Completa los datos para crear la tarea</p>
            </div>
          </div>
        </div>

        <Card>
          {loadingData ? (
            <div className="text-center py-10 text-gray-500">Cargando datos del proyecto...</div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

              {/* Título */}
              <Input
                label="Título"
                type="text"
                placeholder="Ej: Implementar login de usuarios"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={errors.title}
                notNull
              />

              {/* Descripción */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descripción <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe qué debe hacerse y los criterios de aceptación..."
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

              {/* Estado */}
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
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              {/* Categoría — select con las categorías del proyecto */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Categoría <span className="text-red-500">*</span>
                </label>
                {categories.length === 0 ? (
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-yellow-600 bg-yellow-50 border border-yellow-200
                      rounded-lg px-4 py-2">
                      Este proyecto no tiene categorías. Debes crear al menos una antes de
                      agregar tareas.
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate(`/projects/${projectId}/categories`)}
                      className="text-sm text-blue-600 hover:underline text-left"
                    >
                      Ir a gestionar categorías →
                    </button>
                  </div>
                ) : (
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className={`w-full px-4 py-2 text-black border rounded-lg focus:outline-none
                      focus:ring-2 focus:ring-blue-500
                      ${errors.categoryId ? "border-red-500" : "border-gray-300"}`}
                  >
                    <option value="">Selecciona una categoría</option>
                    {categories.map((cat) => (
                      <option key={cat.categoryId} value={cat.categoryId}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                )}
                {errors.categoryId && (
                  <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Responsable <span className="text-red-500">*</span>
                </label>
                <select
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className={`w-full px-4 py-2 text-black border rounded-lg focus:outline-none
                    focus:ring-2 focus:ring-blue-500
                    ${errors.userId ? "border-red-500" : "border-gray-300"}`}
                >
                  <option value="">Selecciona un responsable</option>
                  {members.map((m) => (
                    <option key={m.userId} value={m.userId}>
                      {m.userName ?? m.userEmail} ({m.projectRole})
                    </option>
                  ))}
                </select>
                {errors.userId && (
                  <p className="text-red-500 text-sm mt-1">{errors.userId}</p>
                )}
              </div>

              {/* Fechas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Fecha de inicio
                  </label>
                  <input
                    type="datetime-local"
                    value={initDate}
                    onChange={(e) => setInitDate(e.target.value)}
                    className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg
                      focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Fecha límite
                  </label>
                  <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={`w-full px-4 py-2 text-black border rounded-lg focus:outline-none
                      focus:ring-2 focus:ring-blue-500
                      ${errors.endDate ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.endDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
                  )}
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  className="flex-1"
                  onClick={() => navigate(`/projects/${projectId}/kanban`)}
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
                  disabled={categories.length === 0}
                >
                  Crear Tarea
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </MainLayout>
  );
};