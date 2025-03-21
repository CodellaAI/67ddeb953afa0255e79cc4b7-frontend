
'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '@/context/AuthContext'
import CommentForm from './CommentForm'
import CommentItem from './CommentItem'
import Loading from './Loading'

export default function CommentSection({ postId }) {
  const { isAuthenticated } = useAuth()
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('best')

  useEffect(() => {
    fetchComments()
  }, [postId, sortBy])

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}/comments?sort=${sortBy}`
      )
      setComments(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching comments:', error)
      setLoading(false)
    }
  }

  const handleAddComment = (newComment) => {
    setComments(prevComments => [newComment, ...prevComments])
  }

  const handleReply = (parentId, newReply) => {
    setComments(prevComments => {
      return prevComments.map(comment => {
        if (comment._id === parentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply]
          }
        }
        return comment
      })
    })
  }

  return (
    <div className="mt-4">
      {isAuthenticated && (
        <div className="card p-4 mb-4">
          <CommentForm postId={postId} onCommentAdded={handleAddComment} />
        </div>
      )}
      
      <div className="card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">
            {comments.length} Comment{comments.length !== 1 ? 's' : ''}
          </h3>
          
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border-none bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="best">Best</option>
              <option value="new">New</option>
              <option value="old">Old</option>
              <option value="controversial">Controversial</option>
            </select>
          </div>
        </div>
        
        {loading ? (
          <Loading />
        ) : comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map(comment => (
              <CommentItem 
                key={comment._id} 
                comment={comment} 
                postId={postId}
                onReply={handleReply}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500">No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  )
}
