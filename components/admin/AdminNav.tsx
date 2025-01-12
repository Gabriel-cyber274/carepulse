import React from 'react'
import Image from "next/image";


function AdminNav() {
  return (
    <div className='main_admin_nav'>
        <nav>
            <div className="cont">
                <div className="first">
                    <img src="/assets/images/Logomark.png" alt="" />
                    <h2>CarePulse</h2>
                </div>
                <div className="second">
                    <img src="/assets/images/admin.png" alt="admin image" />
                    <h2>Admin</h2>
                </div>
            </div>

        </nav>
    </div>
  )
}

export default AdminNav
