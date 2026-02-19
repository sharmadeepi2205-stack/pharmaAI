
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

// --- Types ---
interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

// --- Context & Constants ---
const PHARMAGUARD_CONTEXT = `
You are the "PharmaGuard Support Bot" for the RIFT 2026 Hackathon. 
Your goal is to help developers and stakeholders understand the requirements and technical specifications of the "PharmaGuard: Pharmacogenomic Risk Prediction System".

PROJECT OVERVIEW:
- Track: Pharmacogenomics / Explainable AI.
- Problem: Adverse drug reactions kill 100,000+ Americans annually.
- Solution: AI-powered web app analyzing VCF files and drug names to predict genomic risks.

CORE CHALLENGES:
1. Parse VCF files (v4.2).
2. Identify variants in 6 genes: CYP2D6, CYP2C19, CYP2C9, SLCO1B1, TPMT, DPYD.
3. Predict risks: Safe, Adjust Dosage, Toxic, Ineffective, Unknown.
4. Generate clinical explanations using LLMs with specific citations.
5. Provide dosing recommendations aligned with CPIC guidelines.

INPUT REQUIREMENTS:
- VCF File: .vcf v4.2, up to 5MB, must have INFO tags (GENE, STAR, RS).
- Drug Inputs: CODEINE, WARFARIN, CLOPIDOGREL, SIMVASTATIN, AZATHIOPRINE, FLUOROURACIL.

OUTPUT SCHEMA:
The system MUST output JSON with fields like patient_id, drug, risk_assessment, and pharmacogenomic_profile.

Always provide technical, helpful, and precise answers based on these rules.
`;

// --- Chatbot Component ---
const PharmaChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Hello! I'm your PharmaGuard assistant. Ask me anything about the RIFT 2026 project requirements.",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: PHARMAGUARD_CONTEXT,
          temperature: 0.7,
        },
      });

      const response = await chat.sendMessage({ message: input });
      const responseText = response.text;

      const aiMsg: Message = { 
        role: 'model', 
        text: responseText || "I'm sorry, I couldn't process that.", 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: "Error: Service unavailable. Check your API key configuration.", 
        timestamp: new Date() 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-[350px] sm:w-[400px] h-[550px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col mb-4 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a2 2 0 00-1.96 1.414l-.727 2.903a2 2 0 01-1.414 1.414l-2.903-.727a2 2 0 01-1.414-1.96l.477-2.387a2 2 0 00-.547-1.022L4.572 12.572a2 2 0 00.547-1.022l.477-2.387a2 2 0 00-1.414-1.96L1.279 6.475a2 2 0 01-1.414-1.414l.727-2.903a2 2 0 011.96-1.414l2.387.477a2 2 0 001.022-.547l3.022-3.022a2 2 0 011.022-.547l2.387.477a2 2 0 011.96 1.414l.727 2.903a2 2 0 01-1.414 1.414l-2.903-.727a2 2 0 01-1.414-1.96l.477-2.387a2 2 0 00-.547-1.022l3.022-3.022a2 2 0 011.022-.547l2.387.477a2 2 0 011.96 1.414l.727 2.903a2 2 0 01-1.414 1.414l-2.903-.727a2 2 0 01-1.414-1.96l.477-2.387a2 2 0 00-.547-1.022l3.022-3.022z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-sm">PharmaGuard AI</h4>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-[10px] text-blue-100 uppercase tracking-widest font-medium">Online</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="hover:bg-white/10 p-1.5 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 scroll-smooth">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}>
                <div className={`max-w-[85%] p-3.5 rounded-2xl text-[13.5px] leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3.5 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm">
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100">
            <div className="flex gap-2 items-center bg-slate-100 rounded-xl px-3 py-1 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your question..."
                className="flex-1 bg-transparent border-none py-3 text-sm focus:ring-0 outline-none text-slate-700"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="p-2 text-blue-600 hover:text-blue-800 disabled:text-slate-400 transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 bg-blue-600 text-white rounded-full shadow-xl hover:bg-blue-700 hover:scale-110 active:scale-95 transition-all flex items-center justify-center group ${isOpen ? 'rotate-90' : ''}`}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        ) : (
          <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default PharmaChatWidget;
