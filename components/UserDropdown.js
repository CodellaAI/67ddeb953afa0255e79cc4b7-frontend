
'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FaUser, FaPlus, FaSignOutAlt } from 'react-icons/fa'

export default function UserDropdown({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-8 h-8 relative rounded-full overflow-hidden">
          <Image 
            src={user.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'} 
            alt={user.username}
            fill
            className="object-cover"
          />
        </div>
        <div className="hidden lg:block text-left">
          <div className="text-sm font-medium">{user.username}</div>
          <div className="text-xs text-gray-500">Karma: {user.karma || 0}</div>
        </div>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
          <div className="py-1">
            <Link
              href={`/u/${user.username}`}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <FaUser className="text-gray-500" />
              Profile
            </Link>
            
            <Link
              href="/create-community"
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <FaPlus className="text-gray-500" />
              Create Community
            </Link>
            
            <hr className="my-1" />
            
            <button
              onClick={() => {
                setIsOpen(false)
                onLogout()
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              <FaSignOutAlt className="text-gray-500" />
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
