import React from 'react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(to right, #ccc 1px, transparent 1px), linear-gradient(to bottom, #ccc 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Main content container */}
      <div className="relative z-10 max-w-4xl w-full bg-gray-900/70 backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-2xl overflow-hidden">
        
        {/* Decorative header line */}
        <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        
        <div className="p-8 md:p-12">
          
          {/* 404 Number Display - Animated */}
          <div className="flex justify-center items-center mb-8">
            {[4, 0, 4].map((digit, index) => (
              <div 
                key={index}
                className="relative mx-2 md:mx-4"
              >
                <div className="text-8xl md:text-9xl font-bold text-white opacity-10">
                  {digit}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                    {digit}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Main Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            Page Not Found
          </h1>
          
         
          
          {/* Bible Verse Section - Core Requirement */}
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700/30 rounded-2xl p-8 mb-10 transform hover:scale-[1.02] transition-transform duration-300">
            <div className="flex flex-col items-center">
              
              {/* Cross Icon */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-900/30 to-purple-900/30 flex items-center justify-center mb-6 border border-gray-700/50">
                <span className="text-3xl text-gray-300">✝</span>
              </div>
              
              {/* Bible Verse */}
              <blockquote className="text-center mb-6">
                <p className="text-2xl md:text-3xl font-serif italic text-gray-200 leading-relaxed">
                  "Your word is a lamp to my feet and a light to my path."
                </p>
                <cite className="block mt-4 text-lg text-gray-400 font-medium">
                  — Psalm 119:105
                </cite>
              </blockquote>
              
              {/* Interpretation */}
              <div className="mt-6 pt-6 border-t border-gray-700/30 w-full max-w-md">
                <p className="text-xl text-center text-gray-300 font-medium">
                  Even if the page is lost, God's guidance is not.
                </p>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <button 
              onClick={() => window.history.back()}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl flex items-center gap-3 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
            >
              <span className="text-xl">←</span>
              <span>Go Back</span>
            </button>
            
            <button 
              onClick={() => window.location.href = '/'}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-xl flex items-center gap-3 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
            >
              <span className="text-xl">⌂</span>
              <span>Return Home</span>
            </button>
          </div>
          
          
          
          
        </div>
        
        {/* Bottom decorative line */}
        <div className="h-2 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"></div>
      </div>
      
    
      
      {/* Inline styles for animations */}
      <style jsx="true">{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};

export default NotFound;