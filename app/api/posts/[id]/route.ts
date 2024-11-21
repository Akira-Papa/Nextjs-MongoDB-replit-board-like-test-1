import { NextResponse } from 'next/server'
import connectDB from '../../../../lib/mongodb'
import { Post, Like } from '../../../../models/post'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    await Like.deleteMany({ postId: params.id })
    await Post.findByIdAndDelete(params.id)
    return NextResponse.redirect(new URL('/', request.url))
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    )
  }
}
