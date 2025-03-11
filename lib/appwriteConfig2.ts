import { Client, Databases,Storage, Account } from "node-appwrite";


// export const PROJECT_ID = '678ab3270032f5946131'
// export const DATABASE_ID = '678ab400001c9e97dd16'
// export const PATIENT_COLLECTION_ID = '678ab42a0020e9b7bc89'
// export const DOCTOR_COLLECTION_ID = '678ab44c002c64422225'
// export const APPOINTMENT_COLLECTION_ID = '678ab47c0013fe393cf9'
// export const BUCKET_ID = "678ab4af00378d34288a"
// export const PATIENT_OTP_ID = "67c99352000c6e88ad15"
// export const DOCTOR_OTP_ID = "67c99d100038213f0b40"

// export const ENDPOINT = "https://cloud.appwrite.io/v1"
// export const API_KEY = "standard_8e29e7a0732b388c279ec95efb4cbfe5ab492fd4d4aaf9e3153e70d36ed2cbae783cc654f752db8b50302d9d11b13e0b70fea403a6db2e8e1c460606806f8a437e95f0ea81a69ed7672962c647b618755f517cdf444933aca5c550d63d02a0a50c5dd44c4f35a8fc9fc5ef618114e4bad5d37238a789eb0af6ba38475207dea3";



export const {
    PROJECT_ID,
    DATABASE_ID,
    PATIENT_COLLECTION_ID,
    DOCTOR_COLLECTION_ID,
    APPOINTMENT_COLLECTION_ID,
    // BUCKET_ID,
    PATIENT_OTP_ID,
    DOCTOR_OTP_ID,
    // ENDPOINT,
    API_KEY,
    NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
    NEXT_PUBLIC_ENDPOINT: ENDPOINT,
  } = process.env;
  

const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('678ab3270032f5946131')   
    .setKey(API_KEY)


   export const account = new Account(client);
    
    
    

export const databases = new Databases(client)
export const storage = new Storage(client);


export default client;


