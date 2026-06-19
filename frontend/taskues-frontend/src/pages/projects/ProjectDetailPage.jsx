import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, Users, UserPlus, Trash2,
  FolderOpen, Calendar, Crown, Shield, User, Eye,
} from "lucide-react";
import { MainLayout } from "../../components/layout/MainLayout";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { Badge } from "../../components/common/Badge";
import { Toast } from "../../components/common/Toast";
import { projectService } from "../../services/projectService";
import { projectUserService } from "../../services/projectUserService";
import { AlertDialog, Button as HeroButton } from "@heroui/react";

const STATE_BADGE = {
  ACTIVE:    { variant: "success",  label: "Activo" },
  ARCHIVED:  { variant: "warning",  label: "Archivado" },
  COMPLETED: { variant: "info",     label: "Completado" },
};

const ROLE_CONFIG = {
  OWNER:  { label: "Propietario", icon: Crown,  variant: "purple" },
  ADMIN:  { label: "Admin",       icon: Shield, variant: "warning" },
  MEMBER: { label: "Miembro",     icon: User,   variant: "primary" },
  VIEWER: { label: "Visor",       icon: Eye,    variant: "info" },
};

const ROLES = ["ADMIN", "MEMBER", "VIEWER"];

export const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [newUserId, setNewUserId] = useState("");
  const [newRole, setNewRole] = useState("MEMBER");
  const [addingMember, setAddingMember] = useState(false);
  const [addError, setAddError] = useState("");

  const [selectedMember, setSelectedMember] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      try {
        const [proj, mems] = await Promise.all([
          projectService.getById(id),
          projectUserService.getByProjectId(id),
        ]);
        setProject(proj);
        setMembers(mems);
      } catch (err) {
        setToast({ message: err.message || "No se pudo cargar el proyecto", type: "danger" });
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [id]);

  const handleAddMember = async (e) => {
    e.preventDefault();
    setAddError("");

    const userId = parseInt(newUserId);
    if (!newUserId || isNaN(userId)) {
      setAddError("Ingresa un ID de usuario válido");
      return;
    }

    setAddingMember(true);
    try {
      const nuevo = await projectUserService.addMember({
        projectId: parseInt(id),
        userId,
        projectRole: newRole,
      });
      setMembers([...members, nuevo]);
      setNewUserId("");
      setNewRole("MEMBER");
      setToast({ message: "Miembro agregado correctamente", type: "success" });
    } catch (err) {
      setAddError(err.message || "No se pudo agregar el miembro");
    } finally {
      setAddingMember(false);
    }
  };

  const handleRemoveClick = (member) => {
    setSelectedMember(member);
    setShowDeleteDialog(true);
  };

  const confirmRemove = async () => {
    if (!selectedMember) return;
    try {
      await projectUserService.removeMember(selectedMember.id);
      setMembers(members.filter((m) => m.id !== selectedMember.id));
      setToast({ message: "Miembro eliminado del proyecto", type: "success" });
    } catch (err) {
      setToast({ message: err.message || "No se pudo quitar al miembro", type: "danger" });
    } finally {
      setShowDeleteDialog(false);
      setSelectedMember(null);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Cargando proyecto...</p>
        </div>
      </MainLayout>
    );
  }

  if (!project) {
    return (
      <MainLayout>
        <div className="text-center py-16">
          <p className="text-gray-500">Proyecto no encontrado.</p>
          <Button variant="primary" className="mt-4" onClick={() => navigate("/projects")}>
            Volver a proyectos
          </Button>
        </div>
      </MainLayout>
    );
  }

  const badge = STATE_BADGE[project.state] ?? { variant: "primary", label: project.state };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}

        <button
          onClick={() => navigate("/projects")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Volver a proyectos</span>
        </button>

        <Card className="mb-6">
          <div className="flex items-start gap-4">
            <div className="bg-blue-900 p-3 rounded-xl shrink-0">
              <FolderOpen className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
                <Badge variant={badge.variant}>{badge.label}</Badge>
              </div>
              <p className="text-gray-600 text-sm mb-4">{project.description}</p>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  Creado el{" "}
                  {project.dateCreated
                    ? new Date(project.dateCreated).toLocaleDateString()
                    : "—"}
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-5 h-5 text-blue-700" />
            <h2 className="text-lg font-bold text-gray-900">
              Miembros del proyecto
            </h2>
            <span className="ml-auto text-sm text-gray-400">
              {members.length} {members.length === 1 ? "miembro" : "miembros"}
            </span>
          </div>

          <div className="divide-y divide-gray-100 mb-6">
            {members.map((member) => {
              const roleConf = ROLE_CONFIG[member.projectRole] ?? ROLE_CONFIG.MEMBER;
              const RoleIcon = roleConf.icon;
              return (
                <div
                  key={member.id}
                  className="flex items-center justify-between py-3 gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                      {member.userName?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {member.userName ?? `Usuario #${member.userId}`}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{member.userEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge variant={roleConf.variant}>
                      <span className="flex items-center gap-1">
                        <RoleIcon className="w-3 h-3" />
                        {roleConf.label}
                      </span>
                    </Badge>
                    {member.projectRole !== "OWNER" && (
                      <button
                        onClick={() => handleRemoveClick(member)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                        title="Quitar miembro"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            {members.length === 0 && (
              <p className="text-gray-400 text-sm py-4 text-center">
                No hay miembros registrados aún.
              </p>
            )}
          </div>

          {/* Agregar miembro */}
          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Agregar miembro
            </h3>
            <form onSubmit={handleAddMember} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="ID del usuario"
                  value={newUserId}
                  onChange={(e) => { setNewUserId(e.target.value); setAddError(""); }}
                  error={addError}
                />
              </div>
              <div className="sm:w-40">
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-blue-500 h-10.5"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {ROLE_CONFIG[r].label}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                type="submit"
                variant="primary"
                loading={addingMember}
                className="sm:w-auto w-full h-10.5"
              >
                Agregar
              </Button>
            </form>
          </div>
        </Card>

        <AlertDialog isOpen={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialog.Backdrop>
            <AlertDialog.Container>
              <AlertDialog.Dialog className="sm:max-w-100">
                <AlertDialog.CloseTrigger />
                <AlertDialog.Header>
                  <AlertDialog.Icon status="danger" />
                  <AlertDialog.Heading>Quitar miembro</AlertDialog.Heading>
                </AlertDialog.Header>
                <AlertDialog.Body>
                  <p>
                    ¿Deseas quitar a{" "}
                    <strong>{selectedMember?.userName ?? `Usuario #${selectedMember?.userId}`}</strong>{" "}
                    del proyecto?
                  </p>
                </AlertDialog.Body>
                <AlertDialog.Footer>
                  <HeroButton slot="close" variant="ghost">Cancelar</HeroButton>
                  <HeroButton variant="danger" onPress={confirmRemove}>Quitar</HeroButton>
                </AlertDialog.Footer>
              </AlertDialog.Dialog>
            </AlertDialog.Container>
          </AlertDialog.Backdrop>
        </AlertDialog>
      </div>
    </MainLayout>
  );
};