import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components'
import { GuildDiscovery, Home, Login, Register, User } from './pages'
import { Chat, Friends, Main, Server } from './layouts'

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
            <Route path='@me' element={<Main />}>
              <Route index element={<Friends />} />
              <Route path=':channelId' element={<Chat />} />
            </Route>
            <Route path=':serverId' element={<Server />}>
              <Route index element={<Chat />} />
              <Route path=':channelId' element={<Chat />} />
            </Route>
          </Route>
          <Route path='/guild-discovery' element={<GuildDiscovery />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App