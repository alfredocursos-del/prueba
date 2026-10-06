import {
  Quotation,
  ServiceItem,
  CustomerLead,
  ContactMessage,
  CompanySettings,
  ChatConversation,
} from '../types';
import {
  DEFAULT_COMPANY_SETTINGS,
  INITIAL_SERVICES,
  INITIAL_PROJECTS,
  INITIAL_QUOTATIONS,
  INITIAL_CUSTOMERS,
  INITIAL_CONTACT_MESSAGES,
  INITIAL_CONVERSATIONS,
} from '../data/initialData';

const KEYS = {
  SETTINGS: 'innova_settings_v1',
  SERVICES: 'innova_services_v1',
  QUOTATIONS: 'innova_quotations_v1',
  CUSTOMERS: 'innova_customers_v1',
  CONTACTS: 'innova_contacts_v1',
  CHATS: 'innova_chats_v1',
  CURRENT_CHAT_ID: 'innova_current_chat_id_v1',
};

// Safe JSON parser
function safeParse<T>(key: string, fallback: T): T {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch (e) {
    console.error(`Error parsing ${key} from localStorage`, e);
    return fallback;
  }
}

// Custom event dispatcher to sync components seamlessly
export const STORAGE_CHANGE_EVENT = 'innova_storage_update';
export function notifyStorageChange(entity: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(STORAGE_CHANGE_EVENT, { detail: { entity } }));
  }
}

export const StorageService = {
  // Company settings
  getSettings(): CompanySettings {
    return safeParse<CompanySettings>(KEYS.SETTINGS, DEFAULT_COMPANY_SETTINGS);
  },
  saveSettings(settings: CompanySettings) {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    notifyStorageChange('settings');
  },

  // Services Catalog
  getServices(): ServiceItem[] {
    return safeParse<ServiceItem[]>(KEYS.SERVICES, INITIAL_SERVICES);
  },
  saveServices(services: ServiceItem[]) {
    localStorage.setItem(KEYS.SERVICES, JSON.stringify(services));
    notifyStorageChange('services');
  },
  updateService(service: ServiceItem) {
    const services = this.getServices();
    const index = services.findIndex((s) => s.id === service.id);
    if (index >= 0) {
      services[index] = service;
    } else {
      services.push(service);
    }
    this.saveServices(services);
  },
  deleteService(serviceId: string) {
    const services = this.getServices().filter((s) => s.id !== serviceId);
    this.saveServices(services);
  },

  // Projects
  getProjects() {
    return INITIAL_PROJECTS;
  },

  // Quotations
  getQuotations(): Quotation[] {
    return safeParse<Quotation[]>(KEYS.QUOTATIONS, INITIAL_QUOTATIONS);
  },
  saveQuotations(quotations: Quotation[]) {
    localStorage.setItem(KEYS.QUOTATIONS, JSON.stringify(quotations));
    notifyStorageChange('quotations');
  },
  getQuotationById(id: string): Quotation | undefined {
    return this.getQuotations().find((q) => q.id.toLowerCase() === id.trim().toLowerCase());
  },
  addQuotation(quoteData: Omit<Quotation, 'id' | 'createdAt' | 'updatedAt'>): Quotation {
    const quotations = this.getQuotations();
    const currentYear = new Date().getFullYear();
    const nextNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `PRE-${currentYear}-${nextNum}`;

    const newQuote: Quotation = {
      ...quoteData,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    quotations.unshift(newQuote);
    this.saveQuotations(quotations);

    // Auto-create or update customer lead
    this.upsertCustomerFromQuote(newQuote);

    return newQuote;
  },
  updateQuotation(quote: Quotation) {
    const quotations = this.getQuotations();
    const index = quotations.findIndex((q) => q.id === quote.id);
    if (index >= 0) {
      quotations[index] = { ...quote, updatedAt: new Date().toISOString() };
      this.saveQuotations(quotations);
    }
  },
  deleteQuotation(id: string) {
    const quotations = this.getQuotations().filter((q) => q.id !== id);
    this.saveQuotations(quotations);
  },

  // Customer leads
  getCustomers(): CustomerLead[] {
    return safeParse<CustomerLead[]>(KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
  },
  saveCustomers(customers: CustomerLead[]) {
    localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(customers));
    notifyStorageChange('customers');
  },
  upsertCustomerFromQuote(quote: Quotation) {
    const customers = this.getCustomers();
    const existing = customers.find(
      (c) =>
        c.email.toLowerCase() === quote.client.email.toLowerCase() ||
        (quote.client.phone && c.phone.replace(/\s+/g, '') === quote.client.phone.replace(/\s+/g, ''))
    );

    if (existing) {
      existing.totalQuotations += 1;
      existing.totalAmount += quote.pricing.total;
      if (existing.status === 'nuevo') existing.status = 'presupuestado';
      this.saveCustomers(customers);
    } else {
      const newLead: CustomerLead = {
        id: `lead-${Date.now()}`,
        name: quote.client.name,
        company: quote.client.company || '',
        phone: quote.client.phone,
        email: quote.client.email,
        address: quote.client.address,
        firstContactDate: new Date().toISOString().split('T')[0],
        status: 'presupuestado',
        totalQuotations: 1,
        totalAmount: quote.pricing.total,
        notes: `Presupuesto ${quote.id} por ${quote.pricing.total.toFixed(2)}€ (${quote.serviceName}).`,
      };
      customers.unshift(newLead);
      this.saveCustomers(customers);
    }
  },

  // Contact Messages
  getContactMessages(): ContactMessage[] {
    return safeParse<ContactMessage[]>(KEYS.CONTACTS, INITIAL_CONTACT_MESSAGES);
  },
  saveContactMessages(messages: ContactMessage[]) {
    localStorage.setItem(KEYS.CONTACTS, JSON.stringify(messages));
    notifyStorageChange('contacts');
  },
  addContactMessage(data: Omit<ContactMessage, 'id' | 'date' | 'status'>) {
    const messages = this.getContactMessages();
    const newMsg: ContactMessage = {
      ...data,
      id: `msg-${Date.now()}`,
      date: new Date().toISOString(),
      status: 'no_leido',
    };
    messages.unshift(newMsg);
    this.saveContactMessages(messages);
    return newMsg;
  },
  updateContactMessageStatus(id: string, status: ContactMessage['status']) {
    const messages = this.getContactMessages();
    const index = messages.findIndex((m) => m.id === id);
    if (index >= 0) {
      messages[index].status = status;
      this.saveContactMessages(messages);
    }
  },

  // Chat Conversations
  getConversations(): ChatConversation[] {
    return safeParse<ChatConversation[]>(KEYS.CHATS, INITIAL_CONVERSATIONS);
  },
  saveConversations(conversations: ChatConversation[]) {
    localStorage.setItem(KEYS.CHATS, JSON.stringify(conversations));
    notifyStorageChange('chats');
  },
  getCurrentChatId(): string {
    let id = localStorage.getItem(KEYS.CURRENT_CHAT_ID);
    if (!id) {
      id = `chat-${Date.now()}`;
      localStorage.setItem(KEYS.CURRENT_CHAT_ID, id);
    }
    return id;
  },
  getCurrentConversation(): ChatConversation {
    const currentId = this.getCurrentChatId();
    const all = this.getConversations();
    let conv = all.find((c) => c.id === currentId);
    if (!conv) {
      conv = {
        id: currentId,
        customerName: 'Visitante Web',
        messages: [
          {
            id: `msg-welcome`,
            sender: 'assistant',
            content: '¡Hola! 👋 Soy Carlos Méndez, asesor de INNOVA Obras & Proyectos. ¿Estás buscando orientación de precios, reformas o te gustaría preparar un presupuesto sin compromiso?',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ],
        status: 'bot_active',
        lastActivity: new Date().toISOString(),
      };
      all.unshift(conv);
      this.saveConversations(all);
    }
    return conv;
  },
  saveCurrentConversation(conv: ChatConversation) {
    const all = this.getConversations();
    const index = all.findIndex((c) => c.id === conv.id);
    if (index >= 0) {
      all[index] = conv;
    } else {
      all.unshift(conv);
    }
    this.saveConversations(all);
  },
  requestHumanHandover(chatId: string, clientInfo?: { name?: string; phone?: string; notes?: string }) {
    const all = this.getConversations();
    const conv = all.find((c) => c.id === chatId);
    if (conv) {
      conv.status = 'human_requested';
      if (clientInfo?.name) conv.customerName = clientInfo.name;
      if (clientInfo?.phone) conv.customerPhone = clientInfo.phone;
      if (clientInfo?.notes) conv.notes = clientInfo.notes;
      conv.lastActivity = new Date().toISOString();
      this.saveConversations(all);
    }
  },

  // Reset to default sample state
  resetAll() {
    localStorage.removeItem(KEYS.SETTINGS);
    localStorage.removeItem(KEYS.SERVICES);
    localStorage.removeItem(KEYS.QUOTATIONS);
    localStorage.removeItem(KEYS.CUSTOMERS);
    localStorage.removeItem(KEYS.CONTACTS);
    localStorage.removeItem(KEYS.CHATS);
    localStorage.removeItem(KEYS.CURRENT_CHAT_ID);
    window.location.reload();
  },
};
