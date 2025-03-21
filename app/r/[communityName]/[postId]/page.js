
'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import PostDetail from '@/components/PostDetail'
import CommentSection from '@/components/CommentSection'
import Loading from '@/components/Loading'
import CommunityInfo from '@/components/CommunityInfo'

export default function PostPage() {
  const params = useParams()
  const router = useRouter()
  const { communityName, postId } = params
  
  const [post, setPost] = useState(null)
  const [community, setCommunity] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const [postResponse, communityResponse] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/communities/${communityName}`)
        ])
        
        setPost(postResponse.data)
        setCommunity(communityResponse.data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching post data:', error)
        setLoading(false)
      }
    }

    fetchPostData()
  }, [postId, communityName])

  if (loading) return <Loading />

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="card p-8 text-center">
          <h3 className="text-xl font-semibold">Post not found</h3>
          <p className="text-gray-500 mt-2">The post you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => router.back()} 
            className="mt-4 btn-secondary"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-2/3">
          <PostDetail post={post} />
          <CommentSection postId={postId} />
        </div>
        
        <div className="md:w-1/3 space-y-4">
          {community && <CommunityInfo community={community} />}
          
          <div className="card p-4">
            <h2 className="text-lg font-bold mb-4">Posting Rules</h2>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>Be respectful in discussions</li>
              <li>Stay on topic</li>
              <li>Provide sources when necessary</li>
              <li>No personal attacks</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
