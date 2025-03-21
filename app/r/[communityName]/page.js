
'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'next/navigation'
import PostCard from '@/components/PostCard'
import CommunityHeader from '@/components/CommunityHeader'
import CreatePostPrompt from '@/components/CreatePostPrompt'
import FeedFilter from '@/components/FeedFilter'
import Loading from '@/components/Loading'
import CommunityInfo from '@/components/CommunityInfo'

export default function CommunityPage() {
  const params = useParams()
  const { communityName } = params
  
  const [community, setCommunity] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('hot')

  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        const [communityResponse, postsResponse] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/communities/${communityName}`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/posts?community=${communityName}&sort=${filter}`)
        ])
        
        setCommunity(communityResponse.data)
        setPosts(postsResponse.data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching community data:', error)
        setLoading(false)
      }
    }

    fetchCommunityData()
  }, [communityName, filter])

  if (loading) return <Loading />

  if (!community) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="card p-8 text-center">
          <h3 className="text-xl font-semibold">Community not found</h3>
          <p className="text-gray-500 mt-2">The community you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <CommunityHeader community={community} />
      
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-2/3">
            <CreatePostPrompt community={community} />
            <FeedFilter currentFilter={filter} setFilter={setFilter} />
            
            {posts.length > 0 ? (
              <div className="space-y-4">
                {posts.map(post => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            ) : (
              <div className="card p-8 text-center">
                <h3 className="text-xl font-semibold">No posts in this community yet</h3>
                <p className="text-gray-500 mt-2">Be the first to create a post!</p>
              </div>
            )}
          </div>
          
          <div className="md:w-1/3 space-y-4">
            <CommunityInfo community={community} />
          </div>
        </div>
      </div>
    </div>
  )
}
