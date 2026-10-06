import React from 'react';
import {
  FileSpreadsheet,
  MessageSquare,
  ShieldCheck,
  Clock,
  Award,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  Users,
} from 'lucide-react';

interface HeroProps {
  onStartQuotation: () => void;
  onOpenChat: () => void;
  onViewProjects: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onStartQuotation,
  onOpenChat,
  onViewProjects,
}) => {
  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-gradient-to-b from-blue-50/70 via-slate-50 to-white">
      {/* Decorative ambient background elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-blue-400/10 via-cyan-400/15 to-indigo-500/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-12 right-10 w-72 h-72 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200/80 text-blue-800 text-xs sm:text-sm font-semibold shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-ping" />
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Calculadora inteligente de presupuestos & Asesor 24/7</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              Reformas, obras y climatización con{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600">
                presupuesto exacto
              </span>{' '}
              en minutos.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Calcula online tu presupuesto desglosado con tarifas reales de mercado, descarga tu documento en PDF oficial y recibe asesoramiento técnico personalizado a través de nuestro asistente tipo WhatsApp.
            </p>

            {/* Key check points */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs sm:text-sm text-slate-700">
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">Sin compromiso ni costes</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">2 años de garantía legal</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">Descarga PDF inmediata</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <button
                onClick={onStartQuotation}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-base font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 transition-all transform hover:-translate-y-0.5"
              >
                <FileSpreadsheet className="w-5 h-5" />
                <span>Calcular Presupuesto Online</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenChat}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl text-base font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 shadow-sm transition-all"
              >
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                <span>Chat Asesor WhatsApp</span>
              </button>

              <button
                onClick={onViewProjects}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition-colors"
              >
                <span>Ver Proyectos</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            {/* Trust and social proof */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-4 text-xs text-slate-500">
              <div className="flex -space-x-2">
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="Cliente"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                  alt="Cliente"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80"
                  alt="Cliente"
                />
                <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs ring-2 ring-white">
                  +1k
                </div>
              </div>
              <div className="text-left">
                <div className="font-bold text-slate-800">Valoración 4.9/5 estrellas</div>
                <div>Más de 1.200 proyectos entregados con éxito</div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Card Preview */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 shadow-2xl shadow-slate-300/60 border border-slate-200/90 overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Simulador de Presupuesto</h3>
                    <p className="text-[11px] text-slate-500">Estimación en tiempo real</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Instantáneo
                </span>
              </div>

              {/* Sample quick preview */}
              <div className="py-4 space-y-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Servicio Seleccionado</span>
                    <span className="font-bold text-slate-800">Reforma Integral Vivienda</span>
                  </div>
                  <div className="flex justify-between items-center text-xs mt-1.5">
                    <span className="text-slate-500 font-medium">Superficie estimada</span>
                    <span className="font-bold text-blue-600">80 m²</span>
                  </div>
                  <div className="flex justify-between items-center text-xs mt-1.5">
                    <span className="text-slate-500 font-medium">Calidad de materiales</span>
                    <span className="font-semibold text-slate-700">Estándar Homologada</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Partidas y demoliciones:</span>
                    <span>3.600,00 €</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Fontanería, electricidad & solados:</span>
                    <span>16.800,00 €</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Pintura y acabados finales:</span>
                    <span>2.400,00 €</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Descuento web bienvenida (5%):</span>
                    <span>-1.140,00 €</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-dashed border-slate-200 flex justify-between items-end">
                  <div>
                    <span className="text-[11px] uppercase font-bold text-slate-400">Total Estimado + IVA</span>
                    <div className="text-2xl font-black text-slate-900 tracking-tight">
                      26.208,60 <span className="text-sm font-medium text-slate-500">€</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded-md">
                    327 €/m²
                  </span>
                </div>
              </div>

              {/* Call to action inside preview card */}
              <div className="pt-2">
                <button
                  onClick={onStartQuotation}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Personalizar mis medidas y generar PDF</span>
                </button>
              </div>

              {/* Chat teaser footer */}
              <div
                onClick={onOpenChat}
                className="mt-3 bg-emerald-50 hover:bg-emerald-100 cursor-pointer transition-colors p-2.5 rounded-xl border border-emerald-200/80 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <MessageSquare className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-emerald-950">¿Dudas con este cálculo?</p>
                    <p className="text-[10px] text-emerald-700">Carlos, Asesor Comercial está en línea</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
          </div>

        </div>

        {/* Global Key Metrics Bar */}
        <div className="mt-14 pt-8 border-t border-slate-200/70 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-3 rounded-2xl bg-white/60 border border-slate-100">
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-600">+1.250</div>
            <div className="text-xs sm:text-sm font-medium text-slate-600 mt-0.5">Obras & Reformas Realizadas</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/60 border border-slate-100">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">2 Años</div>
            <div className="text-xs sm:text-sm font-medium text-slate-600 mt-0.5">Garantía Escrita por Contrato</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/60 border border-slate-100">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">24 Horas</div>
            <div className="text-xs sm:text-sm font-medium text-slate-600 mt-0.5">Valoración Técnica Gratuita</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/60 border border-slate-100">
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600">100%</div>
            <div className="text-xs sm:text-sm font-medium text-slate-600 mt-0.5">Materiales con Certificado CE</div>
          </div>
        </div>

      </div>
    </section>
  );
};
