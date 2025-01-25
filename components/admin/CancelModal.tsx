"use client"

import React from 'react'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Form, FormControl } from "@/components/ui/form";
import CustomFormField from "@/components/CustomFormField";
import SubmitButton from "@/components/SubmitButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { z } from "zod";

import Image from 'next/image';
import { CancelModalFormValidation } from "@/lib/validation";
import {databases, DATABASE_ID, PATIENT_COLLECTION_ID, BUCKET_ID, storage, ENDPOINT, PROJECT_ID, DOCTOR_COLLECTION_ID, APPOINTMENT_COLLECTION_ID} from '../../lib/appwriteConfig2'




interface Appointment {
    $id: string;
    $createdAt: string;
    $updatedAt: string;
    patient: {
      name: string;
      phone: string;
      birthDate: string;
      gender: string;
      address: string;
    };
    primaryPhysician: {
      name: string;
      image: string;
      area_of_specialization: string;
      hospital_name: string;
      hospital_location: string;
    };
    reason: string;
    schedule: string;
    status: string;
    cancel_reason: string | null;
    note: string;
  }

interface ScheduleModalProps {
    showCancelModal: (show: boolean) => void; // Function to toggle modal visibility
    appointmentDetails: Appointment | null
}

export enum FormFieldType {
    INPUT = "input",
    TEXTAREA = "textarea",
    PHONE_INPUT = "phoneInput",
    CHECKBOX = "checkbox",
    DATE_PICKER = "datePicker",
    SELECT = "select",
    SKELETON = "skeleton",
  }


const CancelModal: React.FC<ScheduleModalProps> = ({
    showCancelModal,
    appointmentDetails
})=> {


    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<z.infer<typeof CancelModalFormValidation>>({
        resolver: zodResolver(CancelModalFormValidation),
        defaultValues: {
            cancel_reason: "",
        },
      });

      const toaster = (message:string, type:string) => {
        if(type == 'err') {
          toast.error(message)
        }else {
          toast.success(message);
        }
      };
    
    const closeModal = ()=> {
        showCancelModal(false);   
    }

    async function onSubmit(values: z.infer<typeof CancelModalFormValidation>) {
        try {
            setIsLoading(true);
            
            const appointData = {
                ...values,
                status: "cancelled"
            };
            
            const response = await databases.updateDocument(
                DATABASE_ID,
                APPOINTMENT_COLLECTION_ID,
                appointmentDetails!.$id,
                appointData
            );

            setIsLoading(false);
            if(response) {
                toaster('successful', 'success');
                closeModal();
            }
            
        } catch (error) {
            toaster(JSON.stringify(error), 'err');
            setIsLoading(false);
            console.error(error);
        }
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
            <div className="inputs relative mb-3">
                <label htmlFor="">Reason for cancellation </label>
                {/* <textarea name="" id="" placeholder='ex: Urgent meeting came up'></textarea> */}
            </div>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
                <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="cancel_reason"
                label=""
                placeholder="ex: Urgent meeting came up"
                />


                <SubmitButton classname='submut_schedule red' isLoading={isLoading}>Cancel appointment</SubmitButton>
            </form>

            <ToastContainer />
            </Form>
            {/* <button className='submut_schedule red'>Cancel appointment</button> */}
        </div>
        
    </div>
    </div>
  )
}

export default CancelModal
