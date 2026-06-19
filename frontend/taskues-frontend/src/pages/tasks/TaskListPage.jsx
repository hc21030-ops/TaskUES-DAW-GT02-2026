import { useState, useEffect } from "react";
import { Edit2, Trash2, Search } from "lucide-react";
import { MainLayout } from "../../components/layout/MainLayout";
import { Card } from "../../components/common/Card";
import TaskList from "../../components/layout/TaskList";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { Badge } from "../../components/common/Badge";
import { useNavigate } from "react-router-dom";
import { useTasks } from "../../context/TaskContext";
import { AlertDialog, Button as HeroButton } from "@heroui/react";

export const TaskListPage = () => {

    console.log("🔍 Verificando componentes:", {
        MainLayout,
        Card,
        Button,
        Input,
        TaskList,
        useNavigate,
        useTasks,
        AlertDialog,
        HeroButton
    });

    const { tasks, setTasks } = useTasks();
    const [filteredTasks, setFilteredTasks] = useState(tasks || []);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTask, setSelectedTask] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const navigate = useNavigate();

    // Filtrar tareas
    useEffect(() => {
        const filtered = tasks.filter(
            (task) =>
                task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.status.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredTasks(filtered);
    }, [searchTerm, tasks]);

    const handleEditClick = (task) => {
        navigate(`/tasks/edit/${task.id}`);
    };


    const handleDeleteClick = (taskOrId) => {
        const task = typeof taskOrId === 'object' ? taskOrId : tasks.find(t => t.id === taskOrId);
        setSelectedTask(task);
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        if (!selectedTask) return;
        setTasks(tasks.filter((t) => t.id !== selectedTask.id));
        setShowDeleteDialog(false);
        setSelectedTask(null);
    }

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between mb-8">
                    <div className="text-center sm:text-left w-full">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Gestión de Tareas
                        </h1>
                        <p className="text-gray-600 mt-2 text-center sm:text-left">
                            Administra las tareas del sistema
                        </p>
                    </div>
                </div>
                {/* Búsqueda */}
                <Card className="mb-6 flex flex-col-reverse sm:flex-row items-center gap-4">
                    <div className="w-full sm:flex-1 flex items-center">
                        <Input
                            type="text"
                            className="w-full"
                            placeholder="Buscar por título o descripción..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            icon={<Search className="w-5 h-5" />}
                        />
                    </div>
                    <div className="w-full sm:w-auto">
                        <Button
                            onClick={() => navigate("/tasks/new")}
                            className="h-12 w-full sm:w-auto px-6"
                            variant="primary"
                            size="lg"
                        >
                            Crear Tarea
                        </Button>
                    </div>
                </Card>
                {/* Tabla de Tareas */}
                <TaskList
                    tasks={filteredTasks}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                />
            </div>
            {/* Diálogo de Confirmación de Eliminación */}
            <AlertDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
            >
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
                                    ¿Deseas eliminar la tarea{" "}
                                    <strong>
                                        {selectedTask?.title}
                                    </strong>
                                    ?
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
}




