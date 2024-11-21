'use client'

import { useState, useEffect } from 'react'
import { TextField, Button, Paper, Box, CircularProgress } from '@mui/material'
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
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper sx={{ p: 3, mb: 4 }} component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="投稿を書いてください..."
          variant="outlined"
          sx={{ mb: 2 }}
          required
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
          >
            投稿する
          </Button>
        </Box>
      </Paper>

      <Box>
        {posts.map((post) => (
          <Post 
            key={post._id} 
            post={post} 
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </Box>
    </Box>
  )
}
