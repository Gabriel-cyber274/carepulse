"use server";

import {account, databases, storage} from '../appwriteConfig2'
import { ID, Query } from "appwrite";

const {
    PROJECT_ID = "",
    DATABASE_ID = "",
    PATIENT_COLLECTION_ID = "",
    DOCTOR_COLLECTION_ID = "",
    APPOINTMENT_COLLECTION_ID = "",
    BUCKET_ID = "",
    PATIENT_OTP_ID = "",
    DOCTOR_OTP_ID = "",
    ENDPOINT = "",
    API_KEY = "",
} = process.env;

  

export const getDoctorLanding = async()=> {
    let response = await databases.listDocuments(
        DATABASE_ID,
        DOCTOR_COLLECTION_ID,
        [Query.isNotNull("image")]
    );

    return response;
}

export const checkInfoPatientLogin = async(email:any, phone:any)=> {
    const checkInfo = await databases.listDocuments(DATABASE_ID, PATIENT_COLLECTION_ID, [
        Query.equal("email", [email]),
        Query.equal("phone", [phone]),
      ]);
  
    return checkInfo;
}

export const checkInfoDoctorLogin = async(email:any, phone:any)=> {
    const checkInfo = await databases.listDocuments(DATABASE_ID, 
        DOCTOR_COLLECTION_ID, [
        Query.equal("email", [email]),
        Query.equal("phone", [phone]),
      ]);
  
    return checkInfo;
}


export const createUserAcc = async(email:any, phone:any, name:any)=> {
    const response = await account.create(ID.unique(), email, `${email}${phone}`, name);
  
    return response;
}

export const createPatientAcc = async(userData:any)=> {
    const response = await databases.createDocument(DATABASE_ID, PATIENT_COLLECTION_ID, ID.unique(), userData);
  
    return response;
}

export const createDoctorAcc = async(userData:any)=> {
    const response = await databases.createDocument(DATABASE_ID, DOCTOR_COLLECTION_ID, ID.unique(), userData);
  
    return response;
}


export const createPatientOtp = async(id:any, otp:any)=> {
    const response = await databases.createDocument(DATABASE_ID, PATIENT_OTP_ID, ID.unique(), { patient: id, otp });
  
    return response;
}

export const createDoctorOtp = async(id:any, otp:any)=> {
    const response = await databases.createDocument(DATABASE_ID, DOCTOR_OTP_ID, ID.unique(), { doctor: id, otp });
  
    return response;
}


export const validateOtp = async(isDoctor:any, linkId:any)=> {
    const response = await databases.listDocuments(
        DATABASE_ID,
        isDoctor? DOCTOR_OTP_ID: PATIENT_OTP_ID,
        [isDoctor? Query.equal("doctor", linkId) : Query.equal("patient", linkId)]
      );
  
    return response;
}


export const uploadFile = async(fileToUpload:any)=> {
    const response = await storage.createFile(
        BUCKET_ID,
        ID.unique(),
        fileToUpload
    );
  
    return response;
}


export const updatePatient = async(id:any, patientData:any)=> {
    const response = await databases.updateDocument(
        DATABASE_ID,
        PATIENT_COLLECTION_ID,
        id,
        patientData
    );
  
    return response;
}

export const updateDoctor = async(id:any, doctorData:any)=> {
    const response = await databases.updateDocument(
        DATABASE_ID,
        DOCTOR_COLLECTION_ID,
        id,
        doctorData
    );
  
    return response;
}

export const AppointmentCreate = async(appointmentData:any)=> {
    const response = await databases.createDocument(
        DATABASE_ID,
        APPOINTMENT_COLLECTION_ID,
        ID.unique(),
        appointmentData
      );
  
    return response;
}


export const GetSinglePatient = async(email:any)=> {
    const response = await databases.listDocuments(
        DATABASE_ID,
        PATIENT_COLLECTION_ID,
        [Query.equal("email", [email])]
    );
  
    return response;
}


export const GetSingleDoctor = async(email:any)=> {
    const response = await databases.listDocuments(
        DATABASE_ID,
        DOCTOR_COLLECTION_ID,
        [Query.equal("email", [email])]
    );
  
    return response;
}

export const AppointmentGet = async(id:any)=> {
    const response = await databases.listDocuments(
        DATABASE_ID,
        APPOINTMENT_COLLECTION_ID,
        [Query.equal("primaryPhysician", [id]), Query.orderDesc("$createdAt")]
    );
  
    return response;
}


export const AppointmentUpdate = async(id:any, data:any)=> {
    const response = await databases.updateDocument(
        DATABASE_ID,
        APPOINTMENT_COLLECTION_ID,
        id,
        data
      );
  
    return response;
}


export default async function getMeetingLink(appointmentDetails: any, appointmentData: any): Promise<string | { error: any }> {
    const clientId = process.env.ZOOM_CLIENT_ID;
    const clientSecret = process.env.ZOOM_CLIENT_SECRET;
    const accountId = process.env.ZOOM_ACCOUNT_ID;

    try {
        const tokenResponse = await fetch(`https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`, {
            method: "POST",
            headers: {
                "Authorization": "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        if (!tokenResponse.ok) {
            const errorData = await tokenResponse.json();
            console.error("Failed to fetch Zoom token:", errorData);
            return { error: "Failed to fetch Zoom token" };
        }

        const { access_token } = await tokenResponse.json();

        const meetingResponse = await fetch("https://api.zoom.us/v2/users/me/meetings", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${access_token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                topic: `Appointment with ${appointmentDetails?.primaryPhysician.name}`,
                type: 2, 
                start_time: appointmentData.schedule.toISOString(),
                duration: 30,
                timezone: "UTC",
                agenda: appointmentData.reason,
                settings: {
                    host_video: true,
                    participant_video: true,
                    join_before_host: true, // Keep this for flexibility
                },
            }),
        });

        if (!meetingResponse.ok) {
            const errorData = await meetingResponse.json();
            console.error("Failed to create Zoom meeting:", errorData);
            return { error: "Failed to create Zoom meeting" };
        }

        const { join_url } = await meetingResponse.json();
        return join_url;

    } catch (error) {
        console.error("Error in getMeetingLink:", error);
        return { error: "Internal Server Error" };
    }
}

