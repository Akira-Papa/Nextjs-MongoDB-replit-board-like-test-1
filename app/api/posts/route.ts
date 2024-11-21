import { NextResponse } from 'next/server'
import connectDB from '../../../lib/mongodb'
import { Post } from '../../../models/post'

export async function GET() {
  try {
    await connectDB()
    const posts = await Post.find()
      .populate('likes')
      .sort({ createdAt: -1 })
      .lean()
    return NextResponse.json(posts)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    await connectDB()
    const formData = await request.formData()
    const content = formData.get('content')

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    const post = await Post.create({
      content,
    })

    const populatedPost = await Post.findById(post._id)
      .populate('likes')
      .lean()

    return NextResponse.json(populatedPost)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
