
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import moment from 'moment'
import { FaArrowUp, FaArrowDown, FaRegCommentAlt, FaShare, FaBookmark } from 'react-icons/fa'
import { useAuth } from '@/context/AuthContext'
import axios from 'axios'

export default function PostDetail({ post }) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [votes, setVotes] = useState(post.upvotes - post.downvotes)
  const [userVote, setUserVote] = useState(post.userVote || 0)
  
  const handleVote = async (value) => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    
    // Optimistically update UI
    const previousVote = userVote
    const voteChange = value - previousVote
    setVotes(prevVotes => prevVotes + voteChange)
    setUserVote(value)
    
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${post._id}/vote`,
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

  return (
    <div className="card mb-4">
      {/* Vote buttons */}
      <div className="flex">
        <div className="w-10 bg-gray-50 flex flex-col items-center p-2">
          <button 
            onClick={() => handleVote(userVote === 1 ? 0 : 1)}
            className={`p-1 rounded ${userVote === 1 ? 'text-reddit-orange' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <FaArrowUp />
          </button>
          
          <span className={`text-xs font-bold my-1 ${
            userVote === 1 ? 'text-reddit-orange' : 
            userVote === -1 ? 'text-blue-600' : 
            'text-gray-600'
          }`}>
            {votes}
          </span>
          
          <button 
            onClick={() => handleVote(userVote === -1 ? 0 : -1)}
            className={`p-1 rounded ${userVote === -1 ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <FaArrowDown />
          </button>
        </div>
        
        {/* Post content */}
        <div className="p-4 flex-1">
          {/* Post metadata */}
          <div className="flex items-center text-xs text-gray-500 mb-3">
            {post.community && (
              <>
                <Link href={`/r/${post.community}`} className="font-bold hover:underline">
                  r/{post.community}
                </Link>
                <span className="mx-1">•</span>
              </>
            )}
            <span>Posted by </span>
            <Link href={`/u/${post.author.username}`} className="ml-1 hover:underline">
              u/{post.author.username}
            </Link>
            <span className="mx-1">•</span>
            <span>{moment(post.createdAt).fromNow()}</span>
          </div>
          
          {/* Post title and content */}
          <h1 className="text-2xl font-semibold mb-3">{post.title}</h1>
          
          {post.content && (
            <div className="text-gray-800 mb-4 whitespace-pre-line">
              {post.content}
            </div>
          )}
          
          {post.image && (
            <div className="mb-4 relative w-full max-h-[600px] overflow-hidden">
              <Image 
                src={post.image} 
                alt={post.title}
                width={1200}
                height={800}
                className="object-contain"
              />
            </div>
          )}
          
          {/* Post actions */}
          <div className="flex items-center text-xs text-gray-500 pt-2 border-t border-gray-200">
            <div className="flex items-center p-1 mr-4">
              <FaRegCommentAlt className="mr-1" />
              <span>{post.commentCount || 0} Comments</span>
            </div>
            
            <button className="flex items-center p-1 mr-4 hover:bg-gray-100 rounded">
              <FaShare className="mr-1" />
              <span>Share</span>
            </button>
            
            <button className="flex items-center p-1 hover:bg-gray-100 rounded">
              <FaBookmark className="mr-1" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
