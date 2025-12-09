import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * One-time database migration endpoint
 * Visit this endpoint ONCE after deployment to create all database tables
 *
 * Usage: GET https://your-app.vercel.app/api/migrate
 *
 * Security: Should be protected or removed after first use
 */
export async function GET() {
  try {
    // Test database connection
    await prisma.$connect()

    // Check if tables already exist by trying to count users
    try {
      await prisma.user.count()
      return NextResponse.json({
        success: true,
        message: 'Database tables already exist. Migration not needed.',
        tablesExist: true,
      })
    } catch (error: any) {
      // If tables don't exist, we'll get an error
      if (error.code === 'P2021') {
        // This is expected - tables don't exist yet
        return NextResponse.json({
          success: false,
          error: 'Tables do not exist. Please run: npx prisma db push',
          instructions: {
            step1: 'Install Vercel CLI: npm install -g vercel',
            step2: 'Login: vercel login',
            step3: 'Pull environment variables: vercel env pull .env.production',
            step4: 'Run migration: npx prisma db push',
            alternative: 'Or set build command in Vercel to: prisma generate && prisma db push && next build',
          },
          note: 'You cannot run migrations directly from an API endpoint due to Prisma limitations in serverless environments.',
        }, { status: 500 })
      }

      throw error
    }
  } catch (error: any) {
    console.error('Migration check error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to check database status',
      details: error.message,
      code: error.code,
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
