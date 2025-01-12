import React from 'react'
import "../admin.css";


export default function layout({children }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <div>
      {children}
    </div>
  )
}
