import React, { useState } from 'react'
import Header from '../components/Header'
import {
  Bell,
  Download,
  Lock,
  User,
  LogOut,
  Info,
  Shield,
  FileJson,
  Zap,
  Eye,
  Database,
  HelpCircle,
  ChevronRight,
} from 'lucide-react'

export default function Settings() {
  const [notifications, setNotifications] = useState({
    analysisComplete: true,
    exportReminder: false,
    securityAlerts: true,
  })
  const [fontSize, setFontSize] = useState('medium')
  const [dataRetention, setDataRetention] = useState('90')
  const [expandedSection, setExpandedSection] = useState('profile')

  const handleNotificationChange = (key) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key],
    })
  }

  const handleExportData = () => {
    const data = {
      exportDate: new Date().toISOString(),
      appVersion: '1.0.0',
      userPreferences: {
        notifications,
        fontSize,
        dataRetention,
      },
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `pharmaguard-settings-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const SettingSection = ({ id, icon: Icon, title, subtitle, children }) => {
    const isExpanded = expandedSection === id
    return (
      <div
        className={`bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg border transition-all duration-300 ${
          isExpanded ? 'border-cyan-600/50 shadow-lg shadow-cyan-600/20' : 'border-slate-700 hover:border-slate-600'
        }`}
      >
        <button
          onClick={() => setExpandedSection(isExpanded ? null : id)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors duration-200"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-cyan-600/20 to-purple-600/20 rounded-lg border border-cyan-500/30">
              <Icon size={20} className="text-cyan-400" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-cyan-300">{title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
            </div>
          </div>
          <ChevronRight
            size={20}
            className={`text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}
          />
        </button>

        {isExpanded && <div className="px-6 py-4 border-t border-slate-700/50">{children}</div>}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-cyan-300 mb-2">Settings</h1>
          <p className="text-slate-400">Manage your PharmaGuard preferences and account</p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-4">
          {/* Profile Section */}
          <SettingSection
            id="profile"
            icon={User}
            title="Profile"
            subtitle="Manage your profile information"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-cyan-300 mb-2">User ID</label>
                <input
                  type="text"
                  value="PATIENT_001"
                  disabled
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-cyan-300 mb-2">Account Status</label>
                <div className="px-4 py-2.5 bg-green-950/30 border border-green-600/50 rounded-lg text-green-400 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Active
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-cyan-300 mb-2">Account Created</label>
                <input
                  type="text"
                  value={new Date().toLocaleDateString()}
                  disabled
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300 cursor-not-allowed"
                />
              </div>
            </div>
          </SettingSection>

          {/* Display Preferences */}
          <SettingSection
            id="display"
            icon={Eye}
            title="Display Preferences"
            subtitle="Customize how PharmaGuard looks"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-cyan-300 mb-2">Font Size</label>
                <div className="space-y-2">
                  {['small', 'medium', 'large'].map((size) => (
                    <label key={size} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="fontSize"
                        value={size}
                        checked={fontSize === size}
                        onChange={(e) => setFontSize(e.target.value)}
                        className="w-4 h-4 text-cyan-600"
                      />
                      <span className="text-slate-300 capitalize">
                        {size} {size === 'medium' && '(Default)'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="pt-2 border-t border-slate-700">
                <p className="text-xs text-slate-400">
                  Theme: <span className="text-cyan-400 font-semibold">Dark Professional</span>
                </p>
              </div>
            </div>
          </SettingSection>

          {/* Notifications */}
          <SettingSection
            id="notifications"
            icon={Bell}
            title="Notifications"
            subtitle="Control how you receive alerts"
          >
            <div className="space-y-3">
              {[
                {
                  key: 'analysisComplete',
                  label: 'Analysis Complete',
                  desc: 'Notify when analysis finishes processing',
                },
                {
                  key: 'exportReminder',
                  label: 'Export Reminders',
                  desc: 'Remind to export analysis results',
                },
                {
                  key: 'securityAlerts',
                  label: 'Security Alerts',
                  desc: 'Alert about important security updates',
                },
              ].map((item) => (
                <label key={item.key} className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg cursor-pointer hover:bg-slate-800/50 transition-colors duration-200">
                  <input
                    type="checkbox"
                    checked={notifications[item.key]}
                    onChange={() => handleNotificationChange(item.key)}
                    className="w-4 h-4 text-cyan-600 rounded"
                  />
                  <div>
                    <p className="text-sm font-medium text-cyan-300">{item.label}</p>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </SettingSection>

          {/* Data Management */}
          <SettingSection
            id="data"
            icon={Database}
            title="Data Management"
            subtitle="Control your analysis data"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-cyan-300 mb-2">Auto Data Retention</label>
                <select
                  value={dataRetention}
                  onChange={(e) => setDataRetention(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="30">30 days</option>
                  <option value="90">90 days (Default)</option>
                  <option value="180">180 days</option>
                  <option value="365">1 year</option>
                  <option value="forever">Forever</option>
                </select>
                <p className="text-xs text-slate-400 mt-2">
                  Analysis data older than selected period will be automatically deleted.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-700">
                <button
                  onClick={handleExportData}
                  className="w-full px-4 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30"
                >
                  <Download size={18} />
                  Export Settings & Preferences
                </button>
              </div>
            </div>
          </SettingSection>

          {/* Privacy & Security */}
          <SettingSection
            id="security"
            icon={Shield}
            title="Privacy & Security"
            subtitle="Manage your security settings"
          >
            <div className="space-y-4">
              <div className="p-4 bg-green-950/20 border border-green-600/30 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Lock size={16} className="text-green-400" />
                  <span className="text-sm font-semibold text-green-400">Data Encryption</span>
                </div>
                <p className="text-xs text-slate-400">
                  All your genomic data and analysis results are encrypted in transit and at rest.
                </p>
              </div>
              <div className="p-4 bg-blue-950/20 border border-blue-600/30 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Shield size={16} className="text-blue-400" />
                  <span className="text-sm font-semibold text-blue-400">HIPAA Compliant</span>
                </div>
                <p className="text-xs text-slate-400">
                  PharmaGuard complies with HIPAA regulations for healthcare data protection.
                </p>
              </div>
              <div className="p-4 bg-purple-950/20 border border-purple-600/30 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Eye size={16} className="text-purple-400" />
                  <span className="text-sm font-semibold text-purple-400">Privacy Policy</span>
                </div>
                <p className="text-xs text-slate-400">
                  Your data is never shared with third parties. View our detailed privacy policy.
                </p>
              </div>
            </div>
          </SettingSection>

          {/* About & Support */}
          <SettingSection
            id="about"
            icon={Info}
            title="About & Support"
            subtitle="Get help and information"
          >
            <div className="space-y-4">
              <div>
                <p className="text-sm text-cyan-300 font-semibold mb-1">Application Version</p>
                <p className="text-slate-400">v1.0.0 (2026)</p>
              </div>
              <div>
                <p className="text-sm text-cyan-300 font-semibold mb-1">API Version</p>
                <p className="text-slate-400">v1.0 - CPIC Guidelines Integrated</p>
              </div>
              <div className="pt-2 border-t border-slate-700 space-y-2">
                <button className="w-full px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors duration-200 flex items-center gap-2 justify-center border border-slate-700">
                  <HelpCircle size={16} />
                  Documentation & Help
                </button>
                <button className="w-full px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors duration-200 flex items-center gap-2 justify-center border border-slate-700">
                  <Zap size={16} />
                  Report an Issue
                </button>
              </div>
            </div>
          </SettingSection>

          {/* Danger Zone */}
          <SettingSection
            id="danger"
            icon={LogOut}
            title="Danger Zone"
            subtitle="Account actions"
          >
            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-red-950/30 hover:bg-red-950/50 border border-red-600/50 text-red-400 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
                <LogOut size={18} />
                Logout
              </button>
              <button className="w-full px-4 py-3 bg-red-950/30 hover:bg-red-950/50 border border-red-600/50 text-red-300 font-semibold rounded-lg transition-all duration-200 text-sm">
                Delete Account & Data
              </button>
              <p className="text-xs text-slate-500 text-center italic">
                This action is irreversible. All your data will be permanently deleted.
              </p>
            </div>
          </SettingSection>
        </div>

        {/* Footer Info */}
        <div className="mt-8 p-4 bg-slate-800/30 border border-slate-700 rounded-lg text-center">
          <p className="text-xs text-slate-400">
            PharmaGuard © 2026 • Powered by CPIC Guidelines • Made for healthcare professionals
          </p>
        </div>
      </div>
    </div>
  )
}
