import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Toaster } from 'react-hot-toast';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary mb-4">
              WFC Admin Portal
            </h1>
            <p className="text-muted-foreground text-lg">
              Frontend foundation is ready! 🚀
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Phase 1 Complete - Ready for Phase 2
            </p>
            <div className="mt-6 space-y-2">
              <p className="text-xs text-muted-foreground">
                ✅ Vite + React configured
              </p>
              <p className="text-xs text-muted-foreground">
                ✅ Tailwind CSS ready
              </p>
              <p className="text-xs text-muted-foreground">
                ✅ Path aliases set up
              </p>
              <p className="text-xs text-muted-foreground">
                ✅ All dependencies installed
              </p>
            </div>
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </>
  )
}

export default App
