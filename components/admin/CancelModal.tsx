import React from 'react'


interface ScheduleModalProps {
    showCancelModal: (show: boolean) => void; // Function to toggle modal visibility
  }


const CancelModal: React.FC<ScheduleModalProps> = ({
    showCancelModal,
})=> {

    
    const closeModal = ()=> {
        showCancelModal(false);   
    }
  
  return (
    <div
    id="modal"
    className="fixed schedule_modal_cont inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center"
    >
    <div className="bg-white main_body_schedule w-10 p-6 rounded-lg shadow-lg">
        <div className="header_schedule">
            <div className="first">
                <h1>Cancel Appointment </h1>
                <h3>Are you sure you want to cancel your appointment</h3>
            </div>
            <div className="cancel">
                <svg onClick={closeModal} style={{cursor: 'pointer'}} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.16699 4.1665L15.8337 15.8332M15.8337 4.1665L4.16699 15.8332" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
            </div>
        </div>
        <div className="body_schedule">
            
            <div className="inputs relative mb-5">
                <label htmlFor="">Reason for cancellation </label>
                <textarea name="" id="" placeholder='ex: Urgent meeting came up'></textarea>
            </div>
            <button className='submut_schedule red'>Cancel appointment</button>
        </div>
    </div>
    </div>
  )
}

export default CancelModal
