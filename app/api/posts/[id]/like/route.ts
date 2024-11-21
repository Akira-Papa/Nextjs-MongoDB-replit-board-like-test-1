import { NextResponse } from 'next/server'
import connectDB from '../../../../../lib/mongodb'
import { Post, Like } from '../../../../../models/post'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const post = await Post.findById(params.id)
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Find existing like
    const existingLike = await Like.findOne({ postId: params.id })

    let updatedPost
    if (existingLike) {
      // Remove like
      await Like.deleteOne({ _id: existingLike._id })
      updatedPost = await Post.findByIdAndUpdate(
        params.id,
        { $pull: { likes: existingLike._id } },
        { new: true }
      ).populate('likes')
    } else {
      // Add new like
      const newLike = await Like.create({ postId: params.id })
      updatedPost = await Post.findByIdAndUpdate(
        params.id,
        { $push: { likes: newLike._id } },
        { new: true }
      ).populate('likes')
    }

    return NextResponse.json({
      message: existingLike ? 'Like removed' : 'Post liked',
      likeCount: updatedPost.likes.length,
      isLiked: !existingLike
    })
  } catch (error) {
    console.error('Error toggling like:', error)
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    )
  }
}
