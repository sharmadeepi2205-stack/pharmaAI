const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')

const app = express()

app.use(cors())
app.use(express.json())

// Health check endpoint (for Render monitoring)
app.get('/', (req, res) => {
  console.log('GET / - Health check endpoint called')
  res.status(200).json({ 
    success: true,
    message: 'PharmaGuard Backend is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  })
})

// Load routes after health check
let analyzeRoute
try {
  analyzeRoute = require('./routes/analyze')
  console.log('✓ Analyze route loaded successfully')
} catch (err) {
  console.error('⚠ Warning: Error loading analyze route:', err.message)
  console.error('Stack:', err.stack)
  // Don't exit - health check and logs endpoints will still work
  analyzeRoute = express.Router()
  analyzeRoute.post('/', (req, res) => {
    res.status(500).json({ 
      success: false, 
      error: 'Analyze service unavailable - route failed to load' 
    })
  })
}

// Ensure logs directory exists
const logsDir = path.join(__dirname, 'logs')
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true })
}

// Get all logs (define BEFORE app.use('/api', analyzeRoute))
app.get('/api/logs', (req, res) => {
  try {
    const logsFile = path.join(logsDir, 'analysis_logs.json')
    
    if (!fs.existsSync(logsFile)) {
      return res.json({ success: true, logs: [], total: 0 })
    }
    
    const raw = fs.readFileSync(logsFile, 'utf8')
    const logs = JSON.parse(raw)
    
    res.json({ 
      success: true, 
      logs: Array.isArray(logs) ? logs : [], 
      total: Array.isArray(logs) ? logs.length : 0 
    })
  } catch (err) {
    console.error('Error reading logs:', err)
    res.status(500).json({ success: false, error: 'Failed to read logs' })
  }
})

// Clear logs (optional)
app.delete('/api/logs', (req, res) => {
  try {
    const logsFile = path.join(logsDir, 'analysis_logs.json')
    if (fs.existsSync(logsFile)) {
      fs.unlinkSync(logsFile)
    }
    res.json({ success: true, message: 'Logs cleared' })
  } catch (err) {
    console.error('Error clearing logs:', err)
    res.status(500).json({ success: false, error: 'Failed to clear logs' })
  }
})

app.use('/api', analyzeRoute)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(500).json({ success: false, error: err.message})
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Backend listening on ${PORT}`)
  console.log(`Server running at http://localhost:${PORT}`)
})

// Export logsDir for use in other modules
module.exports = { logsDir }
