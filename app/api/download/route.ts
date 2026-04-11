import { NextResponse } from 'next/server'

// Update this URL each time you release a new version
const LATEST_RELEASE_URL =
  'https://github.com/jaudi/financeplots-desktop/releases/download/v0.1.0/FinancePlots-v0.1.0-win-x64.zip'

export async function GET() {
  return NextResponse.redirect(LATEST_RELEASE_URL, { status: 302 })
}
