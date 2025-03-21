
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { FaReddit } from 'react-icons/fa'
import { useAuth } from '@/context/AuthContext'

export default function CommunityHeader({ community }) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [isJoined, setIsJoined] = useState(community.isJoined)
  const [memberCount, setMemberCount] = useState(community.memberCount)
  const [isLoading, setIsLoading] = useState(false)

  const handleJoinCommunity = async () => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    
    setIsLoading(true)
    
    try {
      if (isJoined) {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/communities/${community.name}/leave`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        )
        setIsJoined(false)
        setMemberCount(prev => prev - 1)
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/communities/${community.name}/join`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        )
        setIsJoined(true)
        setMemberCount(prev => prev + 1)
      }
    } catch (error) {
      console.error('Error joining/leaving community:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-reddit-blue text-white">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mr-4">
            <FaReddit className="text-reddit-orange text-4xl" />
          </div>
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold">r/{community.name}</h1>
            <p className="text-sm text-gray-200">{memberCount} members</p>
          </div>
          
          <button
            onClick={handleJoinCommunity}
            disabled={isLoading}
            className={`px-4 py-1.5 rounded-full font-medium ${
              isJoined 
                ? 'bg-white text-reddit-blue hover:bg-gray-200' 
                : 'bg-reddit-orange text-white hover:bg-reddit-hover'
            }`}
          >
            {isLoading ? '...' : isJoined ? 'Joined' : 'Join'}
          </button>
        </div>
      </div>
    </div>
  )
}
