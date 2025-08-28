import { useState, lazy, Suspense } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

const About = lazy(() => import('./Lazy-loading/About'))
const Home = lazy(() => import('./Lazy-loading/Home'))
const Loading = lazy(() => import('./Lazy-loading/Loading'))
function App() {

  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
