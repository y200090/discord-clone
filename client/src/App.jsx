import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Chat, Main, Search, Server } from './components'
import { AuthContext } from './contexts/AuthContext'
import { Home, Login, Register, User } from './pages'

const App = () => {
  const {currentUser} = useContext(AuthContext);
  
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />

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
    </Routes>
  )
}

export default App