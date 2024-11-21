import connectDB from '../lib/mongodb'
import { Post } from '../models/post'

async function getPosts() {
  await connectDB()
  const posts = await Post.find()
    .populate('likes')
    .sort({ createdAt: -1 })
    .lean()
  return posts
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
          <div key={post._id} className="bg-white p-6 rounded-lg shadow">
            <p className="text-lg mb-4">{post.content}</p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>
                {new Date(post.createdAt).toLocaleDateString('ja-JP')}
              </span>
              <div className="flex items-center space-x-4">
                <form action={`/api/posts/${post._id}/like`} method="POST">
                  <button
                    type="submit"
                    className="flex items-center space-x-1 text-pink-500 hover:text-pink-600"
                  >
                    <span>♥</span>
                    <span>{post.likes?.length || 0}</span>
                  </button>
                </form>
                <form action={`/api/posts/${post._id}`} method="DELETE">
                  <button
                    type="submit"
                    className="text-red-500 hover:text-red-600"
                  >
                    削除
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
