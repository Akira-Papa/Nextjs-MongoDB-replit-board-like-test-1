import { NextResponse } from 'next/server'
import connectDB from '../../../lib/mongodb'
import { Post } from '../../../models/post'

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

    return NextResponse.redirect(new URL('/', request.url))
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
