'use client'

import { useState, useEffect } from 'react'
import { getCurrentUser, User } from './lib/user'
import Post from './components/Post'
import { Box, Paper, TextField, Button, CircularProgress } from '@mui/material'
import { Post as PostType } from '@/app/types/post'

export default function Home() {
  const [posts, setPosts] = useState<PostType[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const user = getCurrentUser()
    setCurrentUser(user)
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts')
      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }
      const data = await response.json()
      setPosts(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching posts:', error)
      setPosts([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim() || isSubmitting || !currentUser) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          userId: currentUser.userId,
          username: currentUser.username,
        }),
      })

      if (response.ok) {
        const newPost = await response.json()
        setPosts([newPost, ...posts])
        setTitle('')
        setContent('')
      }
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (postId: string) => {
    if (!currentUser) return

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: currentUser.userId }),
      })
      
      if (response.ok) {
        setPosts(posts.filter(post => post._id !== postId))
      }
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  const handleEdit = async (postId: string, newTitle: string, newContent: string) => {
    if (!currentUser) return

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTitle.trim(),
          content: newContent.trim(),
          userId: currentUser.userId,
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update post')
      }
      
      const updatedPost = await response.json()
      setPosts(posts.map(post => 
        post.id === postId ? updatedPost : post
      ))
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
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="タイトルを入力..."
          required
          variant="outlined"
          sx={{ mb: 2 }}
        />
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
            disabled={isSubmitting || !currentUser}
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
            currentUser={currentUser}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </Box>
    </Box>
  )
}
