import { startServer } from '../server'

// Simple test to verify server starts correctly
async function test() {
  console.log('Testing Alpha Agent Server...\n')

  try {
    const server = await startServer(3000)
    console.log('\n✅ Server started successfully!')
    console.log('Press Ctrl+C to stop the server\n')
  } catch (error) {
    console.error('❌ Server failed to start:', error)
    process.exit(1)
  }
}

test()
