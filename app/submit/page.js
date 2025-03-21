
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useAuth } from '@/context/AuthContext'
import PostForm from '@/components/PostForm'

export default function SubmitPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [communities, setCommunities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Redirect if not logged in
    if (!isAuthenticated && !loading) {
      router.push('/login?redirect=/submit')
      return
    }

    const fetchCommunities = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/communities`)
        setCommunities(response.data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching communities:', error)
        setLoading(false)
      }
    }

    fetchCommunities()
  }, [isAuthenticated, loading, router])

  const handleSubmit = async (postData) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts`, 
        postData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      
      // Redirect to the new post
      router.push(`/r/${response.data.community}/${response.data._id}`)
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Failed to create post. Please try again.')
    }
  }

  if (!isAuthenticated && !loading) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <div className="card p-6">
        <h1 className="text-2xl font-bold mb-6">Create a post</h1>
        <PostForm communities={communities} onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
