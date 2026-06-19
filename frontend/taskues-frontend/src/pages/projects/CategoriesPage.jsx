import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Tag } from "lucide-react";
import { MainLayout } from "../../components/layout/MainLayout";
import { Card } from "../../components/common/Card";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { Toast } from "../../components/common/Toast";
import { categoryService } from "../../services/categoryService";
import { projectService } from "../../services/projectService";

const DEFAULT_COLORS = [
  "#3B82F6", "#10B981", "#F59E0B", "#EF4444",
  "#8B5CF6", "#EC4899", "#14B8A6", "#F97316",
];

export const CategoriesPage = () => {
  const { id: projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject]       = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [toast, setToast]           = useState(null);

  // Form nueva categoría
  const [newName, setNewName]   = useState("");
  const [newColor, setNewColor] = useState(DEFAULT_COLORS[0]);
  const [adding, setAdding]     = useState(false);
  const [nameError, setNameError] = useState("");

  useEffect(() => {
    const cargar = async () => {
      try {
        const [proj, cats] = await Promise.all([
          projectService.getById(projectId),
          categoryService.getByProject(projectId),
        ]);
        setProject(proj);
        setCategories(cats);
      } catch (err) {
        setToast({ message: err.message || "Error al cargar categorías", type: "danger" });
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [projectId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setNameError("");
    if (!newName.trim()) {
      setNameError("El nombre es obligatorio");
      return;
    }
    setAdding(true);
    try {
      const created = await categoryService.create({
        name: newName.trim(),
        color: newColor,
        projectId: parseInt(projectId),
      });
      setCategories([...categories, created]);
      setNewName("");
      setNewColor(DEFAULT_COLORS[0]);
      setToast({ message: "Categoría creada", type: "success" });
    } catch (err) {
      setToast({ message: err.message || "Error al crear la categoría", type: "danger" });
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (categoryId) => {
    try {
      await categoryService.remove(categoryId);
      setCategories(categories.filter((c) => c.categoryId !== categoryId));
      setToast({ message: "Categoría eliminada", type: "success" });
    } catch (err) {
      setToast({ message: err.message || "No se pudo eliminar la categoría", type: "danger" });
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
            onClick={() => navigate(`/projects/${projectId}`)}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Volver al proyecto</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-blue-900 p-3 rounded-xl">
              <Tag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Categorías</h1>
              <p className="text-gray-500 text-sm">
                {project?.name ?? "Proyecto"} — organiza tus tareas por tipo
              </p>
            </div>
          </div>
        </div>

        {/* Crear categoría */}
        <Card className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nueva categoría
          </h2>
          <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3 items-start">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Ej: Frontend, Backend, Diseño..."
                value={newName}
                onChange={(e) => { setNewName(e.target.value); setNameError(""); }}
                error={nameError}
              />
            </div>
            {/* Selector de color */}
            <div className="flex flex-col gap-1">
              <div className="flex gap-2 flex-wrap">
                {DEFAULT_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setNewColor(c)}
                    className={`w-7 h-7 rounded-full border-2 transition
                      ${newColor === c ? "border-gray-800 scale-110" : "border-transparent"}`}
                    style={{ backgroundColor: c }}
                    title={c}
                  />
                ))}
              </div>
            </div>
            <Button type="submit" variant="primary" loading={adding} className="shrink-0 h-10">
              Agregar
            </Button>
          </form>
        </Card>

        {/* Lista de categorías */}
        <Card>
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            Categorías del proyecto ({categories.length})
          </h2>
          {loading ? (
            <p className="text-gray-500 text-center py-6">Cargando...</p>
          ) : categories.length === 0 ? (
            <p className="text-gray-400 text-center py-6 text-sm">
              Aún no hay categorías. Crea una para poder agregar tareas.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {categories.map((cat) => (
                <div
                  key={cat.categoryId}
                  className="flex items-center justify-between px-4 py-3
                    bg-gray-50 rounded-lg border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-sm font-medium text-gray-800">{cat.name}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(cat.categoryId)}
                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50
                      rounded-lg transition"
                    title="Eliminar categoría"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Ir al tablero */}
        {categories.length > 0 && (
          <div className="mt-6 text-center">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate(`/projects/${projectId}/kanban`)}
            >
              Ir al tablero Kanban →
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};