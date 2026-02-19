import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import HistoricalLogs from './components/HistoricalLogs'
import Analytics from './pages/Analytics'
import ChatBot from './components/ChatBot'
import { AnalysisProvider } from './context/AnalysisContext'

function App(){
  return (
    <AnalysisProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/logs" element={<HistoricalLogs/>} />
          <Route path="/analytics" element={<Analytics/>} />
        </Routes>
        <ChatBot />
      </BrowserRouter>
    </AnalysisProvider>
  )
}

createRoot(document.getElementById('root')).render(<App />)
