"use client"
import React from 'react'

function page() {
  return (
    <div className='success_main_cont'>
        
            <div className="header">
                <img src="/assets/images/Logomark.png" alt="pic" />
                <h2>CarePulse</h2>
            </div>
            <div className="center_stuff">
                <div className="check">
                    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.3333 40L32.8871 49.5537C34.5142 51.1809 37.1524 51.1809 38.7796 49.5537L56.6667 31.6667M77.5 40C77.5 60.7107 60.7107 77.5 40 77.5C19.2893 77.5 2.5 60.7107 2.5 40C2.5 19.2893 19.2893 2.5 40 2.5C60.7107 2.5 77.5 19.2893 77.5 40Z" stroke="#4AC97E" stroke-width="5" stroke-linecap="round"/>
                    </svg>
                </div>
                <h1>Your <span>appointment request</span> has been successfully submitted!</h1>
                <h4>We&apos;ll be in touch shortly to confirm.</h4>

                <div className="last_part">
                    <h2>Requested appointment details:</h2>
                    <div className="dr">
                        <img src="/assets/images/dr-powell.png" alt="pic" />
                        <h3>Dr. Adam Smith</h3>
                    </div>
                    <h4>
                        <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 8.2H1M12.5556 1V4.6M5.44444 1V4.6M5.26667 19H12.7333C14.2268 19 14.9735 19 15.544 18.7057C16.0457 18.4469 16.4537 18.0338 16.7094 17.5258C17 16.9482 17 16.1921 17 14.68V7.12C17 5.60786 17 4.85179 16.7094 4.27423C16.4537 3.76619 16.0457 3.35314 15.544 3.09428C14.9735 2.8 14.2268 2.8 12.7333 2.8H5.26667C3.77319 2.8 3.02646 2.8 2.45603 3.09428C1.95426 3.35314 1.54631 3.76619 1.29065 4.27423C1 4.85179 1 5.60786 1 7.12V14.68C1 16.1921 1 16.9482 1.29065 17.5258C1.54631 18.0338 1.95426 18.4469 2.45603 18.7057C3.02646 19 3.77319 19 5.26667 19Z" stroke="#CDE9DF" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        23 June 2024 - 5:00 PM
                    </h4>

                </div>
            
        </div>
    </div>
  )
}

export default page
