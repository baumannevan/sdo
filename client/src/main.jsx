import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import Login from './pages/login.jsx'
import Register from './pages/register.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <Login /> */}
    <Register />
  </StrictMode>,
)
