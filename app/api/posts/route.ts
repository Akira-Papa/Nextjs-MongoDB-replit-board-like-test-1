import { NextResponse } from 'next/server';
import connectDB from '../../lib/mongodb';
import { Post, Like } from '../../models/post';

export async function GET() {
  try {
    await connectDB();
    const posts = await Post.aggregate([
      {
        $lookup: {
          from: 'likes',
          localField: '_id',
          foreignField: 'postId',
          as: 'likes'
        }
      },
      {
        $addFields: {
          likeCount: { $size: '$likes' }
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: '投稿の取得に失敗しました' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const json = await request.json();
    const { title, content, userId, username } = json;

    if (!title || !content || !userId || !username) {
      return NextResponse.json(
        { error: 'すべての必須フィールドを入力してください' },
        { status: 400 }
      );
    }

    const post = new Post({
      title,
      content,
      userId,
      username
    });

    await post.save();
    
    // Populate the likes count for the new post
    const populatedPost = await Post.aggregate([
      {
        $match: { _id: post._id }
      },
      {
        $lookup: {
          from: 'likes',
          localField: '_id',
          foreignField: 'postId',
          as: 'likes'
        }
      },
      {
        $addFields: {
          likeCount: { $size: '$likes' }
        }
      }
    ]).then(results => results[0]);

    return NextResponse.json(populatedPost);
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: '投稿の作成に失敗しました' },
      { status: 500 }
    );
  }
}
