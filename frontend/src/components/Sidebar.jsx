import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, BarChart3, Clock, Settings, ChevronRight } from 'lucide-react'

export default function Sidebar() {
  const location = useLocation()

  const navigationItems = [
    {
      path: '/',
      label: 'Home',
      icon: Home,
      description: 'Dashboard overview',
    },
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      description: 'Analysis results',
    },
    {
      path: '/logs',
      label: 'Logs',
      icon: Clock,
      description: 'Analysis history',
    },
    {
      path: '/settings',
      label: 'Settings',
      icon: Settings,
      description: 'Preferences',
    },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <aside className="hidden lg:flex w-64 flex-col bg-surface-card border-r border-border-color h-screen overflow-y-auto">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-border-color">
        <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide">Navigation</h3>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group relative flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                active
                  ? 'bg-blue-50 text-primary-blue'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
              }`}
              title={item.label}
            >
              {/* Active Indicator */}
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-blue rounded-r-full"></div>
              )}

              <Icon size={20} />
              <div className="flex-1 flex flex-col">
                <span className="text-sm">{item.label}</span>
                <span
                  className={`text-xs ${
                    active ? 'text-primary-blue-light' : 'text-text-muted'
                  }`}
                >
                  {item.description}
                </span>
              </div>

              {/* Chevron Icon on Hover */}
              <ChevronRight
                size={16}
                className={`opacity-0 transition-all duration-200 ${
                  active ? 'opacity-100' : 'group-hover:opacity-100'
                }`}
              />
            </Link>
          )
        })}
      </nav>

      {/* Sidebar Footer - Healthcare Info */}
      <div className="p-4 border-t border-border-color bg-blue-50">
        <div className="p-4 bg-white rounded-lg border border-primary-blue-light">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
              <span className="text-lg">⚕️</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-primary-blue uppercase tracking-wide">
                Patient Safety
              </p>
              <p className="text-xs text-text-secondary mt-1">
                Always consult healthcare professionals for medical decisions
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

