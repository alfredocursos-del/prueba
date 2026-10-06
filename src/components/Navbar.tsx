import React, { useState, useEffect } from 'react';
import {
  Building2,
  FileSpreadsheet,
  MessageSquare,
  ShieldCheck,
  UserCheck,
  Menu,
  X,
  PhoneCall,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';
import { CompanySettings } from '../types';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, extraData?: any) => void;
  openChat: () => void;
  settings: CompanySettings;
  pendingHumanHandoverCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  openChat,
  settings,
  pendingHumanHandoverCount,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Inicio' },
    { id: 'services', label: 'Servicios & Tarifas' },
    { id: 'projects', label: 'Proyectos Realizados' },
    { id: 'quotation', label: 'Calculadora Presupuestos' },
    { id: 'client-area', label: 'Área de Clientes' },
    { id: 'contact', label: 'Contacto' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md py-2.5 border-b border-slate-200/80'
          : 'bg-white/90 backdrop-blur-sm py-4 border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                INNOVA
              </span>
              <span className="text-xl font-light text-blue-600 ml-1">Proyectos</span>
              <span className="hidden sm:block text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                Obras • Reformas • Climatización
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'text-blue-600 bg-blue-50 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* WhatsApp commercial chat button */}
            <button
              onClick={openChat}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors shadow-xs"
              title="Hablar con Asesor por WhatsApp"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat Asesor</span>
            </button>

            {/* Presupuesto button CTA */}
            <button
              onClick={() => onNavigate('quotation')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-600/25 hover:shadow-lg hover:shadow-blue-600/35 transition-all transform hover:-translate-y-0.5"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Solicitar Presupuesto</span>
            </button>

            {/* Admin Switch */}
            <button
              onClick={() => onNavigate(currentView === 'admin' ? 'home' : 'admin')}
              className={`relative inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                currentView === 'admin'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 hover:text-slate-900'
              }`}
              title="Panel de Administración"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{currentView === 'admin' ? 'Volver a Web' : 'Panel Admin'}</span>
              {pendingHumanHandoverCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce shadow">
                  {pendingHumanHandoverCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => onNavigate(currentView === 'admin' ? 'home' : 'admin')}
              className={`p-2 rounded-lg text-xs font-semibold border ${
                currentView === 'admin'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-slate-200 pb-4 space-y-1 bg-white rounded-2xl p-4 shadow-xl">
            {navLinks.map((link) => {
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    onNavigate(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-blue-600 bg-blue-50 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2 mt-2">
              <button
                onClick={() => {
                  onNavigate('quotation');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Solicitar Presupuesto</span>
              </button>

              <button
                onClick={() => {
                  openChat();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Hablar con Asesor WhatsApp</span>
              </button>

              <button
                onClick={() => {
                  onNavigate('admin');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-800 bg-slate-100 hover:bg-slate-200"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Panel de Administración {pendingHumanHandoverCount > 0 ? `(${pendingHumanHandoverCount} alertas)` : ''}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
