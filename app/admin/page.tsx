import React from 'react'
import AdminMain from "@/components/admin/AdminMain";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export default function page() {
  return (
    <div>
        <AdminMain />  
        <ToastContainer />

    </div>
  )
}
