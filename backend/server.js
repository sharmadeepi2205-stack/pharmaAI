const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Root health check endpoint - MUST be before other middleware
app.get('/', (req, res) => {
  console.log('✓ GET / endpoint hit')
  return res.status(200).json({ 
    success: true,
    message: 'PharmaGuard Backend is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  })
})

// Ensure logs directory exists
const logsDir = path.join(__dirname, 'logs')
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true })
}

// Get all logs
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

// Clear logs
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

// Load and use analyze routes
let analyzeRoute
try {
  analyzeRoute = require('./routes/analyze')
  console.log('✓ Analyze route loaded successfully')
  app.use('/api', analyzeRoute)
} catch (err) {
  console.error('⚠ Error loading analyze route:', err.message)
  // Still start server with just health check
}

// 404 handler - must be LAST
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found', path: req.path })
})

// Error handler - must be LAST
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(500).json({ success: false, error: err.message })
})

const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => {
  console.log(`✓ Backend listening on port ${PORT}`)
  console.log(`✓ Health check: GET http://localhost:${PORT}/`)
})

module.exports = { logsDir, server }
