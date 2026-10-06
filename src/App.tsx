import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { PortfolioSection } from './components/PortfolioSection';
import { QuotationApp } from './components/QuotationApp';
import { ClientPortal } from './components/ClientPortal';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { WhatsAppChatbot } from './components/WhatsAppChatbot';
import { PDFViewerModal } from './components/PDFViewerModal';
import { AdminPanel } from './components/AdminPanel';
import { StorageService } from './services/storage';
import { ServiceItem, Quotation, CompanySettings } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(undefined);
  const [activePdfQuotation, setActivePdfQuotation] = useState<Quotation | null>(null);
  const [clientAreaSearchTerm, setClientAreaSearchTerm] = useState<string>('');
  
  // Storage synced states
  const [services, setServices] = useState<ServiceItem[]>(StorageService.getServices());
  const [projects] = useState(StorageService.getProjects());
  const [settings, setSettings] = useState<CompanySettings>(StorageService.getSettings());
  const [conversations, setConversations] = useState(StorageService.getConversations());

  // Listen to storage sync events
  useEffect(() => {
    const handleStorageUpdate = () => {
      setServices(StorageService.getServices());
      setSettings(StorageService.getSettings());
      setConversations(StorageService.getConversations());
    };
    window.addEventListener('innova_storage_update', handleStorageUpdate);
    return () => window.removeEventListener('innova_storage_update', handleStorageUpdate);
  }, []);

  const pendingHumanCount = conversations.filter(
    (c) => c.status === 'human_requested'
  ).length;

  const handleNavigate = (view: string, extraData?: any) => {
    setCurrentView(view);
    if (view === 'client-area' && typeof extraData === 'string') {
      setClientAreaSearchTerm(extraData);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectServiceForQuotation = (service: ServiceItem) => {
    setSelectedServiceId(service.id);
    setCurrentView('quotation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAskChatbotAboutService = (serviceName: string) => {
    setIsChatOpen(true);
    // Send automatic question to chatbot
    const currentConv = StorageService.getCurrentConversation();
    const newMsg = {
      id: `usr-svc-${Date.now()}`,
      sender: 'user' as const,
      content: `Hola Carlos, ¿podrías darme más información y precios sobre el servicio de "${serviceName}"?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    const updated = {
      ...currentConv,
      messages: [...currentConv.messages, newMsg],
    };
    StorageService.saveCurrentConversation(updated);
  };

  const handleOpenChatWithQuote = (quote: Quotation) => {
    setIsChatOpen(true);
    const currentConv = StorageService.getCurrentConversation();
    const newMsg = {
      id: `usr-quote-${Date.now()}`,
      sender: 'user' as const,
      content: `Hola Carlos, he generado el presupuesto formal ${quote.id} por ${quote.pricing.total.toFixed(2)}€ para ${quote.serviceName}. ¿Podríamos revisarlo juntos?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    const updated = {
      ...currentConv,
      messages: [...currentConv.messages, newMsg],
    };
    StorageService.saveCurrentConversation(updated);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        openChat={() => setIsChatOpen(true)}
        settings={settings}
        pendingHumanHandoverCount={pendingHumanCount}
      />

      {/* Main Views Container */}
      <main className="flex-1">
        {currentView === 'admin' ? (
          <AdminPanel
            onOpenPDF={(quote) => setActivePdfQuotation(quote)}
            onNavigateHome={() => handleNavigate('home')}
          />
        ) : currentView === 'quotation' ? (
          <QuotationApp
            services={services}
            preselectedServiceId={selectedServiceId}
            onOpenPDF={(quote) => setActivePdfQuotation(quote)}
            onOpenChatWithQuote={handleOpenChatWithQuote}
            onNavigateToClientArea={(term) => handleNavigate('client-area', term)}
            settings={settings}
          />
        ) : currentView === 'client-area' ? (
          <ClientPortal
            initialSearch={clientAreaSearchTerm}
            onOpenPDF={(quote) => setActivePdfQuotation(quote)}
            onOpenChatWithQuote={handleOpenChatWithQuote}
            onNavigateToQuotation={() => handleNavigate('quotation')}
          />
        ) : currentView === 'services' ? (
          <div className="pt-16">
            <ServicesSection
              services={services}
              onSelectServiceForQuotation={handleSelectServiceForQuotation}
              onAskChatbotAboutService={handleAskChatbotAboutService}
            />
          </div>
        ) : currentView === 'projects' ? (
          <div className="pt-16">
            <PortfolioSection
              projects={projects}
              onRequestSimilarBudget={() => handleNavigate('quotation')}
            />
          </div>
        ) : currentView === 'contact' ? (
          <div className="pt-16">
            <ContactSection
              settings={settings}
              onOpenWhatsApp={() => setIsChatOpen(true)}
            />
          </div>
        ) : (
          /* Default "home" view: complete landing with all sections */
          <>
            <Hero
              onStartQuotation={() => handleNavigate('quotation')}
              onOpenChat={() => setIsChatOpen(true)}
              onViewProjects={() => {
                const el = document.getElementById('projects');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else handleNavigate('projects');
              }}
            />

            <ServicesSection
              services={services}
              onSelectServiceForQuotation={handleSelectServiceForQuotation}
              onAskChatbotAboutService={handleAskChatbotAboutService}
            />

            <PortfolioSection
              projects={projects}
              onRequestSimilarBudget={() => handleNavigate('quotation')}
            />

            <ContactSection
              settings={settings}
              onOpenWhatsApp={() => setIsChatOpen(true)}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        onNavigate={handleNavigate}
        openChat={() => setIsChatOpen(true)}
      />

      {/* Floating WhatsApp Style Chatbot */}
      <WhatsAppChatbot
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onOpen={() => setIsChatOpen(true)}
        onTransferToQuotation={() => handleNavigate('quotation')}
      />

      {/* Formal PDF Viewer & Printable Modal */}
      {activePdfQuotation && (
        <PDFViewerModal
          quotation={activePdfQuotation}
          settings={settings}
          onClose={() => setActivePdfQuotation(null)}
        />
      )}
    </div>
  );
}
