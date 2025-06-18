import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import 'flowbite';
import Sidebar from '../../components/Sidebar';
import Nav from '../../components/Nav';
import AppProvider, { useStateContext } from '../../contexts/AppContext';
import { Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';


function App() {
const {user, token} = useStateContext();
if(!token){
  return <Navigate to = '/login' />
}

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Sidebar/>
      <div className="sm:ml-64 md:bg-[#f1efef]">
        <Nav/>
        <Outlet/>
      </div>
    </>
  )
}

export default App
