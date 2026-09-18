import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import Layout from './components/Layout'
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

const router = createBrowserRouter([
  {
    element: <Layout />,
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
