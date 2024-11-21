import connectDB from '../lib/mongodb'
import { Post as PostModel } from '../models/post'
import Post from './components/Post'
import { Post as PostType } from './types/post'

async function getPosts(): Promise<PostType[]> {
  await connectDB()
  const posts = await PostModel.find()
    .populate('likes')
    .sort({ createdAt: -1 })
    .lean()
  return posts as PostType[]
}

export default async function Home() {
  const posts = await getPosts()

  return (
    <div className="max-w-2xl mx-auto">
      <form action="/api/posts" method="POST" className="mb-8">
        <textarea
          name="content"
          className="w-full p-4 border rounded-lg shadow-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={4}
          placeholder="投稿を書いてください..."
          required
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          投稿する
        </button>
      </form>

      <div className="space-y-6">
        {posts.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </div>
    </div>
  )
}
