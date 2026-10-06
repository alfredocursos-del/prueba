import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  UploadCloud,
  FileText,
  Image as ImageIcon,
  Trash2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Tag,
  Clock,
  Printer,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import {
  ServiceItem,
  QualityLevel,
  UrgencyLevel,
  Quotation,
  QuotationLineItem,
  CompanySettings,
} from '../types';
import { StorageService } from '../services/storage';

interface QuotationAppProps {
  services: ServiceItem[];
  preselectedServiceId?: string;
  onOpenPDF: (quote: Quotation) => void;
  onOpenChatWithQuote: (quote: Quotation) => void;
  onNavigateToClientArea: (clientEmailOrPhone: string) => void;
  settings: CompanySettings;
}

export const QuotationApp: React.FC<QuotationAppProps> = ({
  services,
  preselectedServiceId,
  onOpenPDF,
  onOpenChatWithQuote,
  onNavigateToClientArea,
  settings,
}) => {
  // Client Contact Details
  const [clientName, setClientName] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [clientNif, setClientNif] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientAddress, setClientAddress] = useState('');

  // Service & Technical Specs
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    preselectedServiceId || services[0]?.id || 'reforma-integral'
  );
  const [surfaceArea, setSurfaceArea] = useState<number>(80);
  const [qualityLevel, setQualityLevel] = useState<QualityLevel>('estandar');
  const [urgency, setUrgency] = useState<UrgencyLevel>('normal');
  const [notes, setNotes] = useState<string>('');

  // Optional Add-on line items
  const [includeDemolition, setIncludeDemolition] = useState<boolean>(true);
  const [includeElectricalCertificate, setIncludeElectricalCertificate] = useState<boolean>(true);
  const [includeDeepCleaning, setIncludeDeepCleaning] = useState<boolean>(true);
  const [includeAirzone, setIncludeAirzone] = useState<boolean>(false);

  // Discount & Tax rate
  const [discountCode, setDiscountCode] = useState<string>('PROMO-WEB');
  const [discountApplied, setDiscountApplied] = useState<boolean>(true);
  const [taxRate, setTaxRate] = useState<number>(21); // 21% or 10% (reformas)

  // Uploaded files simulation
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{ id: string; name: string; size: string; type: string }>
  >([
    { id: 'sample-1', name: 'plano_croquis_distribucion.jpg', size: '1.8 MB', type: 'image/jpeg' },
  ]);

  // Created quote state after submission
  const [createdQuote, setCreatedQuote] = useState<Quotation | null>(null);

  useEffect(() => {
    if (preselectedServiceId) {
      setSelectedServiceId(preselectedServiceId);
    }
  }, [preselectedServiceId]);

  const currentService =
    services.find((s) => s.id === selectedServiceId) || services[0];

  // Multipliers based on quality and urgency
  const QUALITY_MULTIPLIERS: Record<QualityLevel, number> = {
    basica: 0.85,
    estandar: 1.0,
    premium: 1.25,
  };

  const URGENCY_MULTIPLIERS: Record<UrgencyLevel, number> = {
    normal: 1.0,
    rapida: 1.1,
    express: 1.2,
  };

  // Build dynamic line items
  const basePricePerUnit = (currentService?.basePrice || 100) * QUALITY_MULTIPLIERS[qualityLevel];
  const mainServiceTotal = basePricePerUnit * surfaceArea;

  const lineItems: QuotationLineItem[] = [
    {
      id: 'li-main',
      name: `${currentService?.name || 'Servicio'} (Gama ${qualityLevel})`,
      description: `Ejecución técnica principal según memoria de calidades ${qualityLevel}. Estimado para ${surfaceArea} ${currentService?.unit || 'm²'}.`,
      quantity: surfaceArea,
      unit: currentService?.unit || 'm²',
      unitPrice: Math.round(basePricePerUnit * 100) / 100,
      total: Math.round(mainServiceTotal * 100) / 100,
    },
  ];

  if (includeDemolition) {
    const demoRate = 28;
    lineItems.push({
      id: 'li-demo',
      name: 'Desescombro, demolición selectiva y tasas de vertedero homologado',
      description: 'Retirada de tabiquería y pavimentos existentes con contenedor ecológico autorizado',
      quantity: surfaceArea,
      unit: currentService?.unit || 'm²',
      unitPrice: demoRate,
      total: Math.round(demoRate * surfaceArea),
    });
  }

  if (includeElectricalCertificate) {
    lineItems.push({
      id: 'li-cert',
      name: 'Certificado de Instalación Eléctrica oficial (CIE) y dirección técnica',
      description: 'Emisión de boletín oficial firmado por instalador autorizado ante el Ministerio de Industria',
      quantity: 1,
      unit: 'ud',
      unitPrice: 380,
      total: 380,
    });
  }

  if (includeDeepCleaning) {
    lineItems.push({
      id: 'li-clean',
      name: 'Limpieza técnica profunda fin de obra',
      description: 'Aspirado con filtro HEPA, desengrasado de cristalería y desinfección de superficies para entrega de llaves',
      quantity: 1,
      unit: 'ud',
      unitPrice: 250,
      total: 250,
    });
  }

  if (includeAirzone) {
    lineItems.push({
      id: 'li-airzone',
      name: 'Climatización zonificada por estancias con termostatos inteligentes Airzone',
      description: 'Zonificación digital independiente con control wifi individual desde smartphone',
      quantity: 1,
      unit: 'ud',
      unitPrice: 1850,
      total: 1850,
    });
  }

  // Calculate pricing
  const subtotal = lineItems.reduce((acc, curr) => acc + curr.total, 0);
  const urgencyMultiplier = URGENCY_MULTIPLIERS[urgency];
  const urgencyAdjustedSubtotal = subtotal * urgencyMultiplier;

  let discountPercent = 0;
  if (discountApplied) {
    discountPercent = 5; // 5% discount for promo code
  }
  const discountAmount = Math.round((urgencyAdjustedSubtotal * (discountPercent / 100)) * 100) / 100;
  const taxableAmount = urgencyAdjustedSubtotal - discountAmount;
  const taxAmount = Math.round((taxableAmount * (taxRate / 100)) * 100) / 100;
  const grandTotal = Math.round((taxableAmount + taxAmount) * 100) / 100;

  // File upload handler
  const handleSimulateFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      const newItems = filesArray.map((file, idx) => ({
        id: `file-${Date.now()}-${idx}`,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        type: file.type,
      }));
      setUploadedFiles((prev) => [...prev, ...newItems]);
    }
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // Submit and create official Quotation
  const handleGenerateQuotation = (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientName.trim() || !clientPhone.trim() || !clientEmail.trim()) {
      alert('Por favor, completa al menos tu Nombre, Teléfono y Email para poder generar el presupuesto formal.');
      return;
    }

    const newQuoteData: Omit<Quotation, 'id' | 'createdAt' | 'updatedAt'> = {
      date: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      client: {
        name: clientName,
        company: clientCompany || undefined,
        phone: clientPhone,
        email: clientEmail,
        address: clientAddress || 'Dirección de obra no especificada',
        nif: clientNif || undefined,
      },
      serviceId: currentService?.id || 'reforma-integral',
      serviceName: currentService?.name || 'Reforma y Obras',
      lineItems,
      specifications: {
        surfaceArea,
        qualityLevel,
        urgency,
        notes,
      },
      attachedFiles: uploadedFiles,
      pricing: {
        subtotal,
        qualityMultiplier: QUALITY_MULTIPLIERS[qualityLevel],
        urgencyMultiplier,
        discountPercent,
        discountCode: discountApplied ? discountCode : undefined,
        discountAmount,
        taxRate,
        taxAmount,
        total: grandTotal,
      },
      status: 'pendiente',
      notes: 'Presupuesto emitido a través del calculador online. Validez por 30 días naturales.',
      assignedCommercial: settings.commercialName,
    };

    const saved = StorageService.addQuotation(newQuoteData);
    setCreatedQuote(saved);
  };

  return (
    <div id="quotation" className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <FileSpreadsheet className="w-4 h-4" />
            <span>Generador de Presupuestos Oficial</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Configura y calcula tu presupuesto al instante
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Introduce las medidas y características de tu proyecto para obtener un desglose transparente y generar tu PDF profesional oficial.
          </p>
        </div>

        {/* If Quote was already created, show confirmation banner */}
        {createdQuote ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-emerald-200 text-center space-y-6 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2 max-w-xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                ¡Presupuesto #{createdQuote.id} Generado con Éxito!
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Tu propuesta técnica está lista
              </h3>
              <p className="text-sm text-slate-600">
                Hemos registrado tu presupuesto formal para <strong>{createdQuote.client.name}</strong> por un importe total de{' '}
                <strong className="text-blue-600 font-mono text-lg">
                  {createdQuote.pricing.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
                </strong>{' '}
                (IVA incluido).
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                onClick={() => onOpenPDF(createdQuote)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all transform hover:-translate-y-0.5"
              >
                <Printer className="w-4 h-4" />
                <span>Ver y Descargar PDF Oficial</span>
              </button>

              <button
                onClick={() => onOpenChatWithQuote(createdQuote)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold text-sm transition-all"
              >
                <span>Consultar con Asesor WhatsApp</span>
              </button>

              <button
                onClick={() => onNavigateToClientArea(createdQuote.client.email || createdQuote.client.phone)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm transition-all"
              >
                <span>Ir a mi Área de Cliente</span>
              </button>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <button
                onClick={() => setCreatedQuote(null)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Crear otro presupuesto nuevo</span>
              </button>
            </div>
          </div>
        ) : (
          /* Form Layout */
          <form onSubmit={handleGenerateQuotation} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Form Fields */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Step 1: Customer & Company Data */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/90 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Tus Datos y Contacto
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nombre Completo *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Ej. Laura Gómez Martín"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Empresa o Negocio (opcional)
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={clientCompany}
                        onChange={(e) => setClientCompany(e.target.value)}
                        placeholder="Ej. Gómez Arquitectos S.L."
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Teléfono Móvil (WhatsApp) *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        required
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="+34 600 000 000"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Correo Electrónico *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        placeholder="laura@ejemplo.es"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Dirección o Localidad de la Obra / Inmueble
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={clientAddress}
                        onChange={(e) => setClientAddress(e.target.value)}
                        placeholder="Ej. Calle Mayor 12, 3º Izq - Madrid"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Service & Characteristics */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/90 space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Servicio, Medidas y Características
                  </h3>
                </div>

                {/* Service Selector Dropdown / Cards */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Servicio Principal Requerido
                  </label>
                  <select
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {services.map((svc) => (
                      <option key={svc.id} value={svc.id}>
                        {svc.name} — desde {svc.basePrice} €/{svc.unit} ({svc.category})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quantities Slider / Input */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">
                        Superficie o Cantidad ({currentService?.unit || 'm²'})
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Mínimo recomendado: {currentService?.minUnits || 10} {currentService?.unit}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="1"
                        max="2000"
                        value={surfaceArea}
                        onChange={(e) => setSurfaceArea(Math.max(1, Number(e.target.value)))}
                        className="w-24 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm font-bold text-right font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-xs font-bold text-slate-600">{currentService?.unit}</span>
                    </div>
                  </div>

                  <input
                    type="range"
                    min="5"
                    max="300"
                    step="5"
                    value={surfaceArea}
                    onChange={(e) => setSurfaceArea(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                {/* Quality Level Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Nivel de Calidades y Acabados de Materiales
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { id: 'basica', label: 'Económica', desc: 'Funcional y duradera (-15%)' },
                      { id: 'estandar', label: 'Estándar', desc: 'Primera calidad y equilibrio' },
                      { id: 'premium', label: 'Premium', desc: 'Marcas de lujo y diseño (+25%)' },
                    ].map((lvl) => (
                      <button
                        type="button"
                        key={lvl.id}
                        onClick={() => setQualityLevel(lvl.id as QualityLevel)}
                        className={`p-3 rounded-2xl text-left border transition-all ${
                          qualityLevel === lvl.id
                            ? 'border-blue-600 bg-blue-50/80 shadow-xs ring-1 ring-blue-600'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <span className={`block text-xs font-bold ${qualityLevel === lvl.id ? 'text-blue-700' : 'text-slate-800'}`}>
                          {lvl.label}
                        </span>
                        <span className="block text-[10px] text-slate-500 mt-0.5 leading-tight">
                          {lvl.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Urgency Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Plazo de Ejecución Deseado
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { id: 'normal', label: 'Planificado (30d)', desc: 'Tarifa regular' },
                      { id: 'rapida', label: 'Rápido (15d)', desc: '+10% recargo turno' },
                      { id: 'express', label: 'Express Inmediato', desc: '+20% cuadrilla doble' },
                    ].map((urg) => (
                      <button
                        type="button"
                        key={urg.id}
                        onClick={() => setUrgency(urg.id as UrgencyLevel)}
                        className={`p-3 rounded-2xl text-left border transition-all ${
                          urgency === urg.id
                            ? 'border-indigo-600 bg-indigo-50/80 shadow-xs ring-1 ring-indigo-600'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <span className={`block text-xs font-bold ${urgency === urg.id ? 'text-indigo-700' : 'text-slate-800'}`}>
                          {urg.label}
                        </span>
                        <span className="block text-[10px] text-slate-500 mt-0.5 leading-tight">
                          {urg.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Checkbox Partidas Adicionales */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="block text-xs font-bold text-slate-700">
                    Partidas Técnicas Adicionales Recomendadas:
                  </span>
                  
                  <label className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeDemolition}
                      onChange={(e) => setIncludeDemolition(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 accent-blue-600"
                    />
                    <div className="text-xs text-slate-700">
                      <span className="font-semibold">Demolición previa, desescombro y gestión de residuos</span> (+28€/m²)
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeElectricalCertificate}
                      onChange={(e) => setIncludeElectricalCertificate(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 accent-blue-600"
                    />
                    <div className="text-xs text-slate-700">
                      <span className="font-semibold">Boletín Oficial Eléctrico (CIE) visado</span> (+380€)
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeDeepCleaning}
                      onChange={(e) => setIncludeDeepCleaning(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 accent-blue-600"
                    />
                    <div className="text-xs text-slate-700">
                      <span className="font-semibold">Limpieza técnica profunda fin de obra</span> (+250€)
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeAirzone}
                      onChange={(e) => setIncludeAirzone(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 accent-blue-600"
                    />
                    <div className="text-xs text-slate-700">
                      <span className="font-semibold">Sistema de zonificación por estancias Airzone</span> (+1.850€)
                    </div>
                  </label>
                </div>

              </div>

              {/* Step 3: Observations & Files */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/90 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Observaciones y Archivos / Fotos
                  </h3>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Observaciones y requerimientos especiales
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ej. Es un 3º piso con ascensor pequeño. Queremos suelo radiante y tirar el tabique entre cocina y salón."
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Drag and Drop File Upload Area */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Adjuntar planos, croquis o fotos del estado actual
                  </label>
                  <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-blue-50/20">
                    <UploadCloud className="w-8 h-8 text-blue-500 mb-2" />
                    <span className="text-xs font-bold text-slate-800">
                      Haz clic para subir o arrastra archivos aquí
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5">
                      JPG, PNG o PDF (hasta 15 MB)
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*,application/pdf"
                      onChange={handleSimulateFileUpload}
                      className="hidden"
                    />
                  </label>

                  {/* Uploaded files list */}
                  {uploadedFiles.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {uploadedFiles.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            {file.type.includes('image') ? (
                              <ImageIcon className="w-4 h-4 text-blue-500 shrink-0" />
                            ) : (
                              <FileText className="w-4 h-4 text-rose-500 shrink-0" />
                            )}
                            <span className="font-medium text-slate-800 truncate">{file.name}</span>
                            <span className="text-[10px] text-slate-400">({file.size})</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(file.id)}
                            className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>

            {/* Right Column: Live Calculation Summary & Generate Button */}
            <div className="lg:col-span-5 sticky top-24 space-y-4">
              <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-200/90 space-y-5">
                
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Resumen en Tiempo Real</h4>
                      <p className="text-[11px] text-slate-500">Cálculo dinámico automático</p>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    Precios 2026
                  </span>
                </div>

                {/* Line items preview */}
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1 text-xs">
                  {lineItems.map((li) => (
                    <div key={li.id} className="flex justify-between items-start gap-2 py-1 border-b border-slate-50">
                      <div className="text-slate-700 flex-1">
                        <span className="font-medium line-clamp-1">{li.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {li.quantity} {li.unit} x {li.unitPrice.toLocaleString('es-ES')} €
                        </span>
                      </div>
                      <span className="font-mono font-bold text-slate-900 shrink-0">
                        {li.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
                      </span>
                    </div>
                  ))}
                </div>

                {/* Tax Rate & Coupon Code */}
                <div className="pt-2 border-t border-slate-100 space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Tipo de IVA aplicable:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setTaxRate(21)}
                        className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all ${
                          taxRate === 21
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        21% General
                      </button>
                      <button
                        type="button"
                        onClick={() => setTaxRate(10)}
                        className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all ${
                          taxRate === 10
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        10% Reducido (Vivienda)
                      </button>
                    </div>
                  </div>

                  {/* Promo code */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Cupón de descuento:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono uppercase"
                        placeholder="PROMO-WEB"
                      />
                      <button
                        type="button"
                        onClick={() => setDiscountApplied(!discountApplied)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                          discountApplied
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {discountApplied ? 'Aplicado -5%' : 'Aplicar'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Subtotals & Grand Total */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal partidas:</span>
                    <span className="font-mono">{subtotal.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €</span>
                  </div>

                  {urgencyMultiplier > 1 && (
                    <div className="flex justify-between text-indigo-700 font-medium">
                      <span>Recargo plazo {urgency}:</span>
                      <span className="font-mono">+{Math.round((urgencyMultiplier - 1) * 100)}%</span>
                    </div>
                  )}

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Descuento web ({discountPercent}%):</span>
                      <span className="font-mono">-{discountAmount.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-200">
                    <span>IVA ({taxRate}%):</span>
                    <span className="font-mono">{taxAmount.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €</span>
                  </div>

                  <div className="pt-2 border-t-2 border-slate-900 flex justify-between items-baseline">
                    <span className="font-black text-sm uppercase text-slate-900">Total Presupuesto:</span>
                    <span className="text-2xl font-black font-mono text-blue-600">
                      {grandTotal.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
                    </span>
                  </div>
                </div>

                {/* Submission CTA */}
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-blue-600/30 hover:shadow-blue-600/40 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <FileSpreadsheet className="w-5 h-5" />
                  <span>Generar Presupuesto & PDF Oficial</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 text-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Sin compromiso • Descarga inmediata en PDF • 2 años garantía</span>
                </div>

              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
