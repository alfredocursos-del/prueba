import React, { useState } from 'react';
import {
  UserCheck,
  Search,
  FileSpreadsheet,
  Download,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  MessageSquare,
  ShieldAlert,
  ArrowRight,
  Phone,
  Mail,
  Building,
} from 'lucide-react';
import { Quotation, QuotationStatus } from '../types';
import { StorageService } from '../services/storage';

interface ClientPortalProps {
  initialSearch?: string;
  onOpenPDF: (quote: Quotation) => void;
  onOpenChatWithQuote: (quote: Quotation) => void;
  onNavigateToQuotation: () => void;
}

const STATUS_CONFIG: Record<QuotationStatus, { label: string; bg: string; text: string; icon: any }> = {
  pendiente: { label: 'Pendiente de Valoración', bg: 'bg-amber-100', text: 'text-amber-800', icon: Clock },
  en_estudio: { label: 'En Estudio Técnico', bg: 'bg-blue-100', text: 'text-blue-800', icon: AlertCircle },
  aprobado: { label: 'Aprobado / Adjudicado', bg: 'bg-emerald-100', text: 'text-emerald-800', icon: CheckCircle2 },
  en_curso: { label: 'Obra en Ejecución', bg: 'bg-indigo-100', text: 'text-indigo-800', icon: CheckCircle2 },
  facturado: { label: 'Completado & Facturado', bg: 'bg-slate-200', text: 'text-slate-800', icon: CheckCircle2 },
  rechazado: { label: 'Descartado / Expirado', bg: 'bg-rose-100', text: 'text-rose-800', icon: ShieldAlert },
};

export const ClientPortal: React.FC<ClientPortalProps> = ({
  initialSearch = '',
  onOpenPDF,
  onOpenChatWithQuote,
  onNavigateToQuotation,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch || 'elena.morales@consulting.es');
  const [hasSearched, setHasSearched] = useState(true);

  const allQuotes = StorageService.getQuotations();

  // Search by email, phone, or quotation ID
  const filteredQuotes = allQuotes.filter((q) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase().trim().replace(/\s+/g, '');
    const clientPhone = q.client.phone.replace(/\s+/g, '').toLowerCase();
    const clientEmail = q.client.email.toLowerCase();
    const clientName = q.client.name.toLowerCase();
    const quoteId = q.id.toLowerCase();

    return (
      clientPhone.includes(term) ||
      clientEmail.includes(term) ||
      clientName.includes(term) ||
      quoteId.includes(term)
    );
  });

  return (
    <div id="client-area" className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <UserCheck className="w-4 h-4" />
            <span>Área Privada de Clientes</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Consulta el estado de tus presupuestos
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Introduce tu número de teléfono, correo electrónico o referencia de presupuesto para acceder a tus documentos, descargar los PDF oficiales y consultar a tu técnico asignado.
          </p>
        </div>

        {/* Search Bar Card */}
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-200">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setHasSearched(true);
                }}
                placeholder="Teléfono (ej: 622890123), email o ID (PRE-2026-...)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={() => setHasSearched(true)}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-colors"
            >
              Buscar Presupuestos
            </button>
          </div>

          {/* Quick test pills */}
          <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500 overflow-x-auto pb-1">
            <span className="font-semibold text-slate-600 shrink-0">Ejemplos para probar:</span>
            <button
              onClick={() => setSearchTerm('elena.morales@consulting.es')}
              className="underline hover:text-blue-600 shrink-0"
            >
              elena.morales@consulting.es
            </button>
            <span>•</span>
            <button
              onClick={() => setSearchTerm('644 112 998')}
              className="underline hover:text-blue-600 shrink-0"
            >
              644 112 998
            </button>
            <span>•</span>
            <button
              onClick={() => setSearchTerm('PRE-2026-0830')}
              className="underline hover:text-blue-600 shrink-0"
            >
              PRE-2026-0830
            </button>
          </div>
        </div>

        {/* Results List */}
        {hasSearched && (
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-base font-bold text-slate-800">
                Presupuestos encontrados ({filteredQuotes.length})
              </h3>
              <button
                onClick={onNavigateToQuotation}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <span>Solicitar uno nuevo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {filteredQuotes.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
                <FileSpreadsheet className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="text-lg font-bold text-slate-800">No encontramos presupuestos con ese criterio</h4>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  Comprueba que hayas escrito correctamente tu correo o teléfono, o genera tu primer presupuesto online en solo 2 minutos.
                </p>
                <div className="pt-2">
                  <button
                    onClick={onNavigateToQuotation}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md"
                  >
                    Generar Nuevo Presupuesto
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredQuotes.map((quote) => {
                  const statusInfo = STATUS_CONFIG[quote.status] || STATUS_CONFIG.pendiente;
                  const StatusIcon = statusInfo.icon;

                  return (
                    <div
                      key={quote.id}
                      className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/90 hover:border-blue-300 transition-all space-y-5"
                    >
                      {/* Top Bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                            <FileCheck className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-slate-900 text-base">
                                {quote.id}
                              </span>
                              <span
                                className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${statusInfo.bg} ${statusInfo.text}`}
                              >
                                <StatusIcon className="w-3 h-3" />
                                <span>{statusInfo.label}</span>
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {quote.serviceName} • Emitido el {quote.date}
                            </p>
                          </div>
                        </div>

                        {/* Amount */}
                        <div className="sm:text-right">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total con IVA</span>
                          <span className="text-xl sm:text-2xl font-black font-mono text-slate-900">
                            {quote.pricing.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
                          </span>
                        </div>
                      </div>

                      {/* Main Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-slate-50/60 p-4 rounded-2xl border border-slate-100">
                        <div>
                          <span className="text-slate-400 font-semibold block text-[11px]">Cliente / Solicitante</span>
                          <p className="font-bold text-slate-800 mt-0.5">{quote.client.name}</p>
                          {quote.client.company && (
                            <p className="text-slate-600">{quote.client.company}</p>
                          )}
                          <p className="text-slate-500 mt-1">{quote.client.phone}</p>
                        </div>

                        <div>
                          <span className="text-slate-400 font-semibold block text-[11px]">Ubicación del Proyecto</span>
                          <p className="font-medium text-slate-800 mt-0.5">
                            {quote.client.address || 'Ubicación no especificada'}
                          </p>
                          <p className="text-slate-500 mt-1">
                            Superficie: <strong>{quote.specifications.surfaceArea} m²/uds</strong> (Gama{' '}
                            <span className="capitalize">{quote.specifications.qualityLevel}</span>)
                          </p>
                        </div>

                        <div>
                          <span className="text-slate-400 font-semibold block text-[11px]">Asesor Responsable</span>
                          <p className="font-bold text-blue-700 mt-0.5">
                            {quote.assignedCommercial || 'Carlos Méndez'}
                          </p>
                          <p className="text-slate-500 mt-1">
                            Validez hasta: <strong>{quote.validUntil}</strong>
                          </p>
                        </div>
                      </div>

                      {/* Line items snippet */}
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                          Partidas incluidas ({quote.lineItems.length}):
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {quote.lineItems.map((li, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] text-slate-600 font-medium"
                            >
                              {li.name} ({li.total.toLocaleString('es-ES')} €)
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
                        <div className="text-xs text-slate-500 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Garantía de 2 años incluida</span>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button
                            onClick={() => onOpenPDF(quote)}
                            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Descargar PDF Oficial</span>
                          </button>

                          <button
                            onClick={() => onOpenChatWithQuote(quote)}
                            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold text-xs transition-colors"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Consultar Asesor</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
