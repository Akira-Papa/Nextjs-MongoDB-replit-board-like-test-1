'use client'

import { useState, useEffect } from 'react'
import Post from './components/Post'
import { Box, Paper, TextField, Button, CircularProgress } from '@mui/material'
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
    <Box>
      <Paper 
        component="form" 
        onSubmit={handleSubmit} 
        elevation={2}
        sx={{ 
          p: 3, 
          mb: 4,
          backgroundColor: 'background.paper',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
          }
        }}
      >
        <TextField
          multiline
          rows={4}
          fullWidth
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="投稿を書いてください..."
          required
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            startIcon={
              isSubmitting ? (
                <CircularProgress size={20} color="inherit" />
              ) : null
            }
            sx={{
              minWidth: 120,
              position: 'relative',
            }}
          >
            {isSubmitting ? '投稿中...' : '投稿する'}
          </Button>
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
