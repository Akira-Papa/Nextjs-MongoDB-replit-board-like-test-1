'use client'

import { useState } from 'react'
import { Card, CardContent, CardActions, Typography, TextField, Button, IconButton, Box } from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon, Favorite as FavoriteIcon } from '@mui/icons-material'

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
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button
              variant="outlined"
              onClick={() => setIsEditing(false)}
            >
              キャンセル
            </Button>
            <Button
              variant="contained"
              onClick={handleEdit}
            >
              更新
            </Button>
          </Box>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {post.content}
        </Typography>
        <Typography variant="caption" color="text.secondary" suppressHydrationWarning>
          {new Date(post.createdAt).toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' })}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <IconButton
          onClick={handleLike}
          disabled={isLiking}
          color={isLiked ? "error" : "default"}
          size="small"
        >
          <FavoriteIcon />
          <Typography variant="caption" sx={{ ml: 0.5 }}>
            {likeCount}
          </Typography>
        </IconButton>
        <IconButton
          onClick={() => setIsEditing(true)}
          color="primary"
          size="small"
        >
          <EditIcon />
        </IconButton>
        <IconButton
          onClick={() => onDelete(post._id)}
          color="error"
          size="small"
        >
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  )
}
