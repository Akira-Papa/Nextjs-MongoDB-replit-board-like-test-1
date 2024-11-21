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
    
    const newLikeCount = isLiked ? likeCount - 1 : likeCount + 1
    setLikeCount(newLikeCount)
    setIsLiked(!isLiked)

    try {
      const response = await fetch(`/api/posts/${post._id}/like`, {
        method: 'POST',
      })
      
      if (!response.ok) {
        setLikeCount(likeCount)
        setIsLiked(isLiked)
        throw new Error('Failed to toggle like')
      }

      const data = await response.json()
      setLikeCount(data.likeCount)
      setIsLiked(data.isLiked)
    } catch (error) {
      console.error('Error toggling like:', error)
    } finally {
      setIsLiking(false)
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
      <div className="bg-white rounded-lg shadow-md mb-4 p-4">
        <textarea
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          rows={4}
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50"
            onClick={() => setIsEditing(false)}
          >
            キャンセル
          </button>
          <button
            className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
            onClick={handleEdit}
          >
            更新
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md mb-4">
      <div className="p-4">
        <p className="mb-2">{post.content}</p>
        <p className="text-sm text-gray-500" suppressHydrationWarning>
          {new Date(post.createdAt).toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' })}
        </p>
      </div>
      <div className="flex justify-end p-2 border-t">
        <button
          className={`p-2 rounded-full ${isLiked ? 'text-red-500' : 'text-gray-500'} hover:bg-gray-100 disabled:opacity-50`}
          onClick={handleLike}
          disabled={isLiking}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
          <span className="ml-1">{likeCount}</span>
        </button>
        <button
          className="p-2 text-blue-500 rounded-full hover:bg-gray-100"
          onClick={() => setIsEditing(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
        <button
          className="p-2 text-red-500 rounded-full hover:bg-gray-100"
          onClick={() => onDelete(post._id)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  )
}
