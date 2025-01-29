import React from 'react'
import SearchField from "./SearchField";
import Link from "next/link";
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
import { SelectItem } from "@/components/ui/select"

import Image from 'next/image';
import { getAppointmentSchema } from "@/lib/validation";
import {databases, DATABASE_ID, PATIENT_COLLECTION_ID, BUCKET_ID, storage, ENDPOINT, PROJECT_ID, DOCTOR_COLLECTION_ID, APPOINTMENT_COLLECTION_ID} from '../../lib/appwriteConfig2'
import { DoctorType } from "@/types/appwrite.types"
import { Query } from 'appwrite';




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


export enum FormFieldType {
    INPUT = "input",
    TEXTAREA = "textarea",
    PHONE_INPUT = "phoneInput",
    CHECKBOX = "checkbox",
    DATE_PICKER = "datePicker",
    SELECT = "select",
    SKELETON = "skeleton",
  }

interface ScheduleModalProps {
    showScheduleModal: (show: boolean) => void; // Function to toggle modal visibility
    appointmentDetails: Appointment | null
  }
  
const ScheduleModal: React.FC<ScheduleModalProps> = ({
    showScheduleModal,
    appointmentDetails
}) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [doctorsInfo, setDoctorsInfo] = useState<DoctorType[]>([]);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);


    
    const AppointmentFormValidation = getAppointmentSchema("schedule")

    const form = useForm<z.infer<typeof AppointmentFormValidation>>({
        resolver: zodResolver(AppointmentFormValidation),
        defaultValues: {
            primaryPhysician: "",
            schedule: new Date(),
            reason: "",
        },
    })

    const toaster = (message:string, type:string) => {
        if(type == 'err') {
          toast.error(message)
        }else {
          toast.success(message);
        }
      };
    

    const selectedUser = {
      name: "Dr. Adam Smith",
      avatar: "https://via.placeholder.com/150", // Replace with the actual avatar URL
    };
  
    const toggleDropdown = () => {
      setDropdownOpen((prev) => !prev);
    };

    const closeModal = ()=> {
        showScheduleModal(false);   
    }

    async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
        try {
            setIsLoading(true);

            const appointmentData = {
                primaryPhysician: doctorsInfo.filter((doc)=> doc.name == values.primaryPhysician)[0].$id,
                schedule: new Date(values.schedule),
                reason: values.reason!,
                status: "scheduled"
            }

            let response = await databases.updateDocument(
                DATABASE_ID,
                APPOINTMENT_COLLECTION_ID,
                appointmentDetails!.$id,
                appointmentData
              )

              
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

    useEffect(()=> {
        form.reset({ ...form.getValues(), 
            primaryPhysician: appointmentDetails?.primaryPhysician.name,
            schedule: appointmentDetails?.schedule ? new Date(appointmentDetails.schedule) : undefined,
            reason: appointmentDetails?.reason
            });
        getDoctors();
    }, [])

    const getDoctors = async()=> {
        try {
            let response = await databases.listDocuments(
                DATABASE_ID,
                DOCTOR_COLLECTION_ID,  
                [Query.isNotNull("image")]
            );
            const doctors2: DoctorType[] = response.documents.map((doc) => ({
                $id: doc.$id,
                name: doc.name,
                image: doc.image,
                area_of_specialization: doc.area_of_specialization,
                hospital_location: doc.hospital_location,
                hospital_name: doc.hospital_name,
                linkedin: doc.linkedin
            }));
    
            // Set the state with the transformed data
            setDoctorsInfo(doctors2);
            console.log(response.documents, 'active')
        } catch (error) {
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
                    <h1>Schedule Appointment </h1>
                    <h3>Please fill in the following details to schedule</h3>
                </div>
                <div className="cancel">
                    <svg style={{cursor: 'pointer'}} onClick={closeModal} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.16699 4.1665L15.8337 15.8332M15.8337 4.1665L4.16699 15.8332" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                </div>
            </div>
            {/* <div className="body_schedule">
                <div className="inputs relative mb-5">
                    <label htmlFor="">Doctor</label>
                    <SearchField
                    />
                </div>
                <div className="inputs relative mb-5">
                    <label htmlFor="">Reason for appointment </label>
                    <textarea name="" id="" placeholder='ex: Annual montly check-up'></textarea>
                </div>
                <div className="inputs relative mb-5">
                    <label htmlFor="">Expected appointment date</label>
                    <div className="prefix_input">
                        <input type="text" placeholder='Select your appointment date' name="" id="" />
                        <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 8.2H1M12.5556 1V4.6M5.44444 1V4.6M5.26667 19H12.7333C14.2268 19 14.9735 19 15.544 18.7057C16.0457 18.4469 16.4537 18.0338 16.7094 17.5258C17 16.9482 17 16.1921 17 14.68V7.12C17 5.60786 17 4.85179 16.7094 4.27423C16.4537 3.76619 16.0457 3.35314 15.544 3.09428C14.9735 2.8 14.2268 2.8 12.7333 2.8H5.26667C3.77319 2.8 3.02646 2.8 2.45603 3.09428C1.95426 3.35314 1.54631 3.76619 1.29065 4.27423C1 4.85179 1 5.60786 1 7.12V14.68C1 16.1921 1 16.9482 1.29065 17.5258C1.54631 18.0338 1.95426 18.4469 2.45603 18.7057C3.02646 19 3.77319 19 5.26667 19Z" stroke="#CDE9DF" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                </div>
                <Link href="/admin/success">
                    <button className='submut_schedule' >Schedule appointment</button>
                </Link>
            </div> */}
            
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
                    <>
                        <CustomFormField
                            fieldType={FormFieldType.SELECT}
                            control={form.control}
                            name="primaryPhysician"
                            label="Doctor"
                            placeholder="Select a doctor"
                            defaultValue={appointmentDetails?.primaryPhysician.name}
                        >
                            {doctorsInfo.map((doctor) => (
                                <SelectItem
                                    key={doctor.name}
                                    value={doctor.name}
                                >
                                    <div className="flex cursor-pointer items-center gap-2">
                                        <Image
                                            src={doctor.image}
                                            alt={doctor.name}
                                            width={32}
                                            height={32}
                                            className="rounded-full border border-dark-500"
                                        />
                                        <p>{doctor.name}</p>
                                    </div>
                                </SelectItem>
                            ))}
                        </CustomFormField>

                        <CustomFormField
                                fieldType={FormFieldType.TEXTAREA}
                                control={form.control}
                                name="reason"
                                label="Reason for Appointment"
                                placeholder="Enter reason for appointment"
                            />

                        <CustomFormField
                            fieldType={FormFieldType.DATE_PICKER}
                            control={form.control}
                            name="schedule"
                            label="Expected Appointment Date"
                            showTimeSelect
                            dateFormat="MM/dd/yyyy - h:mm aa"
                        />


                    </>
                

                <SubmitButton
                    isLoading={isLoading}
                >
                    Schedule appointment
                </SubmitButton>
            </form>

        </Form>
        </div>
        </div>
  )
}

export default ScheduleModal;
