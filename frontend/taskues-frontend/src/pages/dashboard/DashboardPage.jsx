import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Users,
  FileText,
  CheckCircle,
  TrendingUp,
  UserCheck,
  UserX,
  ShieldCheck,
} from "lucide-react";
import { MainLayout } from "../../components/layout/MainLayout";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { useAuth } from "../../hooks/useAuth";
export const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const today = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            ¡Bienvenido, {user?.name}!
          </h1>
          <p className="text-gray-600">{today}</p>
        </div>
      </div>
    </MainLayout>
  );
};
