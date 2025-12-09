import { Routes, Route } from 'react-router'

import AddBook from './pages/AddBook'
import AuditLog from './pages/AuditLog'
import Authentication from './pages/Authentication'
import Inventory from './pages/Inventory'
import Notification from './pages/Notification'
import MyNavBar from './components/Nav'
import NotFound from './pages/NotFound'
import './App.css'

function App() {
  return (
    <>
      <span id='nav'><MyNavBar></MyNavBar></span>
      <div id='element' className='pt-5 text-center'>
        <Routes>
          <Route path="/" element={<Authentication />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/logs" element={<AuditLog />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/addBook" element={<AddBook />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  )
}

export default App
