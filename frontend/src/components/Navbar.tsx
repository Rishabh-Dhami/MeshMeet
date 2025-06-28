"use client"

import React, { useState } from 'react'
import Link from 'next/link'

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });

    // Check login state from localStorage
    React.useEffect(() => {
      const checkAuth = () => {
        setLoading(true);
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        setIsLoggedIn(!!token);
        setLoading(false);
      };
      checkAuth();
      // Listen for storage changes (e.g., login/logout in other tabs)
      window.addEventListener('storage', checkAuth);
      // Listen for login/logout in the same tab
      const interval = setInterval(checkAuth, 500);
      return () => {
        window.removeEventListener('storage', checkAuth);
        clearInterval(interval);
      };
    }, []);

    const handleLogout = () => {
      localStorage.removeItem('accessToken');
      setIsLoggedIn(false);
      setMenuOpen(false);
      setAlert({ show: true, type: 'success', message: 'Logged out successfully!' });
      setTimeout(() => setAlert({ show: false, type: '', message: '' }), 2000);
    };

    if (loading) {
      return null; // Or a loading spinner if desired
    }

    return (
      <div>
        {alert.show && (
          <div className={`fixed top-8 right-8 z-[100] px-6 py-3 rounded-2xl shadow-2xl text-white font-semibold text-lg flex items-center gap-2 animate-slideInRightToLeft ${alert.type === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-pink-600'}`}
            style={{ minWidth: '220px', maxWidth: '90vw', transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)' }}>
            {alert.type === 'success' ? (
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            ) : (
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            )}
            {alert.message}
          </div>
        )}
      <nav className="w-full fixed top-0 left-0 z-30 flex flex-col md:flex-row justify-between items-start md:items-center py-4 px-4 sm:px-8 md:px-12 lg:px-16 backdrop-blur-md shadow-md gap-4 md:gap-0 bg-transparent">
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
          {isLoggedIn ? (
            <>
              <Link href="/history" className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-105 hover:shadow-xl hover:bg-gradient-to-l hover:from-emerald-600 hover:to-green-500 transition-all duration-200 text-white font-semibold shadow-md"><i className="fa-solid fa-clock-rotate-left"></i> History</Link>
              {/* Add more authenticated links here if needed */}
              <button onClick={handleLogout} className="px-4 py-2 rounded-lg border border-red-400 text-red-200 font-semibold bg-transparent hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-500 hover:text-white hover:border-transparent hover:scale-105 hover:shadow-xl transition-all duration-200">Logout</button>
            </>
          ) : (
            <>
              <Link href="#" className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 hover:scale-105 hover:shadow-xl hover:bg-gradient-to-l hover:from-indigo-600 hover:to-purple-500 transition-all duration-200 text-white font-semibold shadow-md">Join as Guest</Link>
              <Link href="/signup" className="px-4 py-2 rounded-lg border border-purple-400 text-purple-200 font-semibold bg-transparent hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-600 hover:text-white hover:border-transparent hover:scale-105 hover:shadow-xl transition-all duration-200" onClick={() => setMenuOpen(false)}>Register</Link>
              <Link href="/login" className="px-4 py-2 rounded-lg border border-indigo-400 text-indigo-200 font-semibold bg-transparent hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-500 hover:text-white hover:border-transparent hover:scale-105 hover:shadow-xl transition-all duration-200" onClick={() => setMenuOpen(false)}>Login</Link>
            </>
          )}
        </div>
        {/* Slide-down menu for mobile/tablet */}
        {menuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#232946] bg-opacity-95 flex flex-col items-center gap-3 py-4 z-50 shadow-lg animate-fadeInDown">
            {isLoggedIn ? (
              <>
                <Link href="/history" className="w-11/12 px-3 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-105 hover:shadow-xl hover:bg-gradient-to-l hover:from-emerald-600 hover:to-green-500 transition-all duration-200 text-white text-center font-semibold shadow-md" onClick={() => setMenuOpen(false)}><i className="fa-solid fa-clock-rotate-left  "></i> History</Link>
                {/* Add more authenticated links here if needed */}
                <button onClick={handleLogout} className="w-11/12 px-3 py-2 rounded-lg border border-red-400 text-red-200 font-semibold bg-transparent hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-500 hover:text-white hover:border-transparent hover:scale-105 hover:shadow-xl transition-all duration-200 text-center">Logout</button>
              </>
            ) : (
              <>
                <Link href="#" className="w-11/12 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 hover:scale-105 hover:shadow-xl hover:bg-gradient-to-l hover:from-indigo-600 hover:to-purple-500 transition-all duration-200 text-white text-center font-semibold shadow-md" onClick={() => setMenuOpen(false)}>Join as Guest</Link>
                <Link href="/signup" className="w-11/12 px-3 py-2 rounded-lg border border-purple-400 text-purple-200 font-semibold bg-transparent hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-600 hover:text-white hover:border-transparent hover:scale-105 hover:shadow-xl transition-all duration-200 text-center" onClick={() => setMenuOpen(false)}>Register</Link>
                <Link href="/login" className="w-11/12 px-3 py-2 rounded-lg border border-indigo-400 text-indigo-200 font-semibold bg-transparent hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-500 hover:text-white hover:border-transparent hover:scale-105 hover:shadow-xl transition-all duration-200 text-center" onClick={() => setMenuOpen(false)}>Login</Link>
              </>
            )}
          </div>
        )}
        <style jsx global>{`
          @keyframes slideInRightToLeft {
            0% { opacity: 0; transform: translateX(60px); }
            100% { opacity: 1; transform: translateX(0); }
          }
          .animate-slideInRightToLeft {
            animation: slideInRightToLeft 0.7s cubic-bezier(0.4,0,0.2,1) both;
          }
        `}</style>
      </nav>
      </div>
    );
}

export default Navbar