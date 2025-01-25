"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { z } from "zod"

import { Form } from "@/components/ui/form"
import CustomFormField from "@/components/CustomFormField"
import SubmitButton from "@/components/SubmitButton"
import { getAppointmentSchema } from "@/lib/validation"
import { createUser } from "@/lib/actions/patient.actions"
import { FormFieldType } from "@/components/forms/PatientForm"
import { Doctors } from "@/constants"
import { SelectItem } from "@/components/ui/select"
import Image from "next/image"
import { create } from "domain"
import { createAppointment } from "@/lib/actions/appointment.actions"
import { ID, Query } from "appwrite";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import {databases, DATABASE_ID, PATIENT_COLLECTION_ID, APPOINTMENT_COLLECTION_ID, BUCKET_ID, storage, ENDPOINT, PROJECT_ID, DOCTOR_COLLECTION_ID, API_KEY} from '../../lib/appwriteConfig2'
import { InputFile } from "node-appwrite/file"
import { DoctorType } from "@/types/appwrite.types"


const AppointmentForm = ({
    userId, patientId, type
}: {
    userId: string;
    patientId: string;
    type: "create" | "cancel" | "schedule";
}) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [userDetails, setUserDetails] = useState({});
    const [identificationType, setidentificationType] = useState<string>("")
    const [gender, setGender] = useState<string>("")
    const [docUrl, setDocUrl] = useState<string>("")
    const [primaryPhysician, setPrimaryPhysician] = useState<string>("")
    const [reselect, setReselect] = useState<boolean>(false)
    const [doctorsInfo, setDoctorsInfo] = useState<DoctorType[]>([]);


    const AppointmentFormValidation = getAppointmentSchema(type)

    const form = useForm<z.infer<typeof AppointmentFormValidation>>({
        resolver: zodResolver(AppointmentFormValidation),
        defaultValues: {
            primaryPhysician: "",
            schedule: new Date(),
            reason: "",
            note: "",
            cancellationReason: "",
        },
    })

    const toaster = (message:string, type:string) => {
        if(type == 'err') {
          toast.error(message)
        }else {
          toast.success(message);
        }
      };


    async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
        setIsLoading(true);

        let status;

        switch (type) {
            case "cancel":
                status = "cancelled";
                break;
            case "schedule":
                status = "scheduled";
                break;
            default:
                status = "pending";
                break;
        }

        console.log("Type:", type);

        try {
            if (type === "create" && patientId) {
                console.log("Creating appointment with:", values);

                const appointmentData = {
                    // userId,
                    // patient: patientId,
                    patient: userId,
                    // primaryPhysician: values.primaryPhysician,
                    primaryPhysician: doctorsInfo.filter((doc)=> doc.name == values.primaryPhysician)[0].$id,
                    schedule: new Date(values.schedule),
                    reason: values.reason!,
                    note: values.note,
                    status: status as Status,
                }

                let response = await databases.createDocument(
                    DATABASE_ID,
                    APPOINTMENT_COLLECTION_ID,
                    ID.unique(),
                    appointmentData
                  )

                setIsLoading(false);

                if(response) {
                    toaster('successful', 'success');
                    form.reset();
                    setTimeout(() => {
                        router.back();
                    
                    }, 3000);
                }
                console.log(response, 'active');



                // const appointment = await createAppointment(appointmentData);

                // console.log("Created appointment:", appointment);

                console.log(appointmentData, 'hello')

                // if (appointment) {
                //     form.reset()
                //     router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.id}`)
                // }
            }

        } catch (error) {
            toaster(JSON.stringify(error), 'err');

            setIsLoading(false);

            console.error(error);
        }
    }

    let buttonLabel;

    switch (type) {
        case "cancel":
            buttonLabel = "Cancel Appointment";
            break;
        case "create":
            buttonLabel = "Create Appointment";
            break

        case "schedule":
            buttonLabel = "Schedule Appointment";
            break;

        default:
            break;
    }


    useEffect(()=> {
        getUsetInfo();
        getDoctors();
    }, [])

    const getDoctors = async()=> {
        try {
            let response = await databases.listDocuments(
                DATABASE_ID,
                DOCTOR_COLLECTION_ID,  
            );
            const doctors2: DoctorType[] = response.documents.map((doc) => ({
                $id: doc.$id,
                name: doc.name,
                image: doc.image,
                area_of_specialization: doc.area_of_specialization,
                hospital_location: doc.hospital_location,
                hospital_name: doc.hospital_name,
            }));
    
            // Set the state with the transformed data
            setDoctorsInfo(doctors2);
            console.log(response.documents, 'active')
        } catch (error) {
            setIsLoading(false);
            console.error(error);
        }
    }

    const getUsetInfo =async()=> {
        const localInfo = localStorage.getItem("userInfo");
        if (localInfo) {
            try {
                const parsedInfo = JSON.parse(localInfo);
                const checkInfo = await databases.listDocuments(
                    DATABASE_ID,
                    PATIENT_COLLECTION_ID,
                    [Query.equal("email", [parsedInfo.email])]
                );

                if (checkInfo.documents.length > 0) {
                    const userInfo = checkInfo.documents[0];
                    setUserDetails(userInfo);
                    localStorage.setItem("userInfo", JSON.stringify(userInfo));

                }
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        }
    }



    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
                <section className="mb-12 space-y-4">
                    <h1 className="header">New Appointment</h1>
                    <p className="text-dark-700">Request a new appointment in 10 seconds</p>
                </section>

                {type !== "cancel" && (
                    <>
                        <CustomFormField
                            fieldType={FormFieldType.SELECT}
                            control={form.control}
                            name="primaryPhysician"
                            label="Doctor"
                            placeholder="Select a doctor"
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
                            fieldType={FormFieldType.DATE_PICKER}
                            control={form.control}
                            name="schedule"
                            label="Expected Appointment Date"
                            showTimeSelect
                            dateFormat="MM/dd/yyyy - h:mm aa"
                        />

                        <div className="flex flex-col gap-6 xl:flex-row">
                            <CustomFormField
                                fieldType={FormFieldType.TEXTAREA}
                                control={form.control}
                                name="reason"
                                label="Reason for Appointment"
                                placeholder="Enter reason for appointment"
                            />

                            <CustomFormField
                                fieldType={FormFieldType.TEXTAREA}
                                control={form.control}
                                name="note"
                                label="Additional Notes"
                                placeholder="Enter additional notes"
                            />
                        </div>
                    </>
                )}

                {type === "cancel" && (
                    <CustomFormField
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control}
                        name="cancellationReason"
                        label="Reason for Cancellation"
                        placeholder="Enter reason for cancellation"
                    />
                )}

                <SubmitButton
                    isLoading={isLoading}
                    classname={`${type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"} w-full`}
                >
                    {buttonLabel}
                </SubmitButton>
            </form>
            <ToastContainer />

        </Form>
    )
}

export default AppointmentForm