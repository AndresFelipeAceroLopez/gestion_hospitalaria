/**
 * @description Barra lateral de navegacion del dashboard.
 * Es un CLIENT COMPONENT porque usa usePathname() de Next.js
 * para detectar la ruta activa y aplicar estilos.
 * @directive "use client"
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Stethoscope,
  UserRound,
  Users,
  ClipboardList,
  HeartPulse,
  Pill,
  FileText,
  FlaskConical,
  Shield,
} from "lucide-react";

// Definicion del menu de navegacion
const NAVIGATION = [
  {
    section: "Principal",
    items: [{ href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" }],
  },
  {
    section: "Administracion",
    items: [
      { href: "/dashboard/hospitales", icon: Building2, label: "Hospitales" },
      {
        href: "/dashboard/especialidades",
        icon: Stethoscope,
        label: "Especialidades",
      },
      { href: "/dashboard/medicamentos", icon: Pill, label: "Medicamentos" },
    ],
  },
  {
    section: "Atencion Medica",
    items: [
      { href: "/dashboard/medicos", icon: UserRound, label: "Medicos" },
      { href: "/dashboard/pacientes", icon: Users, label: "Pacientes" },
      { href: "/dashboard/visitas", icon: ClipboardList, label: "Visitas" },
      {
        href: "/dashboard/tratamientos",
        icon: HeartPulse,
        label: "Tratamientos",
      },
    ],
  },
  {
    section: "Documentos",
    items: [
      { href: "/dashboard/formulas", icon: FileText, label: "Formulas" },
      { href: "/dashboard/examenes", icon: FlaskConical, label: "Examenes" },
      { href: "/dashboard/incapacidades", icon: Shield, label: "Incapacidades" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-green-800 text-white flex flex-col shrink-0 h-full">
      {/* Logo SENA */}
      <div className="p-5 border-b border-green-700">
        <h1 className="text-base font-bold leading-tight">
          Sistema Hospitalario
        </h1>
        <p className="text-xs text-green-300 mt-0.5">SENA CEET · ADSO</p>
      </div>

      {/* Menu de navegacion con secciones */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {NAVIGATION.map((section) => (
          <div key={section.section} className="mb-4">
            {/* Titulo de la seccion */}
            <p className="text-xs font-semibold text-green-400 uppercase tracking-wider px-3 mb-1">
              {section.section}
            </p>
            {/* Items de navegacion */}
            <div className="space-y-0.5">
              {section.items.map(({ href, icon: Icon, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg
                    text-sm font-medium transition-all duration-150
                    ${
                      isActive(href)
                        ? "bg-green-600 text-white shadow-sm"
                        : "text-green-100 hover:bg-green-700 hover:text-white"
                    }
                  `}
                >
                  <Icon size={16} strokeWidth={2} />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

    </aside>
  );
}