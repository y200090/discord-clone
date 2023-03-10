import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { Chat, Main, Search, Server } from './components'
import { Home, Login, Register, User } from './pages'

const App = () => {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const location = useLocation();
  
  const ProtectedRoute = () => {
    if (!accessToken) {
      return <Navigate to='/login' state={{ from: location }} replace />
    }
    return <Outlet />
  }
  
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<User />}>
          <Route path='/channels'>
            <Route index element={<Navigate to={'@me'} />} />
            <Route path='@me' element={<Main />} />
            <Route path=':serverId' element={<Server />}>
              <Route index element={<Chat />} />
              <Route path=':channelId' element={<Chat />} />
            </Route>
          </Route>
          <Route path='/search' element={<Search />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App