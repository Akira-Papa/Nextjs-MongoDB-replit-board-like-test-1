'use client'

import { useState, useEffect } from 'react'
import Post from './components/Post'
import { Post as PostType } from './types/post'

export default function Home() {
  const [posts, setPosts] = useState<PostType[]>([])
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts')
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error('Error fetching posts:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || isSubmitting) return

    setIsSubmitting(true)
    const formData = new FormData()
    formData.append('content', content)

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const newPost = await response.json()
        setPosts([newPost, ...posts])
        setContent('')
      }
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setPosts(posts.filter(post => post._id !== postId))
      }
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  const handleEdit = async (postId: string, newContent: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newContent }),
      })
      
      if (response.ok) {
        const updatedPost = await response.json()
        setPosts(posts.map(post => 
          post._id === postId ? { ...post, content: updatedPost.content } : post
        ))
      }
    } catch (error) {
      console.error('Error updating post:', error)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="mb-8">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-4 border rounded-lg shadow-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={4}
          placeholder="投稿を書いてください..."
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          投稿する
        </button>
      </form>

      <div className="space-y-6">
        {posts.map((post) => (
          <Post 
            key={post._id} 
            post={post} 
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </div>
    </div>
  )
}
