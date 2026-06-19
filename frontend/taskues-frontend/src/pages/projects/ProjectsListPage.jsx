import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Folder, FolderKanban, Trash2, Eye } from "lucide-react";
import { MainLayout } from "../../components/layout/MainLayout";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { Badge } from "../../components/common/Badge";
import { Toast } from "../../components/common/Toast";
import { projectService } from "../../services/projectService";
import { useAuth } from "../../hooks/useAuth";
import { AlertDialog, Button as HeroButton } from "@heroui/react";

const STATE_BADGE = {
  ACTIVE:    { variant: "success",  label: "Activo" },
  ARCHIVED:  { variant: "warning",  label: "Archivado" },
  COMPLETED: { variant: "info",     label: "Completado" },
};

export const ProjectsListPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [projects, setProjects] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await projectService.getByUserId(user.userId);
        setProjects(data);
      } catch (err) {
        setToast({ message: err.message || "No se pudieron cargar los proyectos", type: "danger" });
      } finally {
        setLoading(false);
      }
    };
    if (user?.userId) cargar();
  }, [user]);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    setFiltered(
      projects.filter(
        (p) =>
          p.name?.toLowerCase().includes(term) ||
          p.description?.toLowerCase().includes(term)
      )
    );
  }, [searchTerm, projects]);

  const handleDeleteClick = (project) => {
    setSelectedProject(project);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedProject) return;
    try {
      await projectService.remove(selectedProject.projectId);
      setProjects(projects.filter((p) => p.projectId !== selectedProject.projectId));
      setToast({ message: "Proyecto eliminado correctamente", type: "success" });
    } catch (err) {
      setToast({ message: err.message || "No se pudo eliminar el proyecto", type: "danger" });
    } finally {
      setShowDeleteDialog(false);
      setSelectedProject(null);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}

        {/* Header */}
        <div className="flex justify-between mb-8">
          <div className="w-full text-center sm:text-left">
            <h1 className="text-3xl font-bold text-gray-900">Mis Proyectos</h1>
            <p className="text-gray-600 mt-2">
              Gestiona tus proyectos individuales y colaborativos
            </p>
          </div>
        </div>

        {/* Búsqueda + Crear */}
        <Card className="mb-6 flex flex-col-reverse sm:flex-row items-center gap-4">
          <div className="w-full sm:flex-1">
            <Input
              type="text"
              placeholder="Buscar por nombre o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-5 h-5" />}
            />
          </div>
          <div className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto h-12 px-6 flex items-center gap-2"
              onClick={() => navigate("/projects/create")}
            >
              <Plus className="w-5 h-5" />
              Nuevo Proyecto
            </Button>
          </div>
        </Card>

        {/* Grid de proyectos */}
        {loading ? (
          <div className="text-center py-16">
            <p className="text-gray-500">Cargando proyectos...</p>
          </div>
        ) : filtered.length === 0 ? (
          <Card className="text-center py-16">
            <Folder className="w-14 h-14 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">
              {searchTerm ? "No se encontraron proyectos" : "Aún no tienes proyectos"}
            </p>
            {!searchTerm && (
              <p className="text-gray-400 mt-2 mb-6">
                Crea tu primer proyecto para empezar a gestionar tareas
              </p>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project) => {
              const badge = STATE_BADGE[project.state] ?? { variant: "primary", label: project.state };
              return (
                <Card
                  key={project.projectId}
                  className="flex flex-col justify-between gap-4 hover:shadow-lg transition-shadow"
                >
                  {/* Encabezado */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h2 className="text-lg font-bold text-gray-900 leading-tight">
                        {project.name}
                      </h2>
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-3">{project.description}</p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-400">
                      {project.dateCreated
                        ? new Date(project.dateCreated).toLocaleDateString()
                        : "—"}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/projects/${project.projectId}/kanban`)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                        title="Ver tablero"
                      >
                        <FolderKanban className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => navigate(`/projects/${project.projectId}`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Ver detalle"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(project)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Dialog de confirmación */}
        <AlertDialog isOpen={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialog.Backdrop>
            <AlertDialog.Container>
              <AlertDialog.Dialog className="sm:max-w-100">
                <AlertDialog.CloseTrigger />
                <AlertDialog.Header>
                  <AlertDialog.Icon status="danger" />
                  <AlertDialog.Heading>Eliminar proyecto</AlertDialog.Heading>
                </AlertDialog.Header>
                <AlertDialog.Body>
                  <p>
                    ¿Deseas eliminar el proyecto{" "}
                    <strong>{selectedProject?.name}</strong>?
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    Esta acción eliminará también todas sus categorías, tags y tareas. No se puede deshacer.
                  </p>
                </AlertDialog.Body>
                <AlertDialog.Footer>
                  <HeroButton slot="close" variant="ghost">Cancelar</HeroButton>
                  <HeroButton variant="danger" onPress={confirmDelete}>Eliminar</HeroButton>
                </AlertDialog.Footer>
              </AlertDialog.Dialog>
            </AlertDialog.Container>
          </AlertDialog.Backdrop>
        </AlertDialog>
      </div>
    </MainLayout>
  );
};