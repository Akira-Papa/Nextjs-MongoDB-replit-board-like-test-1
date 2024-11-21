export interface Post {
  _id: string
  content: string
  createdAt: string
  likes: Array<{
    _id: string
    postId: string
    createdAt: string
  }>
}

export interface LikeResponse {
  likeCount: number
  message: string
  isLiked: boolean
}
