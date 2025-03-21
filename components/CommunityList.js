
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { FaReddit } from 'react-icons/fa'

export default function CommunityList() {
  const [communities, setCommunities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/communities/popular`)
        setCommunities(response.data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching communities:', error)
        setLoading(false)
      }
    }

    fetchCommunities()
  }, [])

  return (
    <div className="card p-4">
      <h2 className="text-lg font-bold mb-4">Popular Communities</h2>
      
      {loading ? (
        <div className="flex justify-center py-4">
          <div className="animate-pulse h-4 bg-gray-200 rounded w-3/4 mb-2.5"></div>
          <div className="animate-pulse h-4 bg-gray-200 rounded w-3/4 mb-2.5"></div>
          <div className="animate-pulse h-4 bg-gray-200 rounded w-3/4 mb-2.5"></div>
        </div>
      ) : communities.length > 0 ? (
        <ul className="space-y-2">
          {communities.map(community => (
            <li key={community._id}>
              <Link 
                href={`/r/${community.name}`}
                className="flex items-center p-2 hover:bg-gray-50 rounded"
              >
                <div className="w-8 h-8 mr-2 bg-reddit-orange rounded-full flex items-center justify-center text-white">
                  <FaReddit />
                </div>
                <div>
                  <div className="font-medium">r/{community.name}</div>
                  <div className="text-xs text-gray-500">{community.memberCount} members</div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center py-2">No communities found</p>
      )}
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <Link href="/create-community" className="btn-primary w-full">
          Create Community
        </Link>
      </div>
    </div>
  )
}
