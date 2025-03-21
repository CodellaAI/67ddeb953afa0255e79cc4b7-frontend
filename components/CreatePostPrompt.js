
'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { FaImage, FaLink } from 'react-icons/fa'

export default function CreatePostPrompt({ community = null }) {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  
  const handleCreatePost = () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/submit')
      return
    }
    
    if (community) {
      router.push(`/submit?community=${community.name}`)
    } else {
      router.push('/submit')
    }
  }

  return (
    <div className="card p-2 mb-4">
      <div className="flex items-center">
        {isAuthenticated && user && (
          <div className="w-8 h-8 bg-gray-300 rounded-full mr-2"></div>
        )}
        
        <input
          type="text"
          placeholder="Create Post"
          className="flex-1 px-4 py-2 bg-gray-100 rounded-md hover:bg-white hover:border hover:border-gray-200 cursor-pointer"
          onClick={handleCreatePost}
          readOnly
        />
        
        <button 
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-full ml-2"
          onClick={handleCreatePost}
        >
          <FaImage />
        </button>
        
        <button 
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-full ml-2"
          onClick={handleCreatePost}
        >
          <FaLink />
        </button>
      </div>
    </div>
  )
}
