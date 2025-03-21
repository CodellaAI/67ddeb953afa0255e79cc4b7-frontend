
'use client'

import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '@/context/AuthContext'

export default function CommentForm({ postId, parentId = null, onCommentAdded, onCancel }) {
  const { user } = useAuth()
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!content.trim()) return
    
    setIsSubmitting(true)
    
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}/comments`,
        {
          content: content.trim(),
          parentId
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      
      setContent('')
      onCommentAdded(response.data)
      
      if (onCancel) {
        onCancel()
      }
    } catch (error) {
      console.error('Error posting comment:', error)
      alert('Failed to post comment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <textarea
          className="input min-h-[100px]"
          placeholder={parentId ? 'Write a reply...' : 'What are your thoughts?'}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></textarea>
      </div>
      
      <div className="flex justify-end space-x-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
        )}
        
        <button
          type="submit"
          className="btn-primary"
          disabled={isSubmitting || !content.trim()}
        >
          {isSubmitting ? 'Posting...' : parentId ? 'Reply' : 'Comment'}
        </button>
      </div>
    </form>
  )
}
