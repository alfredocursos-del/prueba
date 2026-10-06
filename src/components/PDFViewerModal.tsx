import React from 'react';
import {
  X,
  Printer,
  Download,
  Building2,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  FileCheck,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import { Quotation, CompanySettings } from '../types';

interface PDFViewerModalProps {
  quotation: Quotation | null;
  settings: CompanySettings;
  onClose: () => void;
}

export const PDFViewerModal: React.FC<PDFViewerModalProps> = ({
  quotation,
  settings,
  onClose,
}) => {
  if (!quotation) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(quotation.date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const formattedValidity = new Date(quotation.validUntil).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white print:static print:inset-auto">
      
      {/* Modal Card */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-8 print:border-none print:shadow-none print:rounded-none print:m-0">
        
        {/* Header toolbar (Hidden in print) */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-blue-400" />
            <span className="font-bold text-sm sm:text-base">
              Vista de Impresión / Documento Oficial: {quotation.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm"
              title="Imprimir o Guardar como PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Guardar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet (A4 styling) */}
        <div className="p-8 sm:p-12 text-slate-800 space-y-8 bg-white print:p-8" id="printable-quote">
          
          {/* Top Letterhead */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-200 pb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-slate-900">
                    {settings.name}
                  </h1>
                  <p className="text-xs uppercase tracking-wider font-bold text-blue-600">
                    {settings.tradeName}
                  </p>
                </div>
              </div>

              <div className="text-xs text-slate-500 space-y-0.5 pt-2">
                <p>CIF: <strong className="text-slate-700">{settings.cif}</strong></p>
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{settings.address}, {settings.postalCode} {settings.city}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{settings.phone} / WhatsApp: {settings.whatsappNumber}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{settings.email}</span>
                </p>
              </div>
            </div>

            {/* Document Reference Box */}
            <div className="sm:text-right bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 w-full sm:w-auto">
              <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-black uppercase tracking-wider mb-2">
                PRESUPUESTO FORMAL
              </div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                {quotation.id}
              </div>
              <div className="text-xs text-slate-500 mt-2 space-y-0.5">
                <p>Fecha de emisión: <strong className="text-slate-800">{formattedDate}</strong></p>
                <p>Validez de la oferta: <strong className="text-slate-800">{formattedValidity}</strong></p>
                <p>Asesor comercial: <strong className="text-slate-800">{quotation.assignedCommercial || settings.commercialName}</strong></p>
              </div>
            </div>
          </div>

          {/* Client & Project Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50/80 p-5 rounded-2xl border border-slate-200/90 text-xs">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Datos del Cliente / Titular:
              </span>
              <p className="text-sm font-bold text-slate-900">{quotation.client.name}</p>
              {quotation.client.company && (
                <p className="font-semibold text-slate-700">Empresa: {quotation.client.company}</p>
              )}
              {quotation.client.nif && (
                <p className="text-slate-600">NIF / CIF: {quotation.client.nif}</p>
              )}
              <p className="text-slate-600">Tel: {quotation.client.phone}</p>
              <p className="text-slate-600">Email: {quotation.client.email}</p>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Lugar de la Obra / Intervención:
              </span>
              <p className="text-sm font-semibold text-slate-900">{quotation.client.address || 'Ubicación pendiente de confirmación'}</p>
              <div className="mt-2 space-y-1 text-slate-600">
                <p>
                  Servicio principal: <strong className="text-blue-700">{quotation.serviceName}</strong>
                </p>
                <p>
                  Superficie o unidades estimadas: <strong className="text-slate-800">{quotation.specifications.surfaceArea} m²/uds</strong>
                </p>
                <p>
                  Nivel de calidades: <span className="capitalize font-bold text-slate-800">{quotation.specifications.qualityLevel}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-800 text-slate-900 uppercase font-black tracking-wider text-[11px]">
                  <th className="py-3 px-2">Concepto / Partida Técnica</th>
                  <th className="py-3 px-2 text-center">Cant.</th>
                  <th className="py-3 px-2 text-center">Unidad</th>
                  <th className="py-3 px-2 text-right">Precio Ud.</th>
                  <th className="py-3 px-2 text-right">Importe</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {quotation.lineItems.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-slate-50/50">
                    <td className="py-3 px-2">
                      <div className="font-bold text-slate-900 text-xs sm:text-sm">{item.name}</div>
                      {item.description && (
                        <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{item.description}</div>
                      )}
                    </td>
                    <td className="py-3 px-2 text-center font-semibold text-slate-700">{item.quantity}</td>
                    <td className="py-3 px-2 text-center text-slate-500">{item.unit}</td>
                    <td className="py-3 px-2 text-right text-slate-700 font-mono">
                      {item.unitPrice.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                    </td>
                    <td className="py-3 px-2 text-right font-bold text-slate-900 font-mono">
                      {item.total.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary & Totals */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-4 border-t border-slate-200">
            {/* Notes and Warranty */}
            <div className="text-xs text-slate-600 space-y-2 flex-1 max-w-md">
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-start gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-blue-900 block">Garantía Certificada</span>
                  <p className="text-[11px] text-blue-800">{settings.warrantyPeriod}. Seguro de Responsabilidad Civil hasta 600.000€.</p>
                </div>
              </div>

              {quotation.specifications.notes && (
                <div className="text-slate-600 text-[11px]">
                  <strong>Observaciones del cliente:</strong> {quotation.specifications.notes}
                </div>
              )}

              {quotation.notes && (
                <div className="text-slate-500 text-[11px] italic">
                  <strong>Condiciones especiales:</strong> {quotation.notes}
                </div>
              )}
            </div>

            {/* Calculations Box */}
            <div className="w-full sm:w-72 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal Partidas:</span>
                <span className="font-mono font-medium">
                  {quotation.pricing.subtotal.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                </span>
              </div>

              {quotation.pricing.qualityMultiplier !== 1 && (
                <div className="flex justify-between text-slate-600">
                  <span>Ajuste Calidad ({quotation.specifications.qualityLevel}):</span>
                  <span className="font-mono">
                    {quotation.pricing.qualityMultiplier > 1 ? '+' : ''}
                    {Math.round((quotation.pricing.qualityMultiplier - 1) * 100)}%
                  </span>
                </div>
              )}

              {quotation.pricing.urgencyMultiplier !== 1 && (
                <div className="flex justify-between text-slate-600">
                  <span>Recargo Urgencia ({quotation.specifications.urgency}):</span>
                  <span className="font-mono">
                    +{Math.round((quotation.pricing.urgencyMultiplier - 1) * 100)}%
                  </span>
                </div>
              )}

              {quotation.pricing.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Descuento aplicado ({quotation.pricing.discountPercent}%):</span>
                  <span className="font-mono">
                    -{quotation.pricing.discountAmount.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                  </span>
                </div>
              )}

              <div className="flex justify-between text-slate-700 pt-1 border-t border-slate-200">
                <span>IVA ({quotation.pricing.taxRate}%):</span>
                <span className="font-mono font-medium">
                  {quotation.pricing.taxAmount.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                </span>
              </div>

              <div className="flex justify-between items-baseline pt-2 border-t-2 border-slate-900 text-slate-900">
                <span className="font-black text-sm uppercase">TOTAL PRESUPUESTO:</span>
                <span className="font-black text-xl font-mono text-blue-600">
                  {quotation.pricing.total.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                </span>
              </div>
            </div>
          </div>

          {/* Payment Terms & Signature Section */}
          <div className="pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
            <div>
              <h4 className="font-bold text-slate-900 mb-1.5 uppercase text-[11px] tracking-wider">
                Condiciones de Pago y Ejecución:
              </h4>
              <ul className="text-slate-500 space-y-1 text-[11px] list-disc list-inside">
                <li>30% a la firma del contrato y reserva de materiales.</li>
                <li>40% al 50% de avance de los trabajos de albañilería / instalaciones.</li>
                <li>30% restante a la finalización, limpieza y entrega de llaves.</li>
                <li>Este presupuesto no tiene carácter de factura definitiva hasta su aceptación.</li>
              </ul>
            </div>

            <div className="flex flex-col justify-end">
              <div className="border border-slate-300 rounded-xl p-3 text-center bg-slate-50/50">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-8">
                  Firma y Conformidad del Cliente:
                </span>
                <div className="border-t border-dashed border-slate-400 pt-1 text-[10px] text-slate-600">
                  D/Dña. {quotation.client.name} - En fecha: ___/___/2026
                </div>
              </div>
            </div>
          </div>

          {/* Official Verification Footer */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-400 gap-2">
            <div>
              Documento expedido por el sistema central de presupuestos de {settings.name}. Código hash de verificación: #INNOVA-{quotation.id.replace(/[^0-9]/g, '')}-OK
            </div>
            <div className="font-bold text-slate-500">
              Página 1 de 1
            </div>
          </div>

        </div>

        {/* Footer print action (Hidden in print) */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end gap-3 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200 transition-colors"
          >
            Cerrar Vista
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / Descargar en PDF</span>
          </button>
        </div>

      </div>
    </div>
  );
};
