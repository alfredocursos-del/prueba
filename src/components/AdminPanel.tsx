import React, { useState, useEffect } from 'react';
import {
  SlidersHorizontal,
  Users,
  MessageSquare,
  FileSpreadsheet,
  Coins,
  PlusCircle,
  Download,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Send,
  Building,
  Phone,
  Mail,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Tag,
  ShieldCheck,
  Building2,
  ArrowUpRight,
  ExternalLink,
} from 'lucide-react';
import {
  Quotation,
  QuotationStatus,
  CustomerLead,
  ChatConversation,
  ServiceItem,
  ContactMessage,
  CompanySettings,
} from '../types';
import { StorageService } from '../services/storage';

interface AdminPanelProps {
  onOpenPDF: (quote: Quotation) => void;
  onNavigateHome: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onOpenPDF, onNavigateHome }) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'quotations' | 'customers' | 'chats' | 'catalog' | 'contacts' | 'settings'
  >('quotations');

  // Storage states
  const [quotations, setQuotations] = useState<Quotation[]>(StorageService.getQuotations());
  const [customers, setCustomers] = useState<CustomerLead[]>(StorageService.getCustomers());
  const [conversations, setConversations] = useState<ChatConversation[]>(StorageService.getConversations());
  const [services, setServices] = useState<ServiceItem[]>(StorageService.getServices());
  const [contacts, setContacts] = useState<ContactMessage[]>(StorageService.getContactMessages());
  const [settings, setSettings] = useState<CompanySettings>(StorageService.getSettings());

  // Filters & searches
  const [quoteSearch, setQuoteSearch] = useState('');
  const [quoteStatusFilter, setQuoteStatusFilter] = useState<string>('all');
  const [selectedChat, setSelectedChat] = useState<ChatConversation | null>(conversations[0] || null);
  const [humanAgentReply, setHumanAgentReply] = useState('');

  // Editing state for Quotations
  const [editingQuote, setEditingQuote] = useState<Quotation | null>(null);

  // New Service Modal state
  const [showNewServiceModal, setShowNewServiceModal] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState('Reformas Generales');
  const [newServicePrice, setNewServicePrice] = useState(150);
  const [newServiceUnit, setNewServiceUnit] = useState('m²');
  const [newServiceDesc, setNewServiceDesc] = useState('');

  // Sync with storage events
  const reloadData = () => {
    setQuotations(StorageService.getQuotations());
    setCustomers(StorageService.getCustomers());
    setConversations(StorageService.getConversations());
    setServices(StorageService.getServices());
    setContacts(StorageService.getContactMessages());
    setSettings(StorageService.getSettings());
  };

  useEffect(() => {
    const handleStorageUpdate = () => reloadData();
    window.addEventListener('innova_storage_update', handleStorageUpdate);
    return () => window.removeEventListener('innova_storage_update', handleStorageUpdate);
  }, []);

  // Update Quotation Status
  const handleStatusChange = (id: string, newStatus: QuotationStatus) => {
    const quote = quotations.find((q) => q.id === id);
    if (quote) {
      const updated = { ...quote, status: newStatus };
      StorageService.updateQuotation(updated);
      reloadData();
    }
  };

  // Delete Quotation
  const handleDeleteQuotation = (id: string) => {
    if (confirm(`¿Estás seguro de eliminar el presupuesto ${id}?`)) {
      StorageService.deleteQuotation(id);
      reloadData();
    }
  };

  // Save modified quotation
  const handleSaveEditedQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuote) return;
    StorageService.updateQuotation(editingQuote);
    setEditingQuote(null);
    reloadData();
  };

  // Handle human reply in Chat
  const handleSendAgentReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChat || !humanAgentReply.trim()) return;

    const newMsg = {
      id: `agent-${Date.now()}`,
      sender: 'assistant' as const,
      content: `[Comercial ${settings.commercialName}]: ${humanAgentReply}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updated = {
      ...selectedChat,
      status: 'human_active' as const,
      messages: [...selectedChat.messages, newMsg],
      lastActivity: new Date().toISOString(),
    };

    StorageService.saveCurrentConversation(updated);
    setSelectedChat(updated);
    setHumanAgentReply('');
    reloadData();
  };

  // Mark chat as resolved
  const handleResolveChat = (chatId: string) => {
    const conv = conversations.find((c) => c.id === chatId);
    if (conv) {
      const updated = { ...conv, status: 'resolved' as const };
      StorageService.saveCurrentConversation(updated);
      setSelectedChat(updated);
      reloadData();
    }
  };

  // Create new service
  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;

    const newSvc: ServiceItem = {
      id: `svc-${Date.now()}`,
      name: newServiceName,
      category: newServiceCategory,
      shortDesc: newServiceDesc.slice(0, 100),
      description: newServiceDesc || 'Servicio especializado con materiales de calidad y garantía.',
      unit: newServiceUnit,
      basePrice: Number(newServicePrice),
      minUnits: 10,
      estimatedDaysPerUnit: 0.1,
      icon: 'Hammer',
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80',
      includedFeatures: [
        'Mano de obra especializada con garantía',
        'Materiales homologados con certificación CE',
        'Limpieza fin de obra',
      ],
    };

    StorageService.updateService(newSvc);
    setShowNewServiceModal(false);
    setNewServiceName('');
    setNewServiceDesc('');
    reloadData();
  };

  // Quick price update for existing service
  const handleUpdateServicePrice = (id: string, newPrice: number) => {
    const svc = services.find((s) => s.id === id);
    if (svc) {
      StorageService.updateService({ ...svc, basePrice: newPrice });
      reloadData();
    }
  };

  // Delete service
  const handleDeleteService = (id: string) => {
    if (confirm('¿Eliminar este servicio del catálogo?')) {
      StorageService.deleteService(id);
      reloadData();
    }
  };

  // Save company settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.saveSettings(settings);
    alert('Configuración de empresa guardada con éxito.');
  };

  // Computed KPIs
  const totalBudgeted = quotations.reduce((acc, q) => acc + q.pricing.total, 0);
  const pendingCount = quotations.filter((q) => q.status === 'pendiente' || q.status === 'en_estudio').length;
  const humanRequestsCount = conversations.filter((c) => c.status === 'human_requested').length;

  // Filtered quotes
  const filteredQuotations = quotations.filter((q) => {
    const matchesSearch =
      q.id.toLowerCase().includes(quoteSearch.toLowerCase()) ||
      q.client.name.toLowerCase().includes(quoteSearch.toLowerCase()) ||
      q.client.phone.includes(quoteSearch) ||
      q.serviceName.toLowerCase().includes(quoteSearch.toLowerCase());

    const matchesStatus = quoteStatusFilter === 'all' || q.status === quoteStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="pt-24 pb-20 bg-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header Admin Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-xs font-bold uppercase tracking-wider">
                Panel de Control Interno
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {settings.tradeName}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Administración Comercial & Operativa
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateHome}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Volver a la Web Pública
            </button>
            <button
              onClick={() => StorageService.resetAll()}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
              title="Restablecer todos los datos iniciales de demostración"
            >
              Resetear Datos Demo
            </button>
          </div>
        </div>

        {/* Global KPIs Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex justify-between items-center text-slate-500 text-xs font-medium">
              <span>Total Presupuestado</span>
              <Coins className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2 font-mono">
              {totalBudgeted.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} €
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              En {quotations.length} presupuestos generados
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex justify-between items-center text-slate-500 text-xs font-medium">
              <span>Pendientes / En Estudio</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-600 mt-2">
              {pendingCount}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Requieren seguimiento o visita técnica
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex justify-between items-center text-slate-500 text-xs font-medium">
              <span>Alertas Chatbot Humano</span>
              <MessageSquare className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-2xl font-black text-rose-600 mt-2 flex items-center gap-2">
              <span>{humanRequestsCount}</span>
              {humanRequestsCount > 0 && (
                <span className="text-xs bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full animate-pulse">
                  Urgente
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Clientes que han pedido llamada/asesor
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex justify-between items-center text-slate-500 text-xs font-medium">
              <span>Clientes Registrados</span>
              <Users className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-600 mt-2">
              {customers.length}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Base de datos activa de contactos
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-slate-200 overflow-x-auto pb-1">
          {[
            { id: 'quotations', label: `Presupuestos (${quotations.length})`, icon: FileSpreadsheet },
            { id: 'customers', label: `Clientes (${customers.length})`, icon: Users },
            { id: 'chats', label: `Conversaciones Chat (${conversations.length})`, icon: MessageSquare, badge: humanRequestsCount },
            { id: 'catalog', label: `Catálogo & Precios (${services.length})`, icon: Tag },
            { id: 'contacts', label: `Solicitudes Web (${contacts.length})`, icon: Mail },
            { id: 'settings', label: 'Ajustes de Empresa', icon: SlidersHorizontal },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-200/80 hover:text-slate-900 border border-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && tab.badge > 0 ? (
                  <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                    {tab.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* TAB 1: PRESUPUESTOS */}
        {activeTab === 'quotations' && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-5">
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="relative flex-1 w-full sm:w-auto">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={quoteSearch}
                  onChange={(e) => setQuoteSearch(e.target.value)}
                  placeholder="Buscar por ID, cliente, teléfono o servicio..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={quoteStatusFilter}
                  onChange={(e) => setQuoteStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-800 focus:outline-none"
                >
                  <option value="all">Todos los estados</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="en_estudio">En Estudio</option>
                  <option value="aprobado">Aprobado</option>
                  <option value="en_curso">En Curso</option>
                  <option value="facturado">Facturado</option>
                  <option value="rechazado">Rechazado</option>
                </select>
              </div>
            </div>

            {/* Quotations Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                    <th className="py-3 px-3">Presupuesto</th>
                    <th className="py-3 px-3">Cliente</th>
                    <th className="py-3 px-3">Servicio & Partidas</th>
                    <th className="py-3 px-3">Importe Total</th>
                    <th className="py-3 px-3 text-center">Estado</th>
                    <th className="py-3 px-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredQuotations.map((quote) => (
                    <tr key={quote.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-3">
                        <span className="font-extrabold text-slate-900 block text-xs">
                          {quote.id}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {quote.date} • Vence: {quote.validUntil}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-800">{quote.client.name}</div>
                        {quote.client.company && (
                          <div className="text-[11px] text-slate-500 font-medium">{quote.client.company}</div>
                        )}
                        <div className="text-[11px] text-slate-500">{quote.client.phone}</div>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-blue-700">{quote.serviceName}</div>
                        <div className="text-[11px] text-slate-500">
                          {quote.specifications.surfaceArea} m²/uds • {quote.lineItems.length} partidas
                        </div>
                      </td>

                      <td className="py-3.5 px-3 font-mono font-bold text-slate-900 text-sm">
                        {quote.pricing.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        <select
                          value={quote.status}
                          onChange={(e) => handleStatusChange(quote.id, e.target.value as QuotationStatus)}
                          className={`text-xs font-bold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                            quote.status === 'aprobado'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : quote.status === 'en_estudio'
                              ? 'bg-blue-50 text-blue-800 border-blue-300'
                              : quote.status === 'pendiente'
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : quote.status === 'facturado'
                              ? 'bg-slate-100 text-slate-800 border-slate-300'
                              : 'bg-rose-50 text-rose-800 border-rose-300'
                          }`}
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="en_estudio">En Estudio</option>
                          <option value="aprobado">Aprobado</option>
                          <option value="en_curso">En Curso</option>
                          <option value="facturado">Facturado</option>
                          <option value="rechazado">Rechazado</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenPDF(quote)}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Ver / Descargar PDF Oficial"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingQuote(quote)}
                            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                            title="Modificar presupuesto"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteQuotation(quote.id)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: CLIENTES */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-lg">Directorio de Clientes & Oportunidades</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                    <th className="py-3 px-3">Cliente / Razón Social</th>
                    <th className="py-3 px-3">Contacto</th>
                    <th className="py-3 px-3">Dirección</th>
                    <th className="py-3 px-3">Presupuestos</th>
                    <th className="py-3 px-3">Total Acumulado</th>
                    <th className="py-3 px-3">Notas Internas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 text-xs sm:text-sm">{c.name}</div>
                        {c.company && <div className="text-[11px] text-slate-500">{c.company}</div>}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800">{c.phone}</div>
                        <div className="text-[11px] text-slate-500">{c.email}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-600 max-w-xs truncate">
                        {c.address || '—'}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-700">
                        {c.totalQuotations} presupuesto(s)
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">
                        {c.totalAmount.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
                      </td>
                      <td className="py-3 px-3 text-slate-500 text-[11px] max-w-xs">
                        {c.notes || 'Sin notas'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: CONVERSACIONES CHATBOT & ATENCIÓN HUMANA */}
        {activeTab === 'chats' && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
              
              {/* Left Chat List */}
              <div className="lg:col-span-4 border-r border-slate-200 pr-4 space-y-2">
                <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">Bandeja de Conversaciones</span>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                    {conversations.length}
                  </span>
                </div>

                <div className="space-y-2 max-h-[460px] overflow-y-auto">
                  {conversations.map((conv) => {
                    const isSelected = selectedChat?.id === conv.id;
                    const isHandover = conv.status === 'human_requested';

                    return (
                      <div
                        key={conv.id}
                        onClick={() => setSelectedChat(conv)}
                        className={`p-3 rounded-2xl cursor-pointer border transition-all ${
                          isSelected
                            ? 'bg-blue-50/80 border-blue-300 ring-1 ring-blue-400'
                            : isHandover
                            ? 'bg-rose-50/60 border-rose-200 hover:bg-rose-100/50'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-xs text-slate-900 truncate">
                            {conv.customerName || 'Visitante Web'}
                          </h4>
                          {isHandover ? (
                            <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded animate-pulse">
                              Llamada Pedida
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">
                              {conv.messages.length} msgs
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-600 line-clamp-1 mt-1">
                          {conv.messages[conv.messages.length - 1]?.content || 'Sin mensajes'}
                        </p>

                        {conv.customerPhone && (
                          <div className="text-[10px] font-medium text-blue-700 mt-1">
                            Tel: {conv.customerPhone}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Chat Details & Take Over */}
              <div className="lg:col-span-8 flex flex-col justify-between pl-2">
                {selectedChat ? (
                  <>
                    <div>
                      {/* Chat Header */}
                      <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                              {selectedChat.customerName || 'Visitante'}
                            </h3>
                            {selectedChat.status === 'human_requested' && (
                              <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 font-bold text-[10px]">
                                Alerta: Requiere Atención Humana
                              </span>
                            )}
                          </div>
                          {selectedChat.customerPhone && (
                            <p className="text-xs text-slate-500 font-medium mt-0.5">
                              Teléfono: <strong className="text-slate-800">{selectedChat.customerPhone}</strong>
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => handleResolveChat(selectedChat.id)}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition-colors"
                        >
                          Marcar como Atendido
                        </button>
                      </div>

                      {/* Chat Messages Log */}
                      <div className="py-4 space-y-2.5 max-h-[340px] overflow-y-auto pr-2">
                        {selectedChat.messages.map((m) => (
                          <div
                            key={m.id}
                            className={`p-3 rounded-2xl text-xs max-w-[85%] ${
                              m.sender === 'user'
                                ? 'bg-slate-100 text-slate-800 ml-auto'
                                : 'bg-blue-50 text-blue-950 border border-blue-100 mr-auto'
                            }`}
                          >
                            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mb-1">
                              <span>{m.sender === 'user' ? 'Cliente' : 'Asesor / Bot'}</span>
                              <span>{m.timestamp}</span>
                            </div>
                            <p className="whitespace-pre-line">{m.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Agent Takeover Input Form */}
                    <form onSubmit={handleSendAgentReply} className="pt-3 border-t border-slate-200 flex gap-2">
                      <input
                        type="text"
                        value={humanAgentReply}
                        onChange={(e) => setHumanAgentReply(e.target.value)}
                        placeholder={`Escribe como comercial (${settings.commercialName})...`}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Responder en vivo</span>
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400 text-xs">
                    Selecciona una conversación del listado
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: CATÁLOGO Y PRECIOS */}
        {activeTab === 'catalog' && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">Catálogo de Servicios & Precios Base</h3>
                <p className="text-xs text-slate-500">
                  Modifica las tarifas unitarias en tiempo real para que se reflejen de inmediato en la calculadora y en las respuestas del asesor.
                </p>
              </div>

              <button
                onClick={() => setShowNewServiceModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Añadir Nuevo Servicio</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((svc) => (
                <div
                  key={svc.id}
                  className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold uppercase text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {svc.category}
                      </span>
                      <button
                        onClick={() => handleDeleteService(svc.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Eliminar del catálogo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm mt-2">{svc.name}</h4>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">{svc.description}</p>
                  </div>

                  {/* Interactive Price Input */}
                  <div className="pt-3 border-t border-slate-200/80 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Precio base ({svc.unit})
                      </span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <input
                          type="number"
                          value={svc.basePrice}
                          onChange={(e) => handleUpdateServicePrice(svc.id, Number(e.target.value))}
                          className="w-20 px-2 py-1 bg-white border border-slate-300 rounded font-mono font-bold text-xs focus:ring-1 focus:ring-blue-500"
                        />
                        <span className="text-xs font-semibold text-slate-700">€/{svc.unit}</span>
                      </div>
                    </div>

                    <span className="text-[10px] text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded-full">
                      Activo
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SOLICITUDES DE CONTACTO WEB */}
        {activeTab === 'contacts' && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-lg">Mensajes y Solicitudes desde Formulario Web</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                    <th className="py-3 px-3">Remitente</th>
                    <th className="py-3 px-3">Contacto</th>
                    <th className="py-3 px-3">Asunto</th>
                    <th className="py-3 px-3">Mensaje</th>
                    <th className="py-3 px-3">Fecha</th>
                    <th className="py-3 px-3 text-right">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {contacts.map((msg) => (
                    <tr key={msg.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-3 font-bold text-slate-900">{msg.name}</td>
                      <td className="py-3 px-3">
                        <div className="text-slate-800 font-medium">{msg.phone}</div>
                        <div className="text-slate-400 text-[11px]">{msg.email}</div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-blue-700">{msg.subject}</td>
                      <td className="py-3 px-3 text-slate-600 max-w-sm">{msg.message}</td>
                      <td className="py-3 px-3 text-slate-400 text-[11px]">
                        {new Date(msg.date).toLocaleDateString('es-ES')}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <select
                          value={msg.status}
                          onChange={(e) => {
                            StorageService.updateContactMessageStatus(msg.id, e.target.value as any);
                            reloadData();
                          }}
                          className="text-[11px] font-bold px-2 py-1 rounded border bg-slate-50 text-slate-800"
                        >
                          <option value="no_leido">No leído</option>
                          <option value="contactado">Contactado</option>
                          <option value="archivado">Archivado</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: AJUSTES DE EMPRESA */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 max-w-3xl space-y-6">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Configuración Legal y Comercial de la Empresa</h3>
              <p className="text-xs text-slate-500">
                Estos datos aparecen impresos en la cabecera de los presupuestos en PDF, pie de página y firma oficial.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Razón Social Legal</label>
                <input
                  type="text"
                  value={settings.name}
                  onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nombre Comercial de Marca</label>
                <input
                  type="text"
                  value={settings.tradeName}
                  onChange={(e) => setSettings({ ...settings, tradeName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">NIF / CIF</label>
                <input
                  type="text"
                  value={settings.cif}
                  onChange={(e) => setSettings({ ...settings, cif: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Teléfono Principal</label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Número de WhatsApp Comercial</label>
                <input
                  type="text"
                  value={settings.whatsappNumber}
                  onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Corporativo</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Dirección Fiscal / Sede</label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nombre Asesor Comercial Asignado</label>
                <input
                  type="text"
                  value={settings.commercialName}
                  onChange={(e) => setSettings({ ...settings, commercialName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Cargo Comercial</label>
                <input
                  type="text"
                  value={settings.commercialRole}
                  onChange={(e) => setSettings({ ...settings, commercialRole: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors"
              >
                Guardar Configuración
              </button>
            </div>
          </form>
        )}

      </div>

      {/* Modal: Editar Presupuesto */}
      {editingQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <form onSubmit={handleSaveEditedQuote} className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">
                Modificar Presupuesto {editingQuote.id}
              </h3>
              <button
                type="button"
                onClick={() => setEditingQuote(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nombre del Cliente</label>
                <input
                  type="text"
                  value={editingQuote.client.name}
                  onChange={(e) =>
                    setEditingQuote({
                      ...editingQuote,
                      client: { ...editingQuote.client, name: e.target.value },
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Servicio</label>
                <input
                  type="text"
                  value={editingQuote.serviceName}
                  onChange={(e) => setEditingQuote({ ...editingQuote, serviceName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Importe Total con IVA (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingQuote.pricing.total}
                  onChange={(e) =>
                    setEditingQuote({
                      ...editingQuote,
                      pricing: { ...editingQuote.pricing, total: Number(e.target.value) },
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notas Internas para el Equipo</label>
                <textarea
                  rows={2}
                  value={editingQuote.internalNotes || ''}
                  onChange={(e) => setEditingQuote({ ...editingQuote, internalNotes: e.target.value })}
                  placeholder="Ej. Llamar el lunes a las 11h para resolver dudas de financiación."
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingQuote(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Añadir Servicio */}
      {showNewServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <form onSubmit={handleCreateService} className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base pb-2 border-b border-slate-100">
              Añadir Nuevo Servicio al Catálogo
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nombre del Servicio *</label>
                <input
                  type="text"
                  required
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  placeholder="Ej. Instalación de Placas Solares"
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Categoría</label>
                <select
                  value={newServiceCategory}
                  onChange={(e) => setNewServiceCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="Reformas Generales">Reformas Generales</option>
                  <option value="Estancias Específicas">Estancias Específicas</option>
                  <option value="Instalaciones Técnicas">Instalaciones Técnicas</option>
                  <option value="Acabados y Decoración">Acabados y Decoración</option>
                  <option value="Carpintería y Cerramientos">Carpintería y Cerramientos</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Precio Base (€)</label>
                  <input
                    type="number"
                    required
                    value={newServicePrice}
                    onChange={(e) => setNewServicePrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Unidad de Medida</label>
                  <select
                    value={newServiceUnit}
                    onChange={(e) => setNewServiceUnit(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="m²">m²</option>
                    <option value="ud">Unidad (ud)</option>
                    <option value="hora">Hora</option>
                    <option value="estancia">Estancia</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Descripción</label>
                <textarea
                  rows={3}
                  value={newServiceDesc}
                  onChange={(e) => setNewServiceDesc(e.target.value)}
                  placeholder="Detalles técnicos, qué incluye y ventajas..."
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNewServiceModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md"
              >
                Guardar en Catálogo
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
