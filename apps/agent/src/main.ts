#!/usr/bin/env node
import { startServer } from './server'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const PORT = parseInt(process.env.PORT || '2024')

// Start the server
startServer(PORT).catch((error) => {
  console.error('Failed to start server:', error)
  process.exit(1)
})
