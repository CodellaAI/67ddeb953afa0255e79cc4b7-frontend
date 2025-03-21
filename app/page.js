
'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import PostCard from '@/components/PostCard'
import CommunityList from '@/components/CommunityList'
import CreatePostPrompt from '@/components/CreatePostPrompt'
import FeedFilter from '@/components/FeedFilter'
import Loading from '@/components/Loading'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('hot')

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/posts?sort=${filter}`)
        setPosts(response.data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching posts:', error)
        setLoading(false)
      }
    }

    fetchPosts()
  }, [filter])

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-2/3">
          <CreatePostPrompt />
          <FeedFilter currentFilter={filter} setFilter={setFilter} />
          
          {loading ? (
            <Loading />
          ) : posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map(post => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <div className="card p-8 text-center">
              <h3 className="text-xl font-semibold">No posts found</h3>
              <p className="text-gray-500 mt-2">Be the first to create a post!</p>
            </div>
          )}
        </div>
        
        <div className="md:w-1/3 space-y-4">
          <div className="card p-4">
            <h2 className="text-lg font-bold mb-4">About Reddit Clone</h2>
            <p className="text-gray-700 mb-4">
              Welcome to our Reddit Clone! This is a place to share content, discuss topics, and connect with others.
            </p>
            <button className="btn-primary w-full">Create Post</button>
          </div>
          
          <CommunityList />
          
          <div className="card p-4">
            <h2 className="text-lg font-bold mb-4">Reddit Clone Rules</h2>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>Be respectful to others</li>
              <li>No spam or self-promotion</li>
              <li>Use appropriate tags</li>
              <li>Follow community guidelines</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
