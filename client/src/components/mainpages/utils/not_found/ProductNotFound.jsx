import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaHome, FaArrowLeft } from 'react-icons/fa';

const ProductNotFound = () => {
  const containerRef = useRef(null);
  const cakeRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    // Parallax effect for background elements
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.parallax-element');
      
      parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        element.style.transform = `translateY(${scrolled * speed}px)`;
      });
    };

    // Mouse movement effect for 3D cake
    const handleMouseMove = (e) => {
      if (cakeRef.current) {
        const rect = cakeRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        cakeRef.current.style.transform = `
          perspective(1000px) 
          rotateY(${x * 0.05}deg) 
          rotateX(${-y * 0.05}deg) 
          translateZ(20px)
        `;
      }
    };

    // Floating animation for search icon
    const animateSearch = () => {
      if (searchRef.current) {
        searchRef.current.style.animation = 'float 3s ease-in-out infinite';
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    animateSearch();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="parallax-element absolute top-20 left-10 w-20 h-20 bg-pink-200 rounded-full opacity-30 animate-pulse"></div>
        <div className="parallax-element absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-40 animate-bounce"></div>
        <div className="parallax-element absolute bottom-40 left-20 w-24 h-24 bg-blue-200 rounded-full opacity-25 animate-pulse"></div>
        <div className="parallax-element absolute bottom-20 right-10 w-12 h-12 bg-pink-300 rounded-full opacity-35 animate-bounce"></div>
        
        {/* Floating cake slices */}
        <div className="parallax-element absolute top-32 right-32 text-4xl opacity-20 animate-float">🍰</div>
        <div className="parallax-element absolute bottom-32 left-32 text-3xl opacity-25 animate-float-delayed">🧁</div>
        <div className="parallax-element absolute top-60 left-1/3 text-2xl opacity-30 animate-float-slow">🍪</div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* 3D Cake Animation */}
          <div 
            ref={cakeRef}
            className="mb-8 transform-gpu transition-transform duration-300"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="relative inline-block">
              {/* 3D Cake Layers */}
              <div className="relative">
                {/* Bottom layer */}
                <div className="w-32 h-20 bg-gradient-to-b from-yellow-300 to-yellow-400 rounded-lg shadow-lg transform rotate-2"></div>
                {/* Middle layer */}
                <div className="absolute top-2 left-2 w-28 h-16 bg-gradient-to-b from-pink-300 to-pink-400 rounded-lg shadow-lg transform -rotate-1"></div>
                {/* Top layer */}
                <div className="absolute top-4 left-4 w-24 h-12 bg-gradient-to-b from-purple-300 to-purple-400 rounded-lg shadow-lg"></div>
                {/* Candle */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                  <div className="w-1 h-6 bg-red-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-flicker"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Search Icon with Animation */}
          <div ref={searchRef} className="mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-lg">
              <FaSearch className="text-4xl text-pink-500" />
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 animate-gradient-x">
              Oops!
            </h1>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              No Sweet Treats Found
            </h2>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              We couldn't find any cakes matching your search. Don't worry! 
              Our bakery is full of delicious surprises waiting to be discovered.
            </p>

            {/* Search Suggestions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Try searching for:</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {['Chocolate Cake', 'Vanilla Cupcakes', 'Red Velvet', 'Cheesecake', 'Birthday Cake'].map((suggestion) => (
                  <span 
                    key={suggestion}
                    className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm hover:bg-pink-200 transition-colors cursor-pointer"
                  >
                    {suggestion}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Link
                to="/"
                className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <FaHome className="mr-2" />
                Back to Home
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              
              <button
                onClick={() => window.history.back()}
                className="group inline-flex items-center px-8 py-4 bg-white text-gray-700 font-bold rounded-full shadow-lg hover:shadow-xl border-2 border-gray-200 hover:border-pink-300 transform hover:scale-105 transition-all duration-300"
              >
                <FaArrowLeft className="mr-2" />
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        
        .animate-flicker {
          animation: flicker 2s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite 1s;
        }
        
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite 2s;
        }
      `}</style>
    </div>
  );
};

export default ProductNotFound;

