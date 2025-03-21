
'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { FaImage, FaLink, FaPoll, FaFont } from 'react-icons/fa'

export default function PostForm({ communities, onSubmit }) {
  const searchParams = useSearchParams()
  const communityParam = searchParams.get('community')
  
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedCommunity, setSelectedCommunity] = useState('')
  const [postType, setPostType] = useState('text')
  const [imageUrl, setImageUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  useEffect(() => {
    if (communityParam && communities.some(c => c.name === communityParam)) {
      setSelectedCommunity(communityParam)
    } else if (communities.length > 0) {
      setSelectedCommunity(communities[0].name)
    }
  }, [communityParam, communities])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!title.trim() || !selectedCommunity) return
    
    setIsSubmitting(true)
    
    const postData = {
      title: title.trim(),
      community: selectedCommunity,
      postType
    }
    
    if (postType === 'text' && content.trim()) {
      postData.content = content.trim()
    } else if (postType === 'image' && imageUrl.trim()) {
      postData.image = imageUrl.trim()
    }
    
    try {
      await onSubmit(postData)
    } catch (error) {
      console.error('Error submitting post:', error)
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="community" className="block text-sm font-medium text-gray-700 mb-1">
          Community
        </label>
        <select
          id="community"
          className="input"
          value={selectedCommunity}
          onChange={(e) => setSelectedCommunity(e.target.value)}
          required
        >
          <option value="" disabled>Select a community</option>
          {communities.map(community => (
            <option key={community._id} value={community.name}>
              r/{community.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="mb-4">
        <div className="flex space-x-2 mb-4">
          <button
            type="button"
            className={`flex items-center px-4 py-2 rounded-full ${
              postType === 'text' ? 'bg-gray-200' : 'bg-transparent'
            }`}
            onClick={() => setPostType('text')}
          >
            <FaFont className="mr-2" />
            Post
          </button>
          
          <button
            type="button"
            className={`flex items-center px-4 py-2 rounded-full ${
              postType === 'image' ? 'bg-gray-200' : 'bg-transparent'
            }`}
            onClick={() => setPostType('image')}
          >
            <FaImage className="mr-2" />
            Image
          </button>
          
          <button
            type="button"
            className="flex items-center px-4 py-2 rounded-full opacity-50 cursor-not-allowed"
            disabled
          >
            <FaLink className="mr-2" />
            Link
          </button>
          
          <button
            type="button"
            className="flex items-center px-4 py-2 rounded-full opacity-50 cursor-not-allowed"
            disabled
          >
            <FaPoll className="mr-2" />
            Poll
          </button>
        </div>
        
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          id="title"
          type="text"
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          maxLength={300}
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          {300 - title.length} characters remaining
        </p>
      </div>
      
      {postType === 'text' && (
        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Text (optional)
          </label>
          <textarea
            id="content"
            className="input min-h-[200px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Text (optional)"
          ></textarea>
        </div>
      )}
      
      {postType === 'image' && (
        <div className="mb-4">
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Image URL
          </label>
          <input
            id="imageUrl"
            type="url"
            className="input"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
          {imageUrl && (
            <div className="mt-2 p-2 border border-gray-200 rounded-md">
              <p className="text-sm text-gray-500 mb-2">Image Preview:</p>
              <img 
                src={imageUrl} 
                alt="Preview" 
                className="max-h-[200px] object-contain"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = 'https://via.placeholder.com/300x200?text=Invalid+Image+URL'
                }}
              />
            </div>
          )}
        </div>
      )}
      
      <div className="flex justify-end">
        <button
          type="submit"
          className="btn-primary"
          disabled={isSubmitting || !title.trim() || !selectedCommunity}
        >
          {isSubmitting ? 'Posting...' : 'Post'}
        </button>
      </div>
    </form>
  )
}
