"use client"

import React, { useState } from 'react'
import Link from 'next/link'

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Simulate login state from localStorage (replace with real auth logic)
    React.useEffect(() => {
      setIsLoggedIn(!!localStorage.getItem('token'));
    }, []);

    const handleLogout = () => {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
    }

    return (
      <nav className="w-full fixed top-0 left-0 z-30 flex flex-col md:flex-row justify-between items-center py-4 px-4 sm:px-8 md:px-12 lg:px-16 backdrop-blur-md shadow-md gap-4 md:gap-0 bg-transparent">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-purple-300 drop-shadow-lg">
          MeshMeet
        </h1>
        <button
          className="md:hidden absolute right-4 top-4 z-40 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <span className="block w-6 h-0.5 bg-white mb-1"></span>
          <span className="block w-6 h-0.5 bg-white mb-1"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
        </button>
        {/* Menu for desktop/tablet */}
        <div className="hidden md:flex flex-wrap justify-center items-center gap-3 lg:gap-5">
          <Link href="#" className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-indigo-600 hover:to-purple-500 transition text-white font-semibold shadow-md">Join as Guest</Link>
          {isLoggedIn ? (
            <>
              <Link href="/history" className="px-4 py-2 rounded-lg border border-green-400 hover:bg-green-600 transition text-green-200 font-semibold">History</Link>
              <button onClick={handleLogout} className="px-4 py-2 rounded-lg border border-red-400 hover:bg-red-600 transition text-red-200 font-semibold">Logout</button>
            </>
          ) : (
            <>
              <Link href="/signup" className="px-4 py-2 rounded-lg border border-purple-400 hover:bg-purple-600 transition text-purple-200 font-semibold">Register</Link>
              <Link href="/login" className="px-4 py-2 rounded-lg border border-indigo-400 hover:bg-indigo-600 transition text-indigo-200 font-semibold">Login</Link>
            </>
          )}
        </div>
        {/* Slide-down menu for mobile/tablet */}
        {menuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#232946] bg-opacity-95 flex flex-col items-center gap-3 py-4 z-50 shadow-lg animate-fadeInDown">
            <Link href="#" className="w-11/12 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-indigo-600 hover:to-purple-500 transition text-white font-semibold shadow-md" onClick={() => setMenuOpen(false)}>Join as Guest</Link>
            {isLoggedIn ? (
              <>
                <Link href="/history" className="w-11/12 px-3 py-2 rounded-lg border border-green-400 hover:bg-green-600 transition text-green-200 font-semibold" onClick={() => setMenuOpen(false)}>History</Link>
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="w-11/12 px-3 py-2 rounded-lg border border-red-400 hover:bg-red-600 transition text-red-200 font-semibold">Logout</button>
              </>
            ) : (
              <>
                <Link href="/signup" className="w-11/12 px-3 py-2 rounded-lg border border-purple-400 hover:bg-purple-600 transition text-purple-200 font-semibold" onClick={() => setMenuOpen(false)}>Register</Link>
                <Link href="/login" className="w-11/12 px-3 py-2 rounded-lg border border-indigo-400 hover:bg-indigo-600 transition text-indigo-200 font-semibold" onClick={() => setMenuOpen(false)}>Login</Link>
              </>
            )}
          </div>
        )}
      </nav>
    )
}

export default Navbar