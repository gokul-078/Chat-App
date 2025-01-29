import React from 'react'

import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react';

// import components...
import Navbar from './components/Navbar';

// import pages...
import Homepage from './pages/Homepage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';

// import useAuthStore from useAuthStore.js file in store folder...
import useAuthStore from './store/useAuthStore'

// importing "Loader" from 'lucide-react' package for react icons...
import { Loader } from 'lucide-react';

// import toaster from react...
import { Toaster } from 'react-hot-toast';

// import useThemeStore function from store folder...
import useThemeStore from './store/useThemeStore';


const App = () => {

  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();

  const { theme } = useThemeStore()

  console.log(onlineUsers);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({authUser});

  // Initializing a loader component whenever the isCheckingAuth and authUser is null or in false...
  if(isCheckingAuth && !authUser){
    return(
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin"/>
      </div>
    )
  } 



  return (
    <div data-theme = { theme }>

      <Navbar />

      <Routes>
        <Route path='/' element={authUser ? <Homepage /> : <Navigate to={'/login'} />} />
        <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to={'/'} />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to={'/'} />} />
        <Route path='/settings' element={<SettingsPage />} />
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to={'/login'} />} />
      </Routes>

      <Toaster />

    </div>
  )
}

export default App