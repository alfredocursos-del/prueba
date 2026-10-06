import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI SDK with server-side API Key
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Error instantiating GoogleGenAI:', err);
  }
}

// System prompt defining the commercial sales assistant persona & catalog knowledge
const COMMERCIAL_SYSTEM_INSTRUCTION = `
Eres "Carlos Méndez", Asesor Comercial Senior de "INNOVA Obras & Proyectos" (empresa líder en reformas integrales, climatización, instalaciones eléctricas, carpintería, pintura y proyectos llave en mano).
Tu objetivo es atender clientes en un chat estilo WhatsApp de manera profesional, cercana, empática, eficiente y con alta capacidad de persuasión consultiva.

Tus responsabilidades:
1. Responder preguntas sobre servicios, calidades, métodos de trabajo y garantías (ofrecemos 2 años de garantía certificada en reformas, materiales de primeras marcas con homologación CE, presupuesto previo sin compromiso).
2. Explicar precios y condiciones de referencia:
   - Reforma integral completa: 450€ - 750€/m² (según calidades económica, estándar o premium).
   - Pintura plástica profesional: 8€ - 14€/m² (incluye lijado, plastecido de fisuras y 2 capas de pintura lavable).
   - Climatización / Aire Acondicionado: desde 850€ por Split inverter instalado o por conductos desde 2.400€.
   - Instalación eléctrica completa con cuadro y boletín: desde 1.800€ - 3.500€ según m² y puntos de luz.
   - Carpintería y Ventanas PVC/Aluminio con rotura puente térmico: desde 380€/ventana instalada.
   - Baños y Cocinas llave en mano: Baño completo desde 3.200€; Cocina integral con muebles y encimera desde 4.800€.
   - Condiciones: 30% anticipo al inicio, 40% a mitad de obra, 30% a la entrega y conformidad. Financiación hasta 24 meses sin intereses.
3. Preguntar proactivamente al cliente qué necesita:
   - Tipo de inmueble (piso, unifamiliar, local comercial, oficina).
   - Metros cuadrados aproximados o estancias a intervenir.
   - Ciudad o zona geográfica.
   - Plazo deseado (urgente o planificado).
4. Orientar hacia la solución idónea.
5. Recoger datos clave: Nombre, Teléfono o Email, y resumen de lo solicitado.
6. Si el cliente pide un presupuesto formal o te ha dado los datos básicos, anímale a pulsar el botón "📋 Generar presupuesto formal" que tiene en pantalla o dile que tú mismo has preparado la ficha para el equipo técnico.
7. Si el cliente tiene dudas complejas, pide visitas técnicas inmediatas, o solicita hablar con un humano, recomiéndale pulsar el botón "👤 Solicitar atención comercial humana" o dáselo por hecho, indicándole que el comercial asignado le llamará a su número.

Tono:
- Español de España natural, educado, ágil, formato mensaje de chat (párrafos breves, uso ocasional de emojis acordes al sector 🏢 🛠️ 📋 💡).
- Si no sabes un precio exacto o depende de visita técnica, explica el rango orientativo y ofrece la visita gratuita de valoración.
`;

// Fallback intelligent responder if Gemini key is not configured or in case of transient API error
function generateFallbackCommercialReply(userMessage: string, history: Array<{ role: string; content: string }>): string {
  const lower = userMessage.toLowerCase();

  if (lower.includes('humano') || lower.includes('persona') || lower.includes('agente') || lower.includes('llamad') || lower.includes('urgente')) {
    return '¡Por supuesto! He marcado tu solicitud con prioridad comercial. Un asesor técnico de nuestro equipo se pondrá en contacto contigo de inmediato al teléfono que nos indiques. También puedes pulsar el botón "👤 Solicitar atención humana" para asignarte agente ahora mismo.';
  }

  if (lower.includes('precio') || lower.includes('coste') || lower.includes('cuanto') || lower.includes('cuánto') || lower.includes('tarifa')) {
    if (lower.includes('pint') || lower.includes('pared')) {
      return 'El precio de pintura profesional está entre 8€ y 14€ por m², incluyendo preparación de paramentos, plastecido y dos manos de pintura plástica lavable mate. ¿Cuántos m² tiene tu piso o local aproximadamente?';
    }
    if (lower.includes('reforma') || lower.includes('integral') || lower.includes('piso')) {
      return 'Nuestras reformas integrales parten desde 450€/m² en gama estándar hasta 750€/m² en acabados premium de diseño con primeras marcas. ¿Qué dimensiones tiene la vivienda y en qué localidad se encuentra?';
    }
    if (lower.includes('clima') || lower.includes('aire') || lower.includes('conducto')) {
      return 'Para climatización, la instalación de Split inverter 1x1 ronda los 850€ con instalación y garantía de 3 años, y sistemas centralizados por conductos desde 2.400€. ¿Tienes ya preinstalación de conductos?';
    }
    return 'Nuestras tarifas de referencia son muy competitivas: reformas desde 450€/m², pintura desde 9€/m², baños completos desde 3.200€ y cocinas desde 4.800€. Todos los presupuestos incluyen visita técnica gratuita, dirección de obra y garantía de 2 años. ¿Qué tipo de trabajo tienes en mente?';
  }

  if (lower.includes('presupuesto') || lower.includes('cotiza') || lower.includes('calcular') || lower.includes('cuanto saldría')) {
    return '¡Excelente! Puedes obtener una valoración inmediata en 2 minutos utilizando nuestro calculador inteligente en la pestaña "Presupuestos", o indicarme aquí mismo los metros cuadrados y estancias para prepararte un desglose estimado. ¿Tienes ya las medidas aproximadas?';
  }

  if (lower.includes('plazo') || lower.includes('tiempo') || lower.includes('cuanto tarda')) {
    return 'Los plazos habituales son: pintura de piso completo (2 a 4 días), baño o cocina (7 a 12 días laborables) y reformas integrales de vivienda (entre 6 y 10 semanas garantizadas por contrato con penalización por retraso). ¿Para qué fechas lo necesitas?';
  }

  if (lower.includes('garantia') || lower.includes('garantía') || lower.includes('licencia') || lower.includes('seguro')) {
    return 'Todos nuestros trabajos cuentan con 2 años de garantía certificada por escrito, seguro de responsabilidad civil de hasta 600.000€ y nos encargamos de tramitar las licencias municipales de obras y permisos ante la comunidad de vecinos sin sobrecoste.';
  }

  return '¡Hola! Es un placer saludarte. Soy Carlos Méndez, asesor de INNOVA Obras & Proyectos. ¿Estás pensando en hacer una reforma, pintura, climatización o necesitas un presupuesto personalizado para tu vivienda o empresa? Cuéntame los detalles y te asesoro con gusto.';
}

// POST /api/chat endpoint for chatbot commercial
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message string is required' });
      return;
    }

    if (!ai || !apiKey) {
      // Gracefully use local intelligent commercial engine
      const reply = generateFallbackCommercialReply(message, history || []);
      res.json({ reply, source: 'fallback_engine' });
      return;
    }

    // Format chat history for gemini-3.8-flash
    const contents: any[] = [];

    if (Array.isArray(history)) {
      for (const h of history) {
        if (h.role === 'user') {
          contents.push({ role: 'user', parts: [{ text: h.content }] });
        } else if (h.role === 'assistant' || h.role === 'model') {
          contents.push({ role: 'model', parts: [{ text: h.content }] });
        }
      }
    }

    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: COMMERCIAL_SYSTEM_INSTRUCTION,
        temperature: 0.65,
        maxOutputTokens: 600,
      },
    });

    const reply = response.text || generateFallbackCommercialReply(message, history || []);
    res.json({ reply, source: 'gemini-3.8-flash' });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    const fallbackReply = generateFallbackCommercialReply(req.body?.message || '', req.body?.history || []);
    res.json({ reply: fallbackReply, source: 'error_fallback', error: error?.message });
  }
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', hasGeminiKey: Boolean(apiKey), time: new Date().toISOString() });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: Number(PORT),
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT} (mode: ${isProd ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
