import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  User,
  Phone,
  PhoneCall,
  Check,
  CheckCheck,
  Sparkles,
  FileSpreadsheet,
  AlertCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Smile,
  Paperclip,
  Mic,
} from 'lucide-react';
import { ChatMessage, ChatConversation, Quotation } from '../types';
import { StorageService } from '../services/storage';

interface WhatsAppChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  onTransferToQuotation: (prefill?: Partial<Quotation>) => void;
}

export const WhatsAppChatbot: React.FC<WhatsAppChatbotProps> = ({
  isOpen,
  onClose,
  onOpen,
  onTransferToQuotation,
}) => {
  const [conversation, setConversation] = useState<ChatConversation>(
    StorageService.getCurrentConversation()
  );
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [humanHandoverRequested, setHumanHandoverRequested] = useState(
    conversation.status === 'human_requested' || conversation.status === 'human_active'
  );
  const [unreadCount, setUnreadCount] = useState(1);
  const [showTeaser, setShowTeaser] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      setShowTeaser(false);
      setTimeout(scrollToBottom, 100);
    }
  }, [isOpen, conversation.messages]);

  // Keep synced with storage
  useEffect(() => {
    const handleStorageUpdate = (e: any) => {
      if (e.detail?.entity === 'chats') {
        const conv = StorageService.getCurrentConversation();
        setConversation(conv);
        setHumanHandoverRequested(
          conv.status === 'human_requested' || conv.status === 'human_active'
        );
      }
    };
    window.addEventListener('innova_storage_update', handleStorageUpdate);
    return () => window.removeEventListener('innova_storage_update', handleStorageUpdate);
  }, []);

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || inputText).trim();
    if (!messageContent || isLoading) return;

    setInputText('');

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      content: messageContent,
      timestamp: now,
    };

    const updatedMessages = [...conversation.messages, userMsg];
    const updatedConv: ChatConversation = {
      ...conversation,
      messages: updatedMessages,
      lastActivity: new Date().toISOString(),
    };

    setConversation(updatedConv);
    StorageService.saveCurrentConversation(updatedConv);
    setIsLoading(true);

    try {
      // Call server-side API proxy /api/chat
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageContent,
          history: updatedMessages.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Chat API responded with ${response.status}`);
      }

      const data = await response.json();
      const botReply = data.reply || 'He recibido tu consulta. Un asesor comercial te responderá a la brevedad.';

      // Check if user requested human handover
      const lower = messageContent.toLowerCase();
      const needsHuman =
        lower.includes('humano') ||
        lower.includes('comercial') ||
        lower.includes('agente') ||
        lower.includes('telefono') ||
        lower.includes('llamad');

      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        content: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        requiresHumanHandover: needsHuman || humanHandoverRequested,
      };

      const finalMessages = [...updatedMessages, assistantMsg];
      const finalConv: ChatConversation = {
        ...updatedConv,
        messages: finalMessages,
        status: needsHuman ? 'human_requested' : updatedConv.status,
      };

      if (needsHuman) {
        setHumanHandoverRequested(true);
      }

      setConversation(finalConv);
      StorageService.saveCurrentConversation(finalConv);
    } catch (err) {
      console.error('Error fetching chat response:', err);
      // Fallback local response
      const fallbackMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        content:
          '¡Gracias por tu mensaje! He registrado tu consulta. ¿Te gustaría que te preparemos un presupuesto orientativo o prefieres que un comercial te llame por teléfono?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      const finalConv = {
        ...updatedConv,
        messages: [...updatedMessages, fallbackMsg],
      };
      setConversation(finalConv);
      StorageService.saveCurrentConversation(finalConv);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestHuman = () => {
    StorageService.requestHumanHandover(conversation.id);
    setHumanHandoverRequested(true);

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const handoverMsg: ChatMessage = {
      id: `sys-${Date.now()}`,
      sender: 'assistant',
      content:
        '👤 **Aviso enviado al equipo comercial**: Hemos notificado con prioridad al asesor Carlos Méndez para que tome el control de este chat o se comunique contigo en cuanto esté disponible. Por favor, indícanos tu número de teléfono y nombre si aún no lo has hecho.',
      timestamp: now,
      requiresHumanHandover: true,
    };

    const updated = {
      ...conversation,
      status: 'human_requested' as const,
      messages: [...conversation.messages, handoverMsg],
    };
    setConversation(updated);
    StorageService.saveCurrentConversation(updated);
  };

  // Quick Action Chips
  const quickActions = [
    { label: '💰 Precios reforma integral', query: '¿Cuánto cuesta aproximadamente una reforma integral por m² y qué incluye?' },
    { label: '🎨 Presupuesto pintar piso', query: '¿Qué precio tiene pintar un piso y cuánto tiempo tardáis?' },
    { label: '📋 Preparar presupuesto formal', query: 'Quiero preparar un presupuesto formal para mi vivienda' },
    { label: '👤 Hablar con un comercial', isHandover: true },
  ];

  return (
    <>
      {/* Floating Widget Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        {/* Floating Speech Teaser Bubble */}
        {!isOpen && showTeaser && (
          <div className="relative max-w-xs bg-white text-slate-800 p-3.5 rounded-2xl rounded-br-xs shadow-2xl border border-slate-200 text-xs animate-bounce-subtle">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowTeaser(false);
              }}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-300"
            >
              <X className="w-3 h-3" />
            </button>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-bold text-slate-900">Carlos • Asesor INNOVA</span>
            </div>
            <p className="text-slate-600">
              ¿Quieres saber cuánto cuesta tu obra o reforma? Pregúntame aquí en WhatsApp.
            </p>
          </div>
        )}

        <button
          onClick={isOpen ? onClose : onOpen}
          className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white flex items-center justify-center shadow-xl shadow-emerald-600/40 hover:scale-105 transition-all"
          aria-label="Abrir Asistente WhatsApp"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <>
              <MessageSquare className="w-7 h-7" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-600 text-white font-bold text-[10px] flex items-center justify-center ring-2 ring-white animate-pulse">
                  {unreadCount}
                </span>
              )}
            </>
          )}
        </button>
      </div>

      {/* Chat Window (WhatsApp Style) */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-40 w-[95vw] sm:w-[410px] h-[580px] max-h-[85vh] bg-[#ECE5DD] rounded-3xl shadow-2xl border border-slate-200/80 flex flex-col overflow-hidden animate-slide-up">
          
          {/* WhatsApp Header */}
          <div className="bg-[#075E54] text-white px-4 py-3 flex items-center justify-between shadow-md select-none shrink-0">
            <div className="flex items-center gap-3">
              {/* Avatar with active green dot */}
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120&q=80"
                  alt="Carlos Méndez"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-300"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-1 ring-white" />
              </div>

              <div>
                <h4 className="font-bold text-sm leading-tight text-white flex items-center gap-1.5">
                  <span>Carlos Méndez</span>
                  <span className="text-[10px] bg-emerald-700/80 px-1.5 py-0.5 rounded text-emerald-200 font-normal">
                    Asesor
                  </span>
                </h4>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 inline-block" />
                  <span>En línea • Respuestas al instante</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleRequestHuman}
                className="p-2 rounded-full hover:bg-white/10 text-emerald-100 hover:text-white transition-colors"
                title="Solicitar atención comercial humana"
              >
                <PhoneCall className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 text-emerald-100 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Handover Notice Banner */}
          {humanHandoverRequested && (
            <div className="bg-amber-100/95 border-b border-amber-300 text-amber-900 px-3 py-1.5 text-xs flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-1.5 font-medium">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Atención humana solicitada</span>
              </div>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-200/80 px-1.5 py-0.5 rounded">
                Prioridad Alta
              </span>
            </div>
          )}

          {/* Message List (WhatsApp Pattern Canvas) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[radial-gradient(#075e5408_1px,transparent_1px)] [background-size:16px_16px]">
            
            {/* Timestamp date bubble */}
            <div className="flex justify-center">
              <span className="bg-white/80 backdrop-blur-xs text-slate-500 text-[10px] px-2.5 py-0.5 rounded-full shadow-xs uppercase tracking-wider font-semibold">
                Hoy
              </span>
            </div>

            {/* Conversation Messages */}
            {conversation.messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`relative max-w-[85%] rounded-2xl px-3.5 py-2 shadow-xs text-xs sm:text-sm ${
                      isUser
                        ? 'bg-[#DCF8C6] text-slate-900 rounded-tr-none'
                        : 'bg-white text-slate-900 rounded-tl-none border border-slate-100'
                    }`}
                  >
                    {/* Message Text with markdown support */}
                    <p className="whitespace-pre-line leading-relaxed">{msg.content}</p>

                    {/* Timestamp & checks */}
                    <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-400 select-none">
                      <span>{msg.timestamp}</span>
                      {isUser && <CheckCheck className="w-3.5 h-3.5 text-blue-500" />}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-2xl rounded-tl-none shadow-xs w-20">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]" />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Action Ribbon: Quick Presupuesto CTA */}
          <div className="bg-white/95 border-t border-slate-200 px-3 py-2 flex items-center justify-between gap-2 shrink-0">
            <button
              onClick={() => {
                onTransferToQuotation();
                onClose();
              }}
              className="flex-1 py-1.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center gap-1.5 border border-blue-200 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>📋 Generar presupuesto formal</span>
            </button>

            {!humanHandoverRequested && (
              <button
                onClick={handleRequestHuman}
                className="py-1.5 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                title="Avisar a comercial humano"
              >
                <User className="w-3.5 h-3.5 text-slate-600" />
                <span>Pedir llamada</span>
              </button>
            )}
          </div>

          {/* Quick suggestion chips */}
          <div className="bg-slate-100 px-3 py-1.5 flex gap-1.5 overflow-x-auto text-[11px] shrink-0 no-scrollbar">
            {quickActions.map((qa, i) => (
              <button
                key={i}
                onClick={() => (qa.isHandover ? handleRequestHuman() : handleSendMessage(qa.query))}
                className="shrink-0 px-2.5 py-1 rounded-full bg-white hover:bg-slate-200 text-slate-700 font-medium shadow-2xs border border-slate-200/80 transition-colors"
              >
                {qa.label}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <div className="bg-[#F0F2F5] px-3 py-2 flex items-center gap-2 border-t border-slate-200 shrink-0">
            <div className="flex-1 bg-white rounded-2xl flex items-center px-3 py-1.5 shadow-2xs border border-slate-200">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                placeholder="Escribe tu consulta aquí..."
                className="w-full text-xs sm:text-sm bg-transparent focus:outline-none text-slate-800 placeholder:text-slate-400"
              />
            </div>

            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isLoading}
              className="w-10 h-10 rounded-full bg-[#00A884] hover:bg-[#008f6f] disabled:opacity-50 text-white flex items-center justify-center shadow-md transition-all shrink-0"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </div>

        </div>
      )}
    </>
  );
};
