import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'ユーザーIDが必要です' },
        { status: 400 }
      );
    }

    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: { likes: true }
    });

    if (!post) {
      return NextResponse.json(
        { error: '投稿が見つかりません' },
        { status: 404 }
      );
    }

    // Find existing like
    const existingLike = await prisma.like.findFirst({
      where: {
        postId: params.id,
        userId: userId
      }
    });

    if (existingLike) {
      // Remove like
      await prisma.like.delete({
        where: { id: existingLike.id }
      });

      return NextResponse.json({
        message: 'いいねを取り消しました',
        likeCount: post.likes.length - 1,
        isLiked: false
      });
    } else {
      // Add new like
      await prisma.like.create({
        data: {
          postId: params.id,
          userId: userId
        }
      });

      return NextResponse.json({
        message: 'いいねしました',
        likeCount: post.likes.length + 1,
        isLiked: true
      });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json(
      { error: 'いいねの処理に失敗しました' },
      { status: 500 }
    );
  }
}
