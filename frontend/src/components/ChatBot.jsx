import React, { useState, useRef, useEffect } from 'react'
import { GoogleGenAI } from '@google/genai'

// Message Interface
const PharmaChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    {
      role: 'model',
      text: "Hello! I'm your PharmaGuard assistant. Ask me anything about pharmacogenomics, drug interactions, or how to use the platform.",
      timestamp: new Date()
    }
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
    setMessages(prev => [...prev, userMsg])
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
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMsg])
    } catch (error) {
      console.error('Chat Error:', error)
      setMessages(prev => [...prev, {
        role: 'model',
        text: "Error: Unable to process your request. Please ensure the API key is configured correctly.",
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-[350px] sm:w-[400px] h-[550px] bg-slate-950 rounded-2xl shadow-2xl border border-slate-700 flex flex-col mb-4 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-4 flex justify-between items-center shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-sm">PharmaGuard AI</h4>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-[10px] text-cyan-100 uppercase tracking-widest font-medium">Online</span>
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
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900 scroll-smooth">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}>
                <div className={`max-w-[85%] p-3.5 rounded-2xl text-[13.5px] leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-cyan-600 text-black rounded-tr-none'
                    : 'bg-slate-800 text-slate-100 border border-slate-700 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 p-3.5 rounded-2xl rounded-tl-none border border-slate-700 shadow-sm">
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-slate-950 border-t border-slate-700">
            <div className="flex gap-2 items-center bg-slate-800 rounded-xl px-3 py-1 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your question..."
                className="flex-1 bg-transparent border-none py-3 text-sm focus:ring-0 outline-none text-slate-100 placeholder-slate-500"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="p-2 text-cyan-400 hover:text-cyan-300 disabled:text-slate-500 transition-colors"
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
        className={`w-14 h-14 bg-gradient-to-br from-cyan-600 to-blue-600 text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center group ${isOpen ? 'rotate-90' : ''}`}
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
  )
}

export default PharmaChatWidget
