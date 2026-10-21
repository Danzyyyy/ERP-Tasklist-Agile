import { useEffect, useMemo, useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";
import Skeleton from "./components/common/Skeleton";
import Toast from "./components/common/Toast";
import TaskModal from "./components/modals/TaskModal";
import ApprovalModal from "./components/modals/ApprovalModal";
import ProfileDrawer from "./components/modals/ProfileDrawer";
import DashboardView from "./views/DashboardView";
import ProjectsView from "./views/ProjectsView";
import TasklistView from "./views/TasklistView";
import KanbanView from "./views/KanbanView";
import ReviewsView from "./views/ReviewsView";
import ReportsView from "./views/ReportsView";
import { availableRoles } from "./constants/mockData";
import { View } from "./types";

export default function App() {
  const [view, setView] = useState<View>("tasklist");
  const [modal, setModal] = useState<"task" | "approval" | null>(null);
  const [role, setRole] = useState("Project Manager");
  const [profileOpen, setProfileOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);

  const changeView = (next: View) => {
    if (next === view) return;
    setLoading(true);
    setView(next);
    setTimeout(() => setLoading(false), 350);
  };

  const notify = (message: string) => setToast(message);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 3200);
    return () => clearTimeout(id);
  }, [toast]);

  const roleLabel = useMemo(
    () => availableRoles.find((item) => item.name === role)?.short || "PM",
    [role],
  );

  const renderView = () => {
    if (loading) return <Skeleton />;
    if (view === "dashboard") return <DashboardView onNavigate={changeView} />;
    if (view === "projects") return <ProjectsView notify={notify} />;
    if (view === "tasklist")
      return (
        <TasklistView
          onCreate={() => setModal("task")}
          onBoard={() => changeView("kanban")}
          toast={notify}
        />
      );
    if (view === "kanban")
      return (
        <KanbanView onCreate={() => setModal("task")} onApproval={() => setModal("approval")} />
      );
    if (view === "reviews") return <ReviewsView role={role} onOpen={() => setModal("approval")} />;
    return <ReportsView notify={notify} />;
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-900">
      <Sidebar currentView={view} onViewChange={changeView} />

      <div className="ml-[238px] w-[calc(100%-238px)] min-h-screen">
        <Topbar role={role} roleShort={roleLabel} onOpenProfile={() => setProfileOpen(true)} />
        {renderView()}
      </div>

      {modal === "task" && (
        <TaskModal
          onClose={() => setModal(null)}
          onSave={() => {
            setModal(null);
            notify("Draft task berhasil disimpan dan siap diajukan.");
          }}
        />
      )}

      {modal === "approval" && (
        <ApprovalModal
          role={role}
          onClose={() => setModal(null)}
          onReject={() => notify("Tugas dikembalikan ke Development dan diberi label REWORK.")}
          onSuccess={() => {
            setModal(null);
            notify("Tugas berhasil disahkan dan dipindahkan ke DONE.");
          }}
        />
      )}

      {profileOpen && (
        <ProfileDrawer
          role={role}
          onClose={() => setProfileOpen(false)}
          onRole={(nextRole) => {
            setRole(nextRole);
            notify(`Mode akses berhasil dialihkan ke ${nextRole}.`);
          }}
        />
      )}

      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}
