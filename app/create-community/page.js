
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/context/AuthContext'

export default function CreateCommunityPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const name = watch('name', '')

  const onSubmit = async (data) => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/create-community')
      return
    }
    
    setIsLoading(true)
    setError('')
    
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/communities`, 
        {
          name: data.name,
          description: data.description
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      
      router.push(`/r/${response.data.name}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create community. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <div className="card p-6">
        <h1 className="text-2xl font-bold mb-6">Create a Community</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Community Name
            </label>
            <div className="flex items-center">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                r/
              </span>
              <input
                id="name"
                type="text"
                className="input rounded-l-none"
                {...register('name', {
                  required: 'Community name is required',
                  minLength: {
                    value: 3,
                    message: 'Community name must be at least 3 characters'
                  },
                  maxLength: {
                    value: 21,
                    message: 'Community name cannot exceed 21 characters'
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9_]+$/,
                    message: 'Community name can only contain letters, numbers, and underscores'
                  }
                })}
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {21 - (name?.length || 0)} characters remaining
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Community names cannot be changed once created
            </p>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              rows="4"
              className="input"
              placeholder="Tell people what your community is about"
              {...register('description', {
                required: 'Description is required',
                maxLength: {
                  value: 500,
                  message: 'Description cannot exceed 500 characters'
                }
              })}
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
            )}
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-medium mb-2">Community Type</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  id="public"
                  name="type"
                  type="radio"
                  className="h-4 w-4 text-reddit-blue focus:ring-reddit-blue border-gray-300"
                  defaultChecked
                />
                <label htmlFor="public" className="ml-3 block text-sm font-medium text-gray-700">
                  Public - Anyone can view, post, and comment
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="restricted"
                  name="type"
                  type="radio"
                  className="h-4 w-4 text-reddit-blue focus:ring-reddit-blue border-gray-300"
                  disabled
                />
                <label htmlFor="restricted" className="ml-3 block text-sm font-medium text-gray-400">
                  Restricted - Anyone can view, but only approved users can post (coming soon)
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="private"
                  name="type"
                  type="radio"
                  className="h-4 w-4 text-reddit-blue focus:ring-reddit-blue border-gray-300"
                  disabled
                />
                <label htmlFor="private" className="ml-3 block text-sm font-medium text-gray-400">
                  Private - Only approved users can view and post (coming soon)
                </label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Community'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
