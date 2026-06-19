import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { MainLayout } from "../../components/layout/MainLayout";
import { Card } from "../../components/common/Card";
import TaskList from "../../components/layout/TaskList";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { Toast } from "../../components/common/Toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { taskService } from "../../services/taskService";
import { projectService } from "../../services/projectService";
import { AlertDialog, Button as HeroButton } from "@heroui/react";

export const TaskListPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Carga las tareas asignadas al usuario autenticado, y enriquece
  // cada una con el nombre de su proyecto (el backend solo manda
  // projectId; resolvemos el nombre aquí para no tocar el DTO).
  useEffect(() => {
    const cargar = async () => {
      try {
        const misTareas = await taskService.getByUser(user.userId);

        const projectIds = [...new Set(misTareas.map((t) => t.projectId))];
        const proyectos = await Promise.all(
          projectIds.map((id) => projectService.getById(id).catch(() => null))
        );
        const nombresPorId = Object.fromEntries(
          proyectos.filter(Boolean).map((p) => [p.projectId, p.name])
        );

        const tareasConProyecto = misTareas.map((t) => ({
          ...t,
          projectName: nombresPorId[t.projectId] ?? null,
        }));

        setTasks(tareasConProyecto);
      } catch (err) {
        setToast({ message: err.message || "No se pudieron cargar tus tareas", type: "danger" });
      } finally {
        setLoading(false);
      }
    };
    if (user?.userId) cargar();
  }, [user]);

  // Filtrar tareas (sobre los datos ya cargados)
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    setFilteredTasks(
      tasks.filter(
        (task) =>
          task.title?.toLowerCase().includes(term) ||
          task.description?.toLowerCase().includes(term) ||
          task.state?.toLowerCase().includes(term)
      )
    );
  }, [searchTerm, tasks]);

  const handleEditClick = (task) => {
    // La edición completa de la tarea (título, descripción, fechas,
    // categoría, responsable) vive en el tablero Kanban de su proyecto,
    // para mantener un solo lugar de verdad sobre el flujo de tareas.
    navigate(`/projects/${task.projectId}/kanban`);
  };

  const handleDeleteClick = (task) => {
    setSelectedTask(task);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedTask) return;
    try {
      await taskService.remove(selectedTask.taskId);
      setTasks(tasks.filter((t) => t.taskId !== selectedTask.taskId));
      setToast({ message: "Tarea eliminada correctamente", type: "success" });
    } catch (err) {
      setToast({ message: err.message || "No se pudo eliminar la tarea", type: "danger" });
    } finally {
      setShowDeleteDialog(false);
      setSelectedTask(null);
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
          <div className="text-center sm:text-left w-full">
            <h1 className="text-3xl font-bold text-gray-900">Mis Tareas</h1>
            <p className="text-gray-600 mt-2 text-center sm:text-left">
              Tareas asignadas a ti en todos tus proyectos
            </p>
          </div>
        </div>

        {/* Búsqueda */}
        <Card className="mb-6 flex flex-col-reverse sm:flex-row items-center gap-4">
          <div className="w-full sm:flex-1 flex items-center">
            <Input
              type="text"
              className="w-full"
              placeholder="Buscar por título, descripción o estado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-5 h-5" />}
            />
          </div>
          <div className="w-full sm:w-auto">
            <Button
              onClick={() => navigate("/projects")}
              className="h-12 w-full sm:w-auto px-6"
              variant="primary"
              size="lg"
            >
              Ir a Proyectos
            </Button>
          </div>
        </Card>

        {/* Listado */}
        {loading ? (
          <Card className="text-center py-12">
            <p className="text-gray-500">Cargando tus tareas...</p>
          </Card>
        ) : (
          <TaskList
            tasks={filteredTasks}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        )}
      </div>

      {/* Diálogo de confirmación de eliminación */}
      <AlertDialog isOpen={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialog.Backdrop>
          <AlertDialog.Container>
            <AlertDialog.Dialog className="sm:max-w-100">
              <AlertDialog.CloseTrigger />
              <AlertDialog.Header>
                <AlertDialog.Icon status="danger" />
                <AlertDialog.Heading>Eliminar tarea</AlertDialog.Heading>
              </AlertDialog.Header>
              <AlertDialog.Body>
                <p>
                  ¿Deseas eliminar la tarea <strong>{selectedTask?.title}</strong>?
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Esta acción no se puede deshacer.
                </p>
              </AlertDialog.Body>
              <AlertDialog.Footer>
                <HeroButton slot="close" variant="ghost">
                  Cancelar
                </HeroButton>
                <HeroButton variant="danger" onPress={confirmDelete}>
                  Eliminar
                </HeroButton>
              </AlertDialog.Footer>
            </AlertDialog.Dialog>
          </AlertDialog.Container>
        </AlertDialog.Backdrop>
      </AlertDialog>
    </MainLayout>
  );
};