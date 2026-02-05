import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'

const execAsync = promisify(exec)

// Allowed branches for security
const ALLOWED_BRANCHES = ['main', 'empty_state_01', 'empty_state_02', 'empty_state_03', 'prototype_showcase', 'with_integration_logos']

export async function POST(request: Request) {
  try {
    const { branch } = await request.json()

    if (!branch || typeof branch !== 'string') {
      return NextResponse.json({ error: 'Branch name is required' }, { status: 400 })
    }

    // Security check: only allow specific branches
    if (!ALLOWED_BRANCHES.includes(branch)) {
      return NextResponse.json({ error: 'Invalid branch name' }, { status: 400 })
    }

    // Get the project root directory (parent of new-dialog)
    const projectRoot = path.resolve(process.cwd(), '..')

    // Checkout the branch
    await execAsync(`git checkout ${branch}`, {
      cwd: projectRoot,
    })

    return NextResponse.json({ success: true, branch })
  } catch (error: any) {
    console.error('Error switching branch:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to switch branch' },
      { status: 500 }
    )
  }
}
