import React from 'react';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Award,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';
import { CompanySettings } from '../types';

interface FooterProps {
  settings: CompanySettings;
  onNavigate: (view: string) => void;
  openChat: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onNavigate,
  openChat,
}) => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2.5 cursor-pointer text-white"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tight">{settings.name}</span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Especialistas en reformas integrales, acondicionamiento de locales comerciales, pintura técnica, climatización de alta eficiencia e instalaciones eléctricas homologadas con 2 años de garantía legal.
            </p>

            <div className="pt-2 flex items-center gap-3 text-slate-300">
              <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span className="text-[11px] font-semibold">Empresa Homologada REA</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                <Award className="w-4 h-4 text-amber-400" />
                <span className="text-[11px] font-semibold">Garantía Certificada</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-tight uppercase text-[11px]">
              Secciones
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors"
                >
                  Inicio
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-white transition-colors"
                >
                  Servicios y Tarifas
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('projects')}
                  className="hover:text-white transition-colors"
                >
                  Galería de Proyectos
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('quotation')}
                  className="hover:text-white transition-colors text-blue-400 font-semibold"
                >
                  Calculadora de Presupuestos
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('client-area')}
                  className="hover:text-white transition-colors"
                >
                  Área Privada de Cliente
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors"
                >
                  Contacto Directo
                </button>
              </li>
            </ul>
          </div>

          {/* Services Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-tight uppercase text-[11px]">
              Especialidades
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>Reformas Integrales de Pisos</li>
              <li>Renovación de Cocinas & Baños</li>
              <li>Pintura Lisa y Eliminación Gotelé</li>
              <li>Aerotermia & Suelo Radiante</li>
              <li>Boletines Eléctricos y Cuadros</li>
              <li>Carpintería PVC con Gas Argón</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-tight uppercase text-[11px]">
              Contacto Central
            </h4>
            <div className="space-y-2 text-slate-400 text-xs">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>{settings.address}, {settings.city}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{settings.phone}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                <span>{settings.email}</span>
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={openChat}
                className="w-full py-2 px-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 hover:bg-emerald-900 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>WhatsApp Comercial ({settings.commercialName})</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} {settings.name} — CIF: {settings.cif}. Todos los derechos reservados.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('admin')}
              className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Acceso Panel de Administración</span>
            </button>
            <span>•</span>
            <span className="hover:text-slate-400">Aviso Legal y Privacidad</span>
            <span>•</span>
            <span className="hover:text-slate-400">Condiciones de Contratación</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
