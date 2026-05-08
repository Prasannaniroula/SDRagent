import { useState } from 'react'
import { Routes,Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Leads from './pages/Leads'
import Composer from './pages/Composer'
import Navbar from './components/Navbar'

export default function App(){
  return(
    <>
    <div>
      <Navbar/>
      <div>
        <Routes>
          <Route path='/' element={<Dashboard/>} />
          <Route path='/composer' element={<Composer/>} />
          <Route path='/leads' element={<Leads/>} />
        </Routes>
      </div>
    </div>
    
    </>
  )
}
