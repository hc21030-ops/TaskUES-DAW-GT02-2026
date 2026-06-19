import { Edit2, Trash2, Calendar, FolderOpen } from "lucide-react";
import { Badge } from "../common/Badge";

const STATE_BADGE = {
  TODO:        { variant: "primary", label: "Por hacer" },
  IN_PROGRESS: { variant: "info",    label: "En progreso" },
  IN_REVIEW:   { variant: "warning", label: "En revisión" },
  DONE:        { variant: "success", label: "Completado" },
};

const TaskList = ({ tasks, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Listado de Tareas</h2>

      {tasks.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-8">
          No hay tareas registradas.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => {
            const badge = STATE_BADGE[task.state] ?? { variant: "primary", label: task.state };
            return (
              <div
                key={task.taskId}
                className="border border-gray-100 bg-gray-50 rounded-lg p-4
                  hover:shadow-md transition-shadow flex flex-col gap-3"
              >
                {/* Título + estado */}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                    {task.title}
                  </h3>
                  <Badge variant={badge.variant}>{badge.label}</Badge>
                </div>

                {/* Descripción */}
                <p className="text-gray-500 text-xs line-clamp-2">{task.description}</p>

                {/* Proyecto */}
                {task.projectName && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span className="truncate">{task.projectName}</span>
                  </div>
                )}

                {/* Fecha límite */}
                {task.endDate && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(task.endDate).toLocaleDateString()}</span>
                  </div>
                )}

                {/* Acciones */}
                <div className="flex gap-2 pt-2 border-t border-gray-200">
                  <button
                    onClick={() => onEdit(task)}
                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5
                      bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(task)}
                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5
                      bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TaskList;