import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { isAuthenticated, removeToken } from '../utils/api'

const Navigation = () => {
  const navigate = useNavigate()
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      setAuthenticated(isAuthenticated())
    }
    
    checkAuth()
    // Check auth status periodically (in case token is removed elsewhere)
    const interval = setInterval(checkAuth, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    removeToken()
    setAuthenticated(false)
    navigate('/signup')
  }

  return (
    <nav className="bg-slate-900/95 backdrop-blur-sm sticky top-0 z-50 border-b border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to={authenticated ? "/dashboard" : "/"} className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">TradeLogX</span>
          </Link>

          {/* Desktop Navigation */}
          {authenticated ? (
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/dashboard" className="text-white hover:text-blue-400 transition-colors">Dashboard</Link>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/#hero" className="text-white hover:text-blue-400 transition-colors">Home</Link>
              <Link to="/#features" className="text-white hover:text-blue-400 transition-colors">Features</Link>
              <Link to="/#how-it-works" className="text-white hover:text-blue-400 transition-colors">How It Works</Link>
            </div>
          )}

          {/* Right side - Auth buttons */}
          <div className="flex items-center space-x-4">
            {authenticated ? (
              <>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/signup" 
                  className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium"
                >
                  Sign Up
                </Link>
                <Link 
                  to="/login" 
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation


