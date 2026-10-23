import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { validateDrive } from "@/lib/drive-validation"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const drives = await prisma.placementDrive.findMany({
      orderBy: [{ driveDate: "asc" }, { createdAt: "desc" }],
    })
    return NextResponse.json(drives)
  } catch (error) {
    console.error("Could not load placement drives:", error)
    return NextResponse.json({ error: "Could not load placement drives." }, { status: 500 })
  }
}

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Please send a valid JSON body." }, { status: 400 })
  }

  const result = validateDrive(body || {})
  if (result.errors) {
    return NextResponse.json({ error: "Please check the form fields.", fields: result.errors }, { status: 400 })
  }

  try {
    const drive = await prisma.placementDrive.create({ data: result.value })
    return NextResponse.json(drive, { status: 201 })
  } catch (error) {
    console.error("Could not save placement drive:", error)
    return NextResponse.json({ error: "Could not save the placement drive." }, { status: 500 })
  }
}
