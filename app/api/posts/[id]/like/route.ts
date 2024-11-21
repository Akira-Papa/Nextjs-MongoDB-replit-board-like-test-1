import { NextResponse } from 'next/server'
import connectDB from '../../../../../lib/mongodb'
import { Post, Like } from '../../../../../models/post'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const existingLike = await Like.findOne({ postId: params.id })

    if (existingLike) {
      await Like.findByIdAndDelete(existingLike._id)
      await Post.findByIdAndUpdate(params.id, {
        $pull: { likes: existingLike._id }
      })
    } else {
      const newLike = await Like.create({ postId: params.id })
      await Post.findByIdAndUpdate(params.id, {
        $push: { likes: newLike._id }
      })
    }

    const updatedPost = await Post.findById(params.id).populate('likes')
    
    return NextResponse.json({
      message: existingLike ? 'Like removed' : 'Post liked',
      likeCount: updatedPost.likes.length
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    )
  }
}
