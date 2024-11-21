import { NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const existingLike = await prisma.like.findUnique({
      where: { postId: id },
    })

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id },
      })
    } else {
      await prisma.like.create({
        data: { postId: id },
      })
    }

    return NextResponse.redirect(new URL('/', request.url))
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    )
  }
}
