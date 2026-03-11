import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function Header(){
  const location = useLocation()
  const navigate = useNavigate()
  const [logsCount, setLogsCount] = useState(0)
  
  // Fetch logs count on mount and periodically
  useEffect(() => {
    const fetchLogsCount = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/logs`)
        const data = await response.json()
        if (data.success) {
          setLogsCount(data.total || 0)
        }
      } catch (err) {
        console.error('Error fetching logs count:', err)
      }
    }
    
    fetchLogsCount()
    // Refresh logs count every 5 seconds when on logs page
    if (location.pathname === '/logs') {
      const interval = setInterval(fetchLogsCount, 5000)
      return () => clearInterval(interval)
    }
  }, [location.pathname])
  
  // Show back button on all pages except home
  const showBack = location.pathname !== '/'
  
  // Get page title based on current route
  const getPageTitle = () => {
    switch(location.pathname) {
      case '/dashboard':
        return 'Dashboard'
      case '/logs':
        return 'Historical Logs'
      default:
        return 'PharmaGuard'
    }
  }

  return (
    <header className="w-full sticky top-0 z-50 bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg border-b-2 border-sky-500">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between gap-6">
        {/* Left Section - Back Button + Logo */}
        <div className="flex items-center gap-4">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white transition-all duration-200 hover:shadow-md active:scale-95"
              title="Go back to previous page"
            >
              <span className="text-xl">←</span>
              <span className="text-sm font-semibold hidden sm:inline">Back</span>
            </button>
          )}
          
          <Link 
            to="/"
            className="flex items-center gap-3 hover:opacity-90 transition-opacity"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-cyan-500 rounded-lg flex items-center justify-center font-bold text-white shadow-md">
              💊
            </div>
            <div className="text-white">
              <div className="text-xl font-bold tracking-tight">PharmaGuard</div>
              <div className="text-xs text-slate-400">Genomic Drug Safety</div>
            </div>
          </Link>
        </div>

        {/* Center Section - Page Title */}
        {location.pathname !== '/' && (
          <div className="hidden md:flex items-center">
            <h1 className="text-white text-2xl font-bold">{getPageTitle()}</h1>
          </div>
        )}

        {/* Right Section - Navigation Links */}
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link 
            to="/" 
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
              location.pathname === '/'
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-700 hover:text-white hover:shadow-md'
            }`}
          >
            <span className="hidden sm:inline">🏠 Home</span>
            <span className="sm:hidden">🏠</span>
          </Link>
          
          <Link 
            to="/dashboard" 
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
              location.pathname === '/dashboard'
                ? 'bg-cyan-500 text-white shadow-md'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white hover:shadow-md'
            }`}
          >
            <span className="hidden sm:inline">📊 Dashboard</span>
            <span className="sm:hidden">📊</span>
          </Link>
          
          <Link 
            to="/logs" 
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 relative ${
              location.pathname === '/logs'
                ? 'bg-cyan-500 text-white shadow-md'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white hover:shadow-md'
            }`}
          >
            <span className="hidden sm:inline">📋 Logs</span>
            <span className="sm:hidden">📋</span>
            {logsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {logsCount > 99 ? '99+' : logsCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  )
}
