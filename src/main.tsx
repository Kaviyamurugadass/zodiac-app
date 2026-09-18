import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import Layout from './components/Layout'
import { Art } from './components/Art'
import Home from './pages/Home'
import HoroscopePage from './pages/Horoscope'
import Tarot from './pages/Tarot'
import Fortune from './pages/Fortune'
import YesNo from './pages/YesNo'
import Coin from './pages/Coin'
import Personality from './pages/Personality'
import Compatibility from './pages/Compatibility'
import Profile from './pages/Profile'
import { touchStreak } from './lib/storage'

touchStreak()

function ErrorScreen() {
  return (
    <div className="mx-auto grid min-h-dvh max-w-md place-items-center px-6 text-center">
      <div>
        <Art name="moon" className="mx-auto size-28" />
        <h1 className="mt-4 font-display text-2xl font-bold text-gold">The stars got tangled</h1>
        <p className="mt-2 text-violet-200/80">Something went wrong. Let’s try that again.</p>
        <a href="/" className="btn-primary mt-6">
          Back to home
        </a>
      </div>
    </div>
  )
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <ErrorScreen />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/horoscope', element: <HoroscopePage /> },
      { path: '/horoscope/:signId', element: <HoroscopePage /> },
      { path: '/tarot', element: <Tarot /> },
      { path: '/fortune', element: <Fortune /> },
      { path: '/yes-no', element: <YesNo /> },
      { path: '/coin', element: <Coin /> },
      { path: '/personality', element: <Personality /> },
      { path: '/compatibility', element: <Compatibility /> },
      { path: '/profile', element: <Profile /> },
      { path: '*', element: <Home /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
