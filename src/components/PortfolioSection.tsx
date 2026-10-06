import React, { useState } from 'react';
import {
  Sparkles,
  MapPin,
  Calendar,
  Coins,
  ArrowRight,
  ExternalLink,
  CheckCircle,
  Tag,
  Building,
} from 'lucide-react';
import { ProjectItem } from '../types';

interface PortfolioSectionProps {
  projects: ProjectItem[];
  onRequestSimilarBudget: (category: string) => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  projects,
  onRequestSimilarBudget,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const filters = ['all', 'Residencial', 'Cocinas', 'Baños', 'Locales Comerciales'];

  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter((p) => p.category === activeFilter);

  return (
    <section id="projects" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Galería de Trabajos Recientes</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Proyectos entregados con éxito
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-xl">
              Explora reformas reales con sus presupuestos ejecutados, plazos de entrega y soluciones arquitectónicas implementadas.
            </p>
          </div>

          {/* Filter buttons */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeFilter === filter
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {filter === 'all' ? 'Ver Todos' : filter}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group bg-slate-50 rounded-3xl overflow-hidden border border-slate-200/90 hover:border-blue-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image with Tag Overlays */}
              <div className="relative h-64 sm:h-72 overflow-hidden bg-slate-200">
                <img
                  src={project.mainImage}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                {/* Category & Location Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-xs font-bold">
                    {project.category}
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-white/90 backdrop-blur-md text-slate-800 text-xs font-semibold flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-500" />
                    {project.location}
                  </span>
                </div>

                {/* Budget and duration overlay pill */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                  <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-3">
                    <div>
                      <span className="text-[10px] text-slate-300 uppercase block font-semibold">Presupuesto Real</span>
                      <span className="text-base font-extrabold text-white">
                        {project.budget.toLocaleString('es-ES')} €
                      </span>
                    </div>
                    <div className="h-6 w-px bg-white/20" />
                    <div>
                      <span className="text-[10px] text-slate-300 uppercase block font-semibold">Duración</span>
                      <span className="text-xs font-bold text-cyan-300">{project.duration}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Info */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Highlight callout */}
                  <div className="mt-3 p-3 rounded-xl bg-blue-50/80 border border-blue-100 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-900 font-medium">
                      {project.highlight}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {project.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] font-medium text-slate-600"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer action */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Cliente: <strong className="text-slate-700">{project.client}</strong>
                  </span>

                  <button
                    onClick={() => onRequestSimilarBudget(project.category)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <span>Pedir presupuesto similar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
