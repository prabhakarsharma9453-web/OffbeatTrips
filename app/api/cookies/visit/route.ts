import { NextRequest, NextResponse } from 'next/server'
import { getVisitInfo, setVisitInfo } from '@/lib/cookies-server'

/**
 * GET - Get visit information
 */
export async function GET(request: NextRequest) {
  try {
    const visitInfo = await getVisitInfo()

    if (!visitInfo) {
      // First visit - initialize
      const firstVisit = new Date()
      await setVisitInfo(1, firstVisit)

      return NextResponse.json({
        success: true,
        data: {
          count: 1,
          firstVisit: firstVisit.toISOString(),
          lastVisit: firstVisit.toISOString(),
        },
      })
    }

    // Update visit count and last visit
    const updatedCount = visitInfo.count + 1
    const firstVisit = new Date(visitInfo.firstVisit)
    await setVisitInfo(updatedCount, firstVisit)

    return NextResponse.json({
      success: true,
      data: {
        count: updatedCount,
        firstVisit: visitInfo.firstVisit,
        lastVisit: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Error handling visit info:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get visit information',
      },
      { status: 500 }
    )
  }
}
