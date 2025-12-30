import { useState } from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import './App.css'
import LandingPage from './pages/Landing/LandingPage'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import Approval from './pages/approval/Approval'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/approval' element={<Approval/>}/>
        <Route path='/home' element={<home/>}/>
        
      </Routes>
    </Router>
      
    </>
  )
}

export default App
