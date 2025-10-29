import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';

const NotFound = () => {
  const containerRef = useRef(null);
  const cakeRef = useRef(null);
  const numberRef = useRef(null);

  useEffect(() => {
    // Parallax effect for background elements
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.parallax-element');
      
      parallaxElements.forEach((element, index) => {
        const speed = 0.3 + (index * 0.15);
        element.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
      });
    };

    // Mouse movement effect for 3D elements
    const handleMouseMove = (e) => {
      if (cakeRef.current) {
        const rect = cakeRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        cakeRef.current.style.transform = `
          perspective(1000px) 
          rotateY(${x * 0.1}deg) 
          rotateX(${-y * 0.1}deg) 
          translateZ(30px)
        `;
      }

      if (numberRef.current) {
        const rect = numberRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        numberRef.current.style.transform = `
          perspective(800px) 
          rotateY(${x * 0.05}deg) 
          rotateX(${-y * 0.05}deg) 
          translateZ(20px)
        `;
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="parallax-element absolute top-20 left-10 w-24 h-24 bg-red-200 rounded-full opacity-30 animate-pulse"></div>
        <div className="parallax-element absolute top-40 right-20 w-20 h-20 bg-orange-200 rounded-full opacity-40 animate-bounce"></div>
        <div className="parallax-element absolute bottom-40 left-20 w-28 h-28 bg-yellow-200 rounded-full opacity-25 animate-pulse"></div>
        <div className="parallax-element absolute bottom-20 right-10 w-16 h-16 bg-red-300 rounded-full opacity-35 animate-bounce"></div>
        
        {/* Floating broken cake elements */}
        <div className="parallax-element absolute top-32 right-32 text-5xl opacity-20 animate-float">🍰</div>
        <div className="parallax-element absolute bottom-32 left-32 text-4xl opacity-25 animate-float-delayed">🧁</div>
        <div className="parallax-element absolute top-60 left-1/3 text-3xl opacity-30 animate-float-slow">🍪</div>
        <div className="parallax-element absolute top-1/2 right-1/4 text-2xl opacity-20 animate-float">🍩</div>
        
        {/* Warning triangles */}
        <div className="parallax-element absolute top-1/4 left-1/4 text-3xl opacity-15 animate-wiggle">⚠️</div>
        <div className="parallax-element absolute bottom-1/3 right-1/3 text-2xl opacity-20 animate-wiggle-delayed">⚠️</div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="max-w-5xl mx-auto text-center">
          {/* 3D Number 404 */}
          <div 
            ref={numberRef}
            className="mb-8 transform-gpu transition-transform duration-300"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="relative inline-block">
              <div className="text-9xl md:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 animate-gradient-x">
                404
              </div>
              {/* 3D shadow effect */}
              <div className="absolute inset-0 text-9xl md:text-[12rem] font-black text-gray-300 transform translate-x-2 translate-y-2 -z-10">
                404
              </div>
            </div>
          </div>

          {/* 3D Broken Cake Animation */}
          <div 
            ref={cakeRef}
            className="mb-8 transform-gpu transition-transform duration-300"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="relative inline-block">
              {/* Broken cake pieces */}
              <div className="relative">
                {/* Main broken piece */}
                <div className="w-40 h-24 bg-gradient-to-b from-yellow-300 to-yellow-400 rounded-lg shadow-lg transform rotate-12 relative overflow-hidden">
                  <div className="absolute top-2 left-2 w-36 h-20 bg-gradient-to-b from-pink-300 to-pink-400 rounded-lg transform -rotate-6"></div>
                  <div className="absolute top-4 left-4 w-32 h-16 bg-gradient-to-b from-purple-300 to-purple-400 rounded-lg transform rotate-3"></div>
                  {/* Crack lines */}
                  <div className="absolute top-0 left-1/2 w-0.5 h-full bg-gray-600 transform -translate-x-1/2"></div>
                  <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-600 transform -translate-y-1/2"></div>
                </div>
                
                {/* Scattered pieces */}
                <div className="absolute -top-4 -right-8 w-16 h-10 bg-gradient-to-b from-pink-300 to-pink-400 rounded-lg transform rotate-45 animate-scatter-1"></div>
                <div className="absolute -bottom-2 -left-6 w-12 h-8 bg-gradient-to-b from-purple-300 to-purple-400 rounded-lg transform -rotate-30 animate-scatter-2"></div>
                <div className="absolute top-1/2 -right-4 w-8 h-6 bg-gradient-to-b from-yellow-300 to-yellow-400 rounded-lg transform rotate-60 animate-scatter-3"></div>
              </div>
            </div>
          </div>

          {/* Warning Icon */}
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-lg animate-pulse">
              <FaExclamationTriangle className="text-4xl text-red-500" />
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 animate-gradient-x">
              Oops! Page Not Found
            </h1>
            
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              This Page Has Disappeared Like Magic! ✨
            </h2>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Looks like this page got lost in our bakery! Don't worry, 
              even the best bakers sometimes misplace their recipes. 
              Let's get you back to our delicious collection.
            </p>

            {/* Helpful Links */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Navigation:</h3>
              <div className="space-y-2">
                <Link to="/" className="block text-pink-600 hover:text-pink-700 font-medium hover:underline">
                  🏠 Home - Browse Our Cakes
                </Link>
                <Link to="/cart" className="block text-pink-600 hover:text-pink-700 font-medium hover:underline">
                  🛒 Cart - Your Sweet Selection
                </Link>
                <Link to="/profile" className="block text-pink-600 hover:text-pink-700 font-medium hover:underline">
                  👤 Profile - Your Account
                </Link>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Link
                to="/"
                className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-500 to-orange-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <FaHome className="mr-2" />
                Back to Home
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              
              <button
                onClick={() => window.history.back()}
                className="group inline-flex items-center px-8 py-4 bg-white text-gray-700 font-bold rounded-full shadow-lg hover:shadow-xl border-2 border-gray-200 hover:border-red-300 transform hover:scale-105 transition-all duration-300"
              >
                <FaArrowLeft className="mr-2" />
                Go Back
              </button>
            </div>

            {/* Fun Message */}
            <div className="mt-8 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg border-l-4 border-orange-400">
              <p className="text-gray-700 font-medium">
                💡 <strong>Pro Tip:</strong> If you're looking for a specific cake, try using our search bar on the home page!
              </p>
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
        
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(5deg); }
          75% { transform: rotate(-5deg); }
        }
        
        @keyframes wiggle-delayed {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }
        
        @keyframes scatter-1 {
          0%, 100% { transform: rotate(45deg) translate(0px, 0px); }
          50% { transform: rotate(45deg) translate(5px, -5px); }
        }
        
        @keyframes scatter-2 {
          0%, 100% { transform: rotate(-30deg) translate(0px, 0px); }
          50% { transform: rotate(-30deg) translate(-3px, 3px); }
        }
        
        @keyframes scatter-3 {
          0%, 100% { transform: rotate(60deg) translate(0px, 0px); }
          50% { transform: rotate(60deg) translate(4px, -2px); }
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
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
        
        .animate-wiggle {
          animation: wiggle 2s ease-in-out infinite;
        }
        
        .animate-wiggle-delayed {
          animation: wiggle-delayed 2s ease-in-out infinite 1s;
        }
        
        .animate-scatter-1 {
          animation: scatter-1 3s ease-in-out infinite;
        }
        
        .animate-scatter-2 {
          animation: scatter-2 3s ease-in-out infinite 0.5s;
        }
        
        .animate-scatter-3 {
          animation: scatter-3 3s ease-in-out infinite 1s;
        }
      `}</style>
    </div>
  );
};

export default NotFound;