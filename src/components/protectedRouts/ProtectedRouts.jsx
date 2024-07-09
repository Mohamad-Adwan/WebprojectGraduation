import React from 'react'
import { Navigate } from 'react-router-dom'

export default function ProtectedRouts({children}) {
  const token = localStorage.getItem('userToken');
    if(token){
        return <Navigate to='/LoginSignup' replace />
    }
    return children;
}
