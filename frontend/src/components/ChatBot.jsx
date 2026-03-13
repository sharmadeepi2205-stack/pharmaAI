import React, { useState, useRef, useEffect } from 'react'
import { GoogleGenAI } from '@google/genai'
import { Send, X, MessageSquare, Loader, Pill } from 'lucide-react'

// Message Interface
const PharmaChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    {
      role: 'model',
      text: "Hello! I'm your PharmaGuard assistant. Ask me anything about pharmacogenomics, drug interactions, or how to use the platform.",
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef(null)

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  const PHARMAGUARD_CONTEXT = `You are the "PharmaGuard Support Assistant" for the pharmacogenomic risk prediction system. 
Your goal is to help users understand how to use PharmaGuard and provide information about pharmacogenomics, drug interactions, and genetic analysis.

KEY FEATURES OF PHARMAGUARD:
- Upload VCF (Variant Call Format) files for genetic analysis
- Select drugs to analyze (Warfarin, Codeine, Clopidogrel, Simvastatin, Azathioprine, Fluorouracil)
- Get AI-powered risk predictions: Safe, Adjust Dosage, Ineffective, Toxic
- View detailed pharmacogenomic profiles
- Access clinical recommendations based on CPIC guidelines
- View historical logs of all analyses
- Explore comprehensive analytics with visualizations

SUPPORTED GENES: CYP2D6, CYP2C19, CYP2C9, SLCO1B1, TPMT, DPYD

Always provide helpful, accurate, and user-friendly responses.`

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMsg = { role: 'user', text: input, timestamp: new Date() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY
      if (!apiKey) {
        throw new Error('Gemini API key not configured')
      }

      const ai = new GoogleGenAI({ apiKey })
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: PHARMAGUARD_CONTEXT,
          temperature: 0.7,
        },
      })

      const response = await chat.sendMessage({ message: input })
      const responseText = response.text

      const aiMsg = {
        role: 'model',
        text: responseText || "I'm sorry, I couldn't process that. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMsg])
    } catch (error) {
      console.error('Chat Error:', error)
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: 'Error: Unable to process your request. Please ensure the API key is configured correctly.',
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-[350px] sm:w-[400px] h-[550px] bg-slate-900 rounded-2xl shadow-2xl border border-cyan-600/50 flex flex-col mb-4 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-4 flex justify-between items-center shadow-md border-b border-cyan-600/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-600/30 to-purple-600/30 flex items-center justify-center backdrop-blur-sm border border-cyan-500/50">
                <Pill size={20} className="text-cyan-400" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-cyan-300">PharmaGuard AI</h4>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">Online</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-slate-700/50 p-1.5 rounded-lg transition-colors text-slate-300 hover:text-cyan-400"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950 scroll-smooth">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] p-3.5 rounded-xl text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-br-none'
                      : 'bg-slate-800 border border-slate-700 text-slate-100 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 border border-slate-700 p-3.5 rounded-xl rounded-bl-none shadow-sm flex items-center gap-2">
                  <Loader size={16} className="text-cyan-400 animate-spin" />
                  <span className="text-sm text-slate-300">Thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-slate-900 border-t border-slate-700">
            <div className="flex gap-2 items-center bg-slate-800 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-cyan-500/30 focus-within:border-cyan-500 border border-slate-700 transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask a question..."
                className="flex-1 bg-transparent border-none py-2 text-sm focus:ring-0 outline-none text-slate-100 placeholder-slate-500"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="p-2 text-cyan-400 hover:text-cyan-300 disabled:text-slate-500 transition-colors disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-br from-cyan-600 to-purple-600 text-white rounded-full shadow-xl hover:shadow-2xl hover:shadow-cyan-600/50 hover:scale-110 active:scale-95 transition-all flex items-center justify-center group"
        aria-label="Open chat"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} className="group-hover:scale-110 transition-transform" />}
      </button>
    </div>
  )
}

export default PharmaChatWidget

