import React, { useState } from 'react';
import {
  Hammer,
  UtensilsCrossed,
  Bath,
  Paintbrush,
  Snowflake,
  Zap,
  DoorClosed,
  CheckCircle2,
  FileSpreadsheet,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Clock,
  Layers,
} from 'lucide-react';
import { ServiceItem } from '../types';

interface ServicesSectionProps {
  services: ServiceItem[];
  onSelectServiceForQuotation: (service: ServiceItem) => void;
  onAskChatbotAboutService: (serviceName: string) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Hammer: <Hammer className="w-5 h-5" />,
  UtensilsCrossed: <UtensilsCrossed className="w-5 h-5" />,
  Bath: <Bath className="w-5 h-5" />,
  Paintbrush: <Paintbrush className="w-5 h-5" />,
  Snowflake: <Snowflake className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  DoorClosed: <DoorClosed className="w-5 h-5" />,
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  onSelectServiceForQuotation,
  onAskChatbotAboutService,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Todos los Servicios' },
    { id: 'Reformas Generales', label: 'Reformas Integrales' },
    { id: 'Estancias Específicas', label: 'Cocinas & Baños' },
    { id: 'Instalaciones Técnicas', label: 'Climatización & Luz' },
    { id: 'Acabados y Decoración', label: 'Pintura & Acabados' },
    { id: 'Carpintería y Cerramientos', label: 'Ventanas & Cerramientos' },
  ];

  const filteredServices = selectedCategory === 'all'
    ? services
    : services.filter((s) => s.category === selectedCategory);

  return (
    <section id="services" className="py-20 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>Nuestros Servicios & Tarifas Transparentes</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Especialistas en cada etapa de tu proyecto
          </h2>
          <p className="text-base text-slate-600">
            Trabajamos con precios de referencia públicos y sin letra pequeña. Todos nuestros presupuestos incluyen visita previa, dirección de obra y 2 años de garantía.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => {
            const icon = ICON_MAP[service.icon] || <Hammer className="w-5 h-5" />;
            return (
              <div
                key={service.id}
                className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image Header with Badge */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
                  
                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md text-[11px] font-bold text-slate-800 shadow-sm">
                    {service.category}
                  </span>

                  {service.popular && (
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-amber-500 text-white text-[11px] font-bold shadow-sm flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Más solicitado
                    </span>
                  )}

                  {/* Price Banner overlay */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-200">Tarifa base desde</span>
                      <div className="text-xl font-black">
                        {service.basePrice} € <span className="text-xs font-normal text-slate-200">/{service.unit}</span>
                      </div>
                    </div>
                    <div className="text-[11px] font-medium text-slate-200 flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs">
                      <Clock className="w-3 h-3 text-cyan-300" />
                      <span>Mín. {service.minUnits} {service.unit}</span>
                    </div>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                        {icon}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {service.name}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Included features list */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Incluye por defecto:
                    </span>
                    {service.includedFeatures.slice(0, 3).map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{feat}</span>
                      </div>
                    ))}
                    {service.includedFeatures.length > 3 && (
                      <p className="text-[11px] text-blue-600 font-medium pl-5">
                        +{service.includedFeatures.length - 3} prestaciones incluidas
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => onSelectServiceForQuotation(service)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm transition-all"
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                      <span>Calcular con este servicio</span>
                    </button>

                    <button
                      onClick={() => onAskChatbotAboutService(service.name)}
                      className="py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-semibold text-xs flex items-center justify-center gap-1 transition-colors"
                      title="Consultar dudas con el Asesor"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Consultar</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-14 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold">¿Tienes un proyecto especial o medidas a medida?</h3>
            <p className="text-sm text-blue-100 max-w-xl">
              Nuestros técnicos calculan partidas especiales como domótica, aislamiento acústico industrial o proyectos comerciales personalizados.
            </p>
          </div>
          <button
            onClick={() => onAskChatbotAboutService('Proyecto a medida especial')}
            className="shrink-0 px-6 py-3 rounded-xl bg-white text-blue-900 hover:bg-blue-50 font-bold text-sm shadow-md flex items-center gap-2 transition-all transform hover:scale-105"
          >
            <span>Preguntar a un Comercial</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
