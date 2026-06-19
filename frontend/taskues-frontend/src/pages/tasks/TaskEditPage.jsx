import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ChevronDown,
  Calendar,
  Tag,
  User,
  Mail,
  AlignLeft,
  FileText,
  ShieldCheck,
  Save,
} from "lucide-react";
import { MainLayout } from "../../components/layout/MainLayout";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { initialTasks } from "../../utils/mockData";
import { validators } from "../../utils/validators";
import { Toast } from "../../components/common/Toast";
import { useTasks } from "../../context/TaskContext";