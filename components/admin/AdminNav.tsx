"use client"
import React from 'react'
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";



interface AdminNavProps {
    id: string; // or `number` depending on your data
    image: string; // or `null`/`undefined` if optional
  }
  

  const AdminNav: React.FC<AdminNavProps> = ({ id, image }) => {
    const router = useRouter();

    // const editProfile = ()=> {
        
    //   router.push(`/doctor/register/${id}`)
    // }
  return (
    <div className='main_admin_nav'>
        <nav>
            <div className="cont">
                <div className="first">
                    <img src="/assets/images/Logomark.png" alt="" />
                    <h2>CarePulse</h2>
                </div>

                <Link href={`/doctor/register/${id}`}>
                    <div className="second" style={{cursor: 'pointer'}}>
                        <img src={image} alt="admin image" />
                        <h2>Admin</h2>
                    </div>
                </Link>
            </div>

        </nav>
    </div>
  )
}

export default AdminNav
