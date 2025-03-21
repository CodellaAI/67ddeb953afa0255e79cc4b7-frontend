
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import Image from 'next/image'
import { FaRegCalendarAlt } from 'react-icons/fa'
import moment from 'moment'
import PostCard from '@/components/PostCard'
import Loading from '@/components/Loading'
import UserTabs from '@/components/UserTabs'

export default function UserProfilePage() {
  const params = useParams()
  const { username } = params
  
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [comments, setComments] = useState([])
  const [activeTab, setActiveTab] = useState('posts')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [userResponse, postsResponse, commentsResponse] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${username}`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/posts?author=${username}`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/comments?author=${username}`)
        ])
        
        setUser(userResponse.data)
        setPosts(postsResponse.data)
        setComments(commentsResponse.data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching user data:', error)
        setLoading(false)
      }
    }

    fetchUserData()
  }, [username])

  if (loading) return <Loading />

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="card p-8 text-center">
          <h3 className="text-xl font-semibold">User not found</h3>
          <p className="text-gray-500 mt-2">The user you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="card p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-24 h-24 relative rounded-full overflow-hidden">
            <Image 
              src={user.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'} 
              alt={username}
              fill
              className="object-cover"
            />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold mb-2">{username}</h1>
            <div className="flex items-center justify-center md:justify-start text-gray-500 mb-4">
              <FaRegCalendarAlt className="mr-2" />
              <span>Account created {moment(user.createdAt).format('MMMM D, YYYY')}</span>
            </div>
            <p className="text-gray-700">{user.bio || 'No bio provided.'}</p>
          </div>
          
          <div className="flex flex-col items-center space-y-2">
            <div className="text-center">
              <div className="text-xl font-bold">{user.karma || 0}</div>
              <div className="text-gray-500 text-sm">karma</div>
            </div>
          </div>
        </div>
      </div>
      
      <UserTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="mt-4">
        {activeTab === 'posts' && (
          posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map(post => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <div className="card p-8 text-center">
              <h3 className="text-xl font-semibold">No posts yet</h3>
              <p className="text-gray-500 mt-2">This user hasn't made any posts.</p>
            </div>
          )
        )}
        
        {activeTab === 'comments' && (
          comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map(comment => (
                <div key={comment._id} className="card p-4">
                  <div className="text-xs text-gray-500 mb-1">
                    Comment on <a href={`/r/${comment.post.community}/${comment.post._id}`} className="text-reddit-blue hover:underline">
                      {comment.post.title}
                    </a>
                  </div>
                  <p className="text-gray-800">{comment.content}</p>
                  <div className="text-xs text-gray-500 mt-2">
                    {moment(comment.createdAt).fromNow()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card p-8 text-center">
              <h3 className="text-xl font-semibold">No comments yet</h3>
              <p className="text-gray-500 mt-2">This user hasn't made any comments.</p>
            </div>
          )
        )}
      </div>
    </div>
  )
}
