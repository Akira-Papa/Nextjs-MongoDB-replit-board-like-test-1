import { NextResponse } from 'next/server'
import connectDB from '../../../../lib/mongodb'
import { Post, Like } from '../../../../models/post'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const { content } = await request.json()

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    const post = await Post.findByIdAndUpdate(
      params.id,
      { content },
      { new: true }
    )

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(post)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    )
  }
}

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
