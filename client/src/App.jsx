import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Chat, Main, Search, Server } from './components'
import { Home, Login, Register, User } from './pages'
import ProtectedRoute from './utils/ProtectedRoute'

const App = () => {
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