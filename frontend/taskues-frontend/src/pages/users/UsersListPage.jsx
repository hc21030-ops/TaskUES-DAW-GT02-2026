import { useState, useEffect } from "react";
import { Edit2, Trash2, Search } from "lucide-react";
import { MainLayout } from "../../components/layout/MainLayout";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { Badge } from "../../components/common/Badge";
import { Toast } from "../../components/common/Toast";
import { useNavigate } from "react-router-dom";
import { userService } from "../../services/userService";
import { AlertDialog, Button as HeroButton } from "@heroui/react";

export const UsersListPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const data = await userService.getAll();
        setUsers(data);
      } catch (err) {
        setToast({
          message: err.message || "No se pudieron cargar los usuarios",
          type: "danger",
        });
      } finally {
        setLoading(false);
      }
    };
    cargarUsuarios();
  }, []);

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;
    try {
      await userService.remove(selectedUser.userId);
      setUsers(users.filter((u) => u.userId !== selectedUser.userId));
      setToast({ message: "Usuario eliminado correctamente", type: "success" });
    } catch (err) {
      setToast({
        message: err.message || "No se pudo eliminar el usuario",
        type: "danger",
      });
    } finally {
      setShowDeleteDialog(false);
      setSelectedUser(null);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        {/* Header */}
        <div className="flex justify-between mb-8">
          <div className="text-center sm:text-left w-full">
            <h1 className="text-3xl font-bold text-gray-900">
              Gestión de Usuarios
            </h1>
            <p className="text-gray-600 mt-2 text-center sm:text-left">
              Administra los usuarios del sistema
            </p>
          </div>
        </div>

        {/* Búsqueda */}
        <Card className="mb-6 flex flex-col-reverse sm:flex-row items-center gap-4">
          <div className="w-full sm:flex-1 flex items-center">
            <Input
              type="text"
              className="w-full"
              placeholder="Buscar por nombre, apellido o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-5 h-5" />}
            />
          </div>
          <div className="flex items-center w-full sm:w-auto">
            <Button
              className="h-12 w-full sm:w-auto px-6"
              variant="primary"
              size="lg"
              onClick={() => navigate("/users/create")}
            >
              Crear Usuario
            </Button>
          </div>
        </Card>

        {/* Tabla */}
        <Card>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Cargando usuarios...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Roles</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Estado</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Último Acceso</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody className="text-left">
                  {filteredUsers.map((user, index) => (
                    <tr
                      key={user.userId}
                      className={`border-b border-gray-200 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-gray-100`}
                    >
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {user.name} {user.lastname}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {user.roles?.join(", ") || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {user.state ? (
                          <Badge variant="success">Activo</Badge>
                        ) : (
                          <Badge variant="primary">Inactivo</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {user.lastAccess
                          ? new Date(user.lastAccess).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/users/${user.userId}/edit`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(user)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600">No se encontraron usuarios</p>
                </div>
              )}
            </div>
          )}
        </Card>

        <AlertDialog isOpen={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialog.Backdrop>
            <AlertDialog.Container>
              <AlertDialog.Dialog className="sm:max-w-100">
                <AlertDialog.CloseTrigger />
                <AlertDialog.Header>
                  <AlertDialog.Icon status="danger" />
                  <AlertDialog.Heading>Eliminar usuario</AlertDialog.Heading>
                </AlertDialog.Header>
                <AlertDialog.Body>
                  <p>
                    ¿Deseas eliminar al usuario{" "}
                    <strong>
                      {selectedUser?.name} {selectedUser?.lastname}
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
      </div>
    </MainLayout>
  );
};