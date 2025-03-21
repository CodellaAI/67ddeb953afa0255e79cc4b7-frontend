
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { FaReddit, FaSearch, FaPlus, FaUser, FaSignOutAlt, FaSignInAlt } from 'react-icons/fa'
import SearchBar from './SearchBar'
import UserDropdown from './UserDropdown'

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  
  const handleLogout = () => {
    logout()
    router.push('/')
    setShowMobileMenu(false)
  }

  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <FaReddit className="text-reddit-orange text-3xl" />
          <span className="text-xl font-bold hidden sm:inline">reddit clone</span>
        </Link>
        
        {/* Search */}
        <div className="flex-1 max-w-xl px-4">
          <SearchBar />
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link 
                href="/submit" 
                className="flex items-center gap-1 p-2 hover:bg-gray-100 rounded-md text-sm"
              >
                <FaPlus className="text-gray-600" />
                <span>Create Post</span>
              </Link>
              
              <UserDropdown user={user} onLogout={handleLogout} />
            </>
          ) : (
            <>
              <Link href="/login" className="btn-secondary py-1.5 px-3">
                Log In
              </Link>
              <Link href="/signup" className="btn-primary py-1.5 px-3">
                Sign Up
              </Link>
            </>
          )}
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      
      {/* Mobile menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-t border-gray-200 py-2 px-4">
          <nav className="space-y-2">
            {isAuthenticated ? (
              <>
                <Link 
                  href={`/u/${user.username}`}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <div className="w-8 h-8 relative rounded-full overflow-hidden">
                    <Image 
                      src={user.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'} 
                      alt={user.username}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium">{user.username}</div>
                    <div className="text-xs text-gray-500">Karma: {user.karma || 0}</div>
                  </div>
                </Link>
                
                <Link 
                  href="/submit" 
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <FaPlus className="text-gray-600" />
                  <span>Create Post</span>
                </Link>
                
                <Link 
                  href="/create-community" 
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <FaPlus className="text-gray-600" />
                  <span>Create Community</span>
                </Link>
                
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md w-full text-left"
                >
                  <FaSignOutAlt className="text-gray-600" />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <FaSignInAlt className="text-gray-600" />
                  <span>Log In</span>
                </Link>
                
                <Link 
                  href="/signup" 
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <FaUser className="text-gray-600" />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
