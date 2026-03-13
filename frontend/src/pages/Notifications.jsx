import React, { useState, useEffect } from 'react'
import { Bell, Trash2, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import api from '../services/api'

export default function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchFilter, setSearchFilter] = useState('')

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await api.get('/logs')

      if (response.data && response.data.success && Array.isArray(response.data.logs)) {
        // Convert logs to notifications format
        const notificationsList = response.data.logs.map((log) => ({
          id: log.id || Math.random().toString(36).substr(2, 9),
          timestamp: new Date(log.timestamp),
          drugName: log.drugName || 'Unknown Drug',
          type: log.results?.risk_level?.toLowerCase() || 'info',
          status: log.status || 'completed',
          message: getNotificationMessage(log),
          details: log,
        }))

        setNotifications(notificationsList.reverse())
        console.log('✅ Notifications loaded:', notificationsList.length)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const getNotificationMessage = (log) => {
    const risk = log.results?.risk_level?.toLowerCase() || 'unknown'
    const interaction = log.results?.interactions || []

    if (risk === 'high') {
      return `⚠️ High-risk pharmacogenomics interaction detected for ${log.drugName}. ${interaction.length} interaction(s) found.`
    } else if (risk === 'moderate') {
      return `⚠️ Moderate-risk interaction identified for ${log.drugName}. ${interaction.length} interaction(s) found.`
    } else if (risk === 'low') {
      return `✓ Low-risk analysis completed for ${log.drugName}. Safe to proceed with standard dosing.`
    }
    return `Analysis completed for ${log.drugName}.`
  }

  const getIconForType = (type) => {
    switch (type) {
      case 'high':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'moderate':
        return <Clock className="w-5 h-5 text-amber-500" />
      default:
        return <CheckCircle className="w-5 h-5 text-green-500" />
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'high':
        return 'bg-red-500/10 border-red-500/20 text-red-400'
      case 'moderate':
        return 'bg-amber-500/10 border-amber-500/20 text-amber-400'
      default:
        return 'bg-green-500/10 border-green-500/20 text-green-400'
    }
  }

  const filteredNotifications = notifications.filter(
    (notif) =>
      notif.drugName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchFilter.toLowerCase())
  )

  const clearAllNotifications = () => {
    setNotifications([])
  }

  const clearNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-cyan-500/10 rounded-lg">
              <Bell className="w-6 h-6 text-cyan-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">Notifications</h1>
          </div>
          <p className="text-slate-400">
            Stay updated with your pharmacogenomics analysis results and alerts
          </p>
        </div>

        {/* Search and Actions */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
          {notifications.length > 0 && (
            <button
              onClick={clearAllNotifications}
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-red-400 transition-colors duration-200 flex items-center gap-2 hover:bg-red-500/10 rounded-lg"
            >
              <Trash2 size={16} />
              Clear All
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-slate-700 border-t-cyan-500 rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-slate-400">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-12 bg-slate-800/50 rounded-lg border border-slate-700">
              <Bell className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">
                {notifications.length === 0
                  ? 'No notifications yet'
                  : 'No notifications match your search'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 rounded-lg border flex items-start justify-between gap-4 hover:bg-slate-800/50 transition-colors duration-200 ${getTypeColor(
                  notif.type
                )}`}
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex-shrink-0 mt-1">
                    {getIconForType(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white truncate">
                        {notif.drugName}
                      </h3>
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-current/20">
                        {notif.type.charAt(0).toUpperCase() + notif.type.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 mb-2">{notif.message}</p>
                    <p className="text-xs text-slate-500">
                      {notif.timestamp.toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => clearNotification(notif.id)}
                  className="flex-shrink-0 p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors duration-200"
                  aria-label="Clear notification"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Stats */}
        {notifications.length > 0 && (
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <p className="text-slate-400 text-sm">Total</p>
              <p className="text-2xl font-bold text-white">{notifications.length}</p>
            </div>
            <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
              <p className="text-slate-400 text-sm">High Risk</p>
              <p className="text-2xl font-bold text-red-400">
                {notifications.filter((n) => n.type === 'high').length}
              </p>
            </div>
            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <p className="text-slate-400 text-sm">Low Risk</p>
              <p className="text-2xl font-bold text-green-400">
                {notifications.filter((n) => n.type === 'low').length}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
