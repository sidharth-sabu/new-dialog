import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'

const execAsync = promisify(exec)

export async function GET() {
  try {
    // Get the project root directory (parent of new-dialog)
    const projectRoot = path.resolve(process.cwd(), '..')
    
    const { stdout } = await execAsync('git rev-parse --abbrev-ref HEAD', {
      cwd: projectRoot,
    })
    
    return NextResponse.json({ branch: stdout.trim() })
  } catch (error) {
    console.error('Error getting current branch:', error)
    return NextResponse.json({ error: 'Failed to get current branch' }, { status: 500 })
  }
}
