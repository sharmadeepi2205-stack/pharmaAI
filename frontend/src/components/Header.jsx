import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Home, BarChart3, Clock, Settings, Pill, ArrowLeft, Bell } from 'lucide-react'
import api from '../services/api'

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const [logsCount, setLogsCount] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState(0)

  useEffect(() => {
    const fetchLogsCount = async () => {
      try {
        const response = await api.get('/logs')
        if (response.data && response.data.success) {
          setLogsCount(response.data.total || response.data.logs?.length || 0)
        }
      } catch (err) {
        console.warn('⚠️ Could not fetch logs count:', err?.message)
        // Gracefully continue without logs count
        setLogsCount(0)
      }
    }

    fetchLogsCount()
    if (location.pathname === '/logs') {
      const interval = setInterval(fetchLogsCount, 5000)
      return () => clearInterval(interval)
    }
  }, [location.pathname])

  const showBack = location.pathname !== '/'

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Dashboard'
      case '/logs':
        return 'Historical Logs'
      default:
        return 'PharmaGuard'
    }
  }

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: BarChart3, label: 'Dashboard', path: '/dashboard' },
    { icon: Clock, label: 'Logs', path: '/logs', badge: logsCount },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-cyan-600/50 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Left Section - Logo & Back Button */}
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              {showBack && (
                <button
                  onClick={() => navigate(-1)}
                  className="flex-shrink-0 p-2 text-slate-400 hover:text-cyan-400 transition-colors duration-200 hover:bg-slate-700 rounded-lg"
                  title="Go back to previous page"
                  aria-label="Go back"
                >
                  <ArrowLeft size={20} />
                </button>
              )}

              {/* Logo & Title */}
              <Link
                to="/"
                className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity"
              >
                <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg shadow-lg shadow-cyan-500/50">
                  <Pill size={24} className="text-white" />
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">PharmaGuard</span>
                  <span className="text-xs text-cyan-400/70">Pharmacogenomics</span>
                </div>
              </Link>
            </div>

            {/* Center - Page Title (Mobile) */}
            <div className="md:hidden flex-1 text-center px-2">
              <h2 className="text-sm font-semibold text-cyan-300 truncate">{getPageTitle()}</h2>
            </div>

            {/* Right Section - Navigation (Desktop) + Mobile Menu Button */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.path)
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`relative flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                        active
                          ? 'text-cyan-400 bg-slate-700/50 border border-cyan-500/50'
                          : 'text-slate-300 hover:text-cyan-400 hover:bg-slate-700/30'
                      }`}
                      title={item.label}
                    >
                      <Icon size={18} />
                      <span className="hidden lg:inline">{item.label}</span>
                      {item.badge > 0 && (
                        <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-purple-600 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </nav>

              {/* Notifications Bell */}
              <button
                className="relative p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-700/30 rounded-lg transition-colors duration-200"
                aria-label="Notifications"
              >
                <Bell size={20} />
                {notifications > 0 && (
                  <span className="absolute top-1 right-1 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-purple-600 rounded-full">
                    {notifications}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-700/30 rounded-lg transition-colors duration-200"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <nav className="md:hidden border-t border-cyan-600/50 py-3 px-2 bg-slate-800/50">
              <div className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.path)
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                        active
                          ? 'text-cyan-400 bg-slate-700/50 border border-cyan-500/50'
                          : 'text-slate-300 hover:text-cyan-400 hover:bg-slate-700/30'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="flex-1">{item.label}</span>
                      {item.badge > 0 && (
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-purple-600 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>
            </nav>
          )}
        </div>
      </header>
    </>
  )
}

