import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, Plus, Trash2, User, Calendar,
  Tag, ChevronRight, ChevronLeft,
} from "lucide-react";
import { MainLayout } from "../../components/layout/MainLayout";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { Toast } from "../../components/common/Toast";
import { taskService } from "../../services/taskService";
import { projectService } from "../../services/projectService";

const COLUMNS = [
  { state: "TODO",        label: "Por hacer",   color: "bg-gray-100",   badge: "primary"  },
  { state: "IN_PROGRESS", label: "En progreso", color: "bg-blue-50",    badge: "info"     },
  { state: "IN_REVIEW",   label: "En revisión", color: "bg-yellow-50",  badge: "warning"  },
  { state: "DONE",        label: "Completado",  color: "bg-green-50",   badge: "success"  },
];

const PREV_STATE = {
  IN_PROGRESS: "TODO",
  IN_REVIEW:   "IN_PROGRESS",
  DONE:        "IN_REVIEW",
};
const NEXT_STATE = {
  TODO:        "IN_PROGRESS",
  IN_PROGRESS: "IN_REVIEW",
  IN_REVIEW:   "DONE",
};

export const KanbanPage = () => {
  const { id: projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject]   = useState(null);
  const [tasks, setTasks]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [toast, setToast]       = useState(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        const [proj, tareas] = await Promise.all([
          projectService.getById(projectId),
          taskService.getByProject(projectId),
        ]);
        setProject(proj);
        setTasks(tareas);
      } catch (err) {
        setToast({ message: err.message || "No se pudo cargar el tablero", type: "danger" });
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [projectId]);

  const tasksByState = (state) => tasks.filter((t) => t.state === state);

  const moveTask = async (task, direction) => {
    const newState = direction === "next"
      ? NEXT_STATE[task.state]
      : PREV_STATE[task.state];

    if (!newState) return;

    try {
      const updated = await taskService.moveToState(task.taskId, newState);
      setTasks(tasks.map((t) => (t.taskId === updated.taskId ? updated : t)));
    } catch (err) {
      setToast({ message: err.message || "No se pudo mover la tarea", type: "danger" });
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await taskService.remove(taskId);
      setTasks(tasks.filter((t) => t.taskId !== taskId));
      setToast({ message: "Tarea eliminada", type: "success" });
    } catch (err) {
      setToast({ message: err.message || "No se pudo eliminar la tarea", type: "danger" });
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Cargando tablero...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-full">
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <button
              onClick={() => navigate(`/projects/${projectId}`)}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Volver al proyecto</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              {project?.name ?? "Tablero Kanban"}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {tasks.length} {tasks.length === 1 ? "tarea" : "tareas"} en total
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            className="flex items-center gap-2 shrink-0"
            onClick={() => navigate(`/projects/${projectId}/tasks/create`)}
          >
            <Plus className="w-5 h-5" />
            Nueva Tarea
          </Button>
        </div>

        {/* Tablero */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {COLUMNS.map((col) => {
            const colTasks = tasksByState(col.state);
            return (
              <div key={col.state} className={`rounded-xl p-4 ${col.color} min-h-[400px]`}>
                {/* Header de columna */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700">{col.label}</span>
                    <Badge variant={col.badge}>
                      {colTasks.length}
                    </Badge>
                  </div>
                </div>

                {/* Cards de tareas */}
                <div className="flex flex-col gap-3">
                  {colTasks.map((task) => (
                    <div
                      key={task.taskId}
                      className="bg-white rounded-lg p-4 shadow-sm border border-gray-100
                        hover:shadow-md transition-shadow"
                    >
                      {/* Título */}
                      <p className="font-semibold text-gray-900 text-sm mb-2 leading-tight">
                        {task.title}
                      </p>

                      {/* Descripción truncada */}
                      <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                        {task.description}
                      </p>

                      {/* Asignado a */}
                      {task.assignedUserName && (
                        <div className="flex items-center gap-1.5 mb-2">
                          <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center
                            justify-center text-white text-xs font-bold">
                            {task.assignedUserName[0]}
                          </div>
                          <span className="text-xs text-gray-500">{task.assignedUserName}</span>
                        </div>
                      )}

                      {/* Fecha límite */}
                      {task.endDate && (
                        <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(task.endDate).toLocaleDateString()}</span>
                        </div>
                      )}

                      {/* Acciones: mover + eliminar */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="flex gap-1">
                          {PREV_STATE[task.state] && (
                            <button
                              onClick={() => moveTask(task, "prev")}
                              className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50
                                rounded transition"
                              title="Mover atrás"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                          )}
                          {NEXT_STATE[task.state] && (
                            <button
                              onClick={() => moveTask(task, "next")}
                              className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50
                                rounded transition"
                              title="Mover adelante"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <button
                          onClick={() => deleteTask(task.taskId)}
                          className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50
                            rounded transition"
                          title="Eliminar tarea"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {colTasks.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm">
                      Sin tareas
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
};