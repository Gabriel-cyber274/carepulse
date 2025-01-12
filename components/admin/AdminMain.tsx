"use client"

import React, { useState } from 'react'
import AdminNav from "./AdminNav";
import ScheduleModal from './ScheduleModal';
import CancelModal from './CancelModal';

function AdminMain() {
    const [scheduleModal, showScheduleModal] = useState(false);
    const [cancelModal, showCancelModal] = useState(false);


    const showScheduleFunc =()=> {
        showScheduleModal(true);
    }

    const showCancelFunc = ()=> {
        showCancelModal(true);   
    }

  return (
    <div className='main_admin'>
        <AdminNav />
        <div className="main_body">
            <div className="cont_first">
                <div className="header">
                    <h1>Welcome, Admin</h1>
                    <h2>Start day with managing new appointments</h2>
                </div>
                <div className="appoints_boxes">
                    <div className="box">
                        <div className="first">
                            <svg width="28" height="30" viewBox="0 0 28 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M26 12.3332H2M26 15.6665V10.7332C26 8.49296 26 7.37286 25.564 6.51721C25.1805 5.76456 24.5686 5.15264 23.816 4.76914C22.9603 4.33317 21.8402 4.33317 19.6 4.33317H8.4C6.15979 4.33317 5.03969 4.33317 4.18404 4.76914C3.43139 5.15264 2.81947 5.76456 2.43597 6.51721C2 7.37286 2 8.49296 2 10.7332V21.9332C2 24.1734 2 25.2935 2.43597 26.1491C2.81947 26.9018 3.43139 27.5137 4.18404 27.8972C5.03969 28.3332 6.15979 28.3332 8.4 28.3332H14M19.3333 1.6665V6.99984M8.66667 1.6665V6.99984M17.3333 24.3332L20 26.9998L26 20.9998" stroke="#FFD147" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>


                            <h2>94</h2>
                        </div>
                        <h3>Total number of  scheduled appointments</h3>
                        
                    </div>
                    <div className="box">
                        <div className="first">
                            <svg width="24" height="30" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.0002 14.9998L6.30298 10.2522C5.45651 9.5468 5.03328 9.1941 4.72901 8.76175C4.45942 8.37868 4.25921 7.95122 4.13752 7.49888C4.00016 6.98835 4.00016 6.43743 4.00016 5.33557V1.6665M12.0002 14.9998L17.6973 10.2522C18.5438 9.5468 18.967 9.1941 19.2713 8.76175C19.5409 8.37868 19.7411 7.95122 19.8628 7.49888C20.0002 6.98835 20.0002 6.43743 20.0002 5.33557V1.6665M12.0002 14.9998L6.30298 19.7475C5.45651 20.4529 5.03328 20.8056 4.72901 21.2379C4.45942 21.621 4.25921 22.0484 4.13752 22.5008C4.00016 23.0113 4.00016 23.5622 4.00016 24.6641V28.3332M12.0002 14.9998L17.6973 19.7475C18.5438 20.4529 18.967 20.8056 19.2713 21.2379C19.5409 21.621 19.7411 22.0484 19.8628 22.5008C20.0002 23.0113 20.0002 23.5622 20.0002 24.6641V28.3332M1.3335 1.6665H22.6668M1.3335 28.3332H22.6668" stroke="#79B5EC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>



                            <h2>94</h2>
                        </div>
                        <h3>Total number of pending appointments</h3>
                        
                    </div>
                    <div className="box">
                        <div className="first">
                            <svg width="32" height="28" viewBox="0 0 32 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15.9995 10.9998V16.3332M15.9995 21.6665H16.0128M14.1533 4.18878L3.18675 23.1309C2.57848 24.1816 2.27434 24.7069 2.31929 25.1381C2.3585 25.5141 2.55553 25.8559 2.86134 26.0782C3.21195 26.3332 3.81897 26.3332 5.033 26.3332H26.966C28.1801 26.3332 28.7871 26.3332 29.1377 26.0782C29.4435 25.8559 29.6405 25.5141 29.6797 25.1381C29.7247 24.7069 29.4205 24.1816 28.8123 23.1309L17.8458 4.18878C17.2397 3.1419 16.9366 2.61845 16.5412 2.44265C16.1964 2.2893 15.8027 2.2893 15.4578 2.44265C15.0624 2.61845 14.7594 3.1419 14.1533 4.18878Z" stroke="#FF4F4E" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>



                            <h2>94</h2>
                        </div>
                        <h3>Total number of cancelled  appointments</h3>
                        
                    </div>
                </div>
                
                <div className="appoint_table">
                    <div className="table_header">
                        <h2>Patient</h2>
                        <h2>Date</h2>
                        <h2>Status</h2>
                        <h2>Doctor</h2>
                        <h2>Actions</h2>
                    </div>
                    <div className="table_body">
                        <h2>
                            <div className="patient_name">
                                <div className="circle">
                                PB
                                </div>
                                Phoenix Baker
                            </div>
                        </h2>
                        <h2>Jan 4, 2022</h2>
                        <h2>
                            <div className="badge">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 3L4.5 8.5L2 6" stroke="#24AE7C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <h5>Scheduled</h5>
                            </div>
                        </h2>
                        <h2>
                            <div className="dr_pic">
                                <img src="/assets/images/dr-powell.png" alt="pic" />
                                <h3>Dr. Alex Ramirez</h3>
                            </div>
                        </h2>
                        <h2>
                            <div className="action">
                                <h3 className='green' onClick={showScheduleFunc}>Schedule</h3>
                                <h3 onClick={showCancelFunc}>Cancel</h3>
                            </div>
                        </h2>
                    </div>
                    <div className="table_body gray_ish">
                        <h2>
                            <div className="patient_name">
                                <div className="circle">
                                PB
                                </div>
                                Phoenix Baker
                            </div>
                        </h2>
                        <h2>Jan 4, 2022</h2>
                        <h2>
                            <div className="badge pending">
                                <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 6L2.86356 4.21963C2.54613 3.95511 2.38742 3.82285 2.27332 3.66072C2.17222 3.51707 2.09714 3.35677 2.05151 3.18714C2 2.99569 2 2.7891 2 2.3759V1M5 6L7.13644 4.21963C7.45387 3.95511 7.61258 3.82285 7.72668 3.66072C7.82778 3.51707 7.90286 3.35677 7.94849 3.18714C8 2.99569 8 2.7891 8 2.3759V1M5 6L2.86356 7.78037C2.54613 8.04489 2.38742 8.17715 2.27332 8.33928C2.17222 8.48293 2.09714 8.64323 2.05151 8.81286C2 9.00431 2 9.2109 2 9.6241V11M5 6L7.13644 7.78037C7.45387 8.04489 7.61258 8.17715 7.72668 8.33928C7.82778 8.48293 7.90286 8.64323 7.94849 8.81286C8 9.00431 8 9.2109 8 9.6241V11M1 1H9M1 11H9" stroke="#79B5EC" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>

                                <h5>Pending</h5>
                            </div>
                        </h2>
                        <h2>
                            <div className="dr_pic">
                                <img src="/assets/images/dr-powell.png" alt="pic" />
                                <h3>Dr. Alex Ramirez</h3>
                            </div>
                        </h2>
                        <h2>
                            <div className="action">
                                <h3 className='green'>Schedule</h3>
                                <h3>Cancel</h3>
                            </div>
                        </h2>
                    </div>
                    <div className="table_body">
                        <h2>
                            <div className="patient_name">
                                <div className="circle">
                                PB
                                </div>
                                Phoenix Baker
                            </div>
                        </h2>
                        <h2>Jan 4, 2022</h2>
                        <h2>
                            <div className="badge cancel">
                                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.5 1.5L1.5 6.5M1.5 1.5L6.5 6.5" stroke="#F37877" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>

                                <h5>Cancelled</h5>
                            </div>
                        </h2>
                        <h2>
                            <div className="dr_pic">
                                <img src="/assets/images/dr-powell.png" alt="pic" />
                                <h3>Dr. Alex Ramirez</h3>
                            </div>
                        </h2>
                        <h2>
                            <div className="action">
                                <h3 className='green'>Schedule</h3>
                                <h3>Cancel</h3>
                            </div>
                        </h2>
                    </div>
                    <div className="footer_nav">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g filter="url(#filter0_d_13001_1123)">
                        <rect x="2" y="1" width="36" height="36" rx="8" fill="#1C2023"/>
                        <rect x="2.5" y="1.5" width="35" height="35" rx="7.5" stroke="#1A1D21"/>
                        <path d="M15.8332 18.9998L18.6109 15.6665M15.8332 18.9998L18.6109 22.3332M15.8332 18.9998L24.1665 18.9998" stroke="#24AE7C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </g>
                        <defs>
                        <filter id="filter0_d_13001_1123" x="0" y="0" width="40" height="40" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                        <feOffset dy="1"/>
                        <feGaussianBlur stdDeviation="1"/>
                        <feColorMatrix type="matrix" values="0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.05 0"/>
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_13001_1123"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_13001_1123" result="shape"/>
                        </filter>
                        </defs>
                        </svg>


                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g filter="url(#filter0_d_13001_1127)">
                        <rect width="36" height="36" rx="8" transform="matrix(-1 0 0 1 38 1)" fill="#1C2023"/>
                        <rect x="-0.5" y="0.5" width="35" height="35" rx="7.5" transform="matrix(-1 0 0 1 37 1)" stroke="#1A1D21"/>
                        <path d="M24.1668 18.9998L21.3891 15.6665M24.1668 18.9998L21.3891 22.3332M24.1668 18.9998L15.8335 18.9998" stroke="#24AE7C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </g>
                        <defs>
                        <filter id="filter0_d_13001_1127" x="0" y="0" width="40" height="40" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                        <feOffset dy="1"/>
                        <feGaussianBlur stdDeviation="1"/>
                        <feColorMatrix type="matrix" values="0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.05 0"/>
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_13001_1127"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_13001_1127" result="shape"/>
                        </filter>
                        </defs>
                        </svg>
                    </div>

                    {cancelModal && <CancelModal showCancelModal={showCancelModal} />}


                    {scheduleModal && <ScheduleModal showScheduleModal={showScheduleModal}  />}
                </div>
            </div>
        </div>
      
    </div>
  )
}

export default AdminMain
