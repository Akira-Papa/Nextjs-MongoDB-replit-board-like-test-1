'use client'

import { useState } from 'react'

interface PostProps {
  post: {
    _id: string
    content: string
    createdAt: string
    likes: any[]
  }
  onDelete: (postId: string) => Promise<void>
  onEdit: (postId: string, newContent: string) => Promise<void>
}

export default function Post({ post, onDelete, onEdit }: PostProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(post.content)
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0)
  const [isLiked, setIsLiked] = useState(post.likes?.length > 0)
  const [isLiking, setIsLiking] = useState(false)

  const handleLike = async () => {
    if (isLiking) return
    setIsLiking(true)
    
    // Optimistic update
    const newLikeCount = isLiked ? likeCount - 1 : likeCount + 1
    setLikeCount(newLikeCount)
    setIsLiked(!isLiked)

    try {
      const response = await fetch(`/api/posts/${post._id}/like`, {
        method: 'POST',
      })
      
      if (!response.ok) {
        // Revert optimistic update if failed
        setLikeCount(likeCount)
        setIsLiked(isLiked)
        throw new Error('Failed to toggle like')
      }

      const data = await response.json()
      // Update with actual count from server
      setLikeCount(data.likeCount)
      setIsLiked(data.isLiked)
    } catch (error) {
      console.error('Error toggling like:', error)
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

  const handleEdit = async () => {
    try {
      await onEdit(post._id, editContent)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating post:', error)
    }
  }

  if (isEditing) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="w-full p-2 border rounded mb-2"
          rows={4}
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            キャンセル
          </button>
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            更新
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <p className="text-lg mb-4">{post.content}</p>
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span suppressHydrationWarning>
          {new Date(post.createdAt).toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' })}
        </span>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-500 hover:text-blue-600"
          >
            編集
          </button>
          <button
            onClick={handleLike}
            disabled={isLiking}
            className="flex items-center space-x-1 text-pink-500 hover:text-pink-600"
          >
            <span>♥</span>
            <span>{likeCount}</span>
          </button>
          <button
            onClick={() => onDelete(post._id)}
            className="text-red-500 hover:text-red-600"
          >
            削除
          </button>
        </div>
      </div>
    </div>
  )
}
