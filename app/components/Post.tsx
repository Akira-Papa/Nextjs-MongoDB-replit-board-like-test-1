'use client'

import { useState } from 'react'

interface PostProps {
  post: {
    _id: string
    content: string
    createdAt: string
    likes: any[]
  }
}

export default function Post({ post }: PostProps) {
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0)
  const [isLiking, setIsLiking] = useState(false)

  const handleLike = async () => {
    if (isLiking) return
    setIsLiking(true)
    
    // Optimistic update
    setLikeCount(prev => prev + 1)

    try {
      const response = await fetch(`/api/posts/${post._id}/like`, {
        method: 'POST',
      })
      
      if (!response.ok) {
        // Revert optimistic update if failed
        setLikeCount(prev => prev - 1)
        throw new Error('Failed to like post')
      }

      const data = await response.json()
      // Update with actual count from server
      setLikeCount(data.likeCount)
    } catch (error) {
      console.error('Error liking post:', error)
    } finally {
      setIsLiking(false)
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/posts/${post._id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        // Refresh the page to show updated list
        window.location.reload()
      }
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <p className="text-lg mb-4">{post.content}</p>
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>
          {new Date(post.createdAt).toLocaleDateString('ja-JP')}
        </span>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLike}
            disabled={isLiking}
            className="flex items-center space-x-1 text-pink-500 hover:text-pink-600"
          >
            <span>♥</span>
            <span>{likeCount}</span>
          </button>
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-600"
          >
            削除
          </button>
        </div>
      </div>
    </div>
  )
}
