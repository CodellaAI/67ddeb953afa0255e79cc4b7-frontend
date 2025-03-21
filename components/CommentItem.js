
'use client'

import { useState } from 'react'
import Link from 'next/link'
import moment from 'moment'
import { FaArrowUp, FaArrowDown, FaReply } from 'react-icons/fa'
import { useAuth } from '@/context/AuthContext'
import axios from 'axios'
import CommentForm from './CommentForm'

export default function CommentItem({ comment, postId, onReply, level = 0 }) {
  const { isAuthenticated, user } = useAuth()
  const [votes, setVotes] = useState(comment.upvotes - comment.downvotes)
  const [userVote, setUserVote] = useState(comment.userVote || 0)
  const [isReplying, setIsReplying] = useState(false)
  const [showReplies, setShowReplies] = useState(level < 3) // Auto-expand first 3 levels
  
  const handleVote = async (value) => {
    if (!isAuthenticated) return
    
    // Optimistically update UI
    const previousVote = userVote
    const voteChange = value - previousVote
    setVotes(prevVotes => prevVotes + voteChange)
    setUserVote(value)
    
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${comment._id}/vote`,
        { value },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
    } catch (error) {
      // Revert on error
      console.error('Error voting:', error)
      setVotes(prevVotes => prevVotes - voteChange)
      setUserVote(previousVote)
    }
  }
  
  const handleReplyAdded = (newReply) => {
    onReply(comment._id, newReply)
    setIsReplying(false)
    setShowReplies(true)
  }

  const maxLevel = 5 // Maximum nesting level

  return (
    <div className={`${level > 0 ? 'ml-5 pl-4 border-l border-gray-200' : ''}`}>
      <div className="flex items-start gap-2">
        <div className="flex flex-col items-center">
          <button 
            onClick={() => handleVote(userVote === 1 ? 0 : 1)}
            className={`p-1 text-xs ${userVote === 1 ? 'text-reddit-orange' : 'text-gray-400 hover:text-gray-600'}`}
            disabled={!isAuthenticated}
          >
            <FaArrowUp />
          </button>
          
          <span className={`text-xs ${
            userVote === 1 ? 'text-reddit-orange' : 
            userVote === -1 ? 'text-blue-600' : 
            'text-gray-600'
          }`}>
            {votes}
          </span>
          
          <button 
            onClick={() => handleVote(userVote === -1 ? 0 : -1)}
            className={`p-1 text-xs ${userVote === -1 ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            disabled={!isAuthenticated}
          >
            <FaArrowDown />
          </button>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center text-xs text-gray-500 mb-1">
            <Link href={`/u/${comment.author.username}`} className="font-medium text-gray-900 hover:underline">
              {comment.author.username}
            </Link>
            <span className="mx-1">•</span>
            <span>{moment(comment.createdAt).fromNow()}</span>
          </div>
          
          <div className="text-sm text-gray-800 mb-2 whitespace-pre-line">
            {comment.content}
          </div>
          
          <div className="flex items-center text-xs text-gray-500 mb-2">
            {isAuthenticated && (
              <button 
                onClick={() => setIsReplying(!isReplying)}
                className="flex items-center mr-4 hover:text-gray-900"
              >
                <FaReply className="mr-1" />
                <span>{isReplying ? 'Cancel' : 'Reply'}</span>
              </button>
            )}
            
            {comment.replies && comment.replies.length > 0 && (
              <button 
                onClick={() => setShowReplies(!showReplies)}
                className="hover:text-gray-900"
              >
                {showReplies ? 'Hide replies' : `Show ${comment.replies.length} ${comment.replies.length === 1 ? 'reply' : 'replies'}`}
              </button>
            )}
          </div>
          
          {isReplying && (
            <div className="mb-4">
              <CommentForm 
                postId={postId} 
                parentId={comment._id}
                onCommentAdded={handleReplyAdded}
                onCancel={() => setIsReplying(false)}
              />
            </div>
          )}
          
          {showReplies && comment.replies && comment.replies.length > 0 && level < maxLevel && (
            <div className="mt-2 space-y-4">
              {comment.replies.map(reply => (
                <CommentItem 
                  key={reply._id} 
                  comment={reply} 
                  postId={postId}
                  onReply={onReply}
                  level={level + 1}
                />
              ))}
            </div>
          )}
          
          {/* Show "Continue this thread" link if we've reached max nesting level */}
          {showReplies && comment.replies && comment.replies.length > 0 && level >= maxLevel && (
            <div className="mt-2 text-sm text-reddit-blue hover:underline cursor-pointer">
              Continue this thread →
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
