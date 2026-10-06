export type QualityLevel = 'basica' | 'estandar' | 'premium';
export type UrgencyLevel = 'normal' | 'rapida' | 'express';
export type QuotationStatus = 'pendiente' | 'en_estudio' | 'aprobado' | 'en_curso' | 'rechazado' | 'facturado';
export type LeadStatus = 'nuevo' | 'contactado' | 'presupuestado' | 'ganado' | 'perdido';

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  shortDesc: string;
  description: string;
  unit: string; // 'm²', 'ud', 'estancia', 'hora'
  basePrice: number;
  minUnits: number;
  estimatedDaysPerUnit: number;
  icon: string;
  image: string;
  includedFeatures: string[];
  popular?: boolean;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  description: string;
  budget: number;
  duration: string;
  client: string;
  location: string;
  mainImage: string;
  secondaryImages?: string[];
  tags: string[];
  highlight: string;
}

export interface QuotationLineItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

export interface Quotation {
  id: string;
  date: string;
  validUntil: string;
  client: {
    name: string;
    company?: string;
    phone: string;
    email: string;
    address: string;
    nif?: string;
  };
  serviceId: string;
  serviceName: string;
  lineItems: QuotationLineItem[];
  specifications: {
    surfaceArea: number; // m² or units
    qualityLevel: QualityLevel;
    urgency: UrgencyLevel;
    notes: string;
  };
  attachedFiles: Array<{
    id: string;
    name: string;
    size: string;
    type: string;
    url?: string;
  }>;
  pricing: {
    subtotal: number;
    qualityMultiplier: number;
    urgencyMultiplier: number;
    discountPercent: number;
    discountCode?: string;
    discountAmount: number;
    taxRate: number; // 21% or 10%
    taxAmount: number;
    total: number;
  };
  status: QuotationStatus;
  notes?: string;
  internalNotes?: string;
  assignedCommercial?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'human_agent';
  content: string;
  timestamp: string;
  requiresHumanHandover?: boolean;
  prefilledQuotation?: Partial<Quotation>;
}

export interface ChatConversation {
  id: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  messages: ChatMessage[];
  status: 'bot_active' | 'human_requested' | 'human_active' | 'resolved';
  lastActivity: string;
  notes?: string;
}

export interface CustomerLead {
  id: string;
  name: string;
  company?: string;
  phone: string;
  email: string;
  address?: string;
  firstContactDate: string;
  status: LeadStatus;
  totalQuotations: number;
  totalAmount: number;
  notes?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  status: 'no_leido' | 'leido' | 'contactado' | 'archivado';
}

export interface CompanySettings {
  name: string;
  tradeName: string;
  cif: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  taxRateDefault: number;
  warrantyPeriod: string;
  commercialName: string;
  commercialRole: string;
}
