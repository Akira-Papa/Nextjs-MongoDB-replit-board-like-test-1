import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    await prisma.like.deleteMany({
      where: { postId: id },
    })
    await prisma.post.delete({
      where: { id },
    })
    return NextResponse.redirect(new URL('/', request.url))
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    )
  }
}
