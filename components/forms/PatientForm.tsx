"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState, useRef, useEffect } from "react";
import { string, z } from "zod";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Form } from "@/components/ui/form";
import CustomFormField from "@/components/CustomFormField";
import SubmitButton from "@/components/SubmitButton";
import { UserFormValidation } from "@/lib/validation";
import { createUser } from "@/lib/actions/patient.actions";
import {databases, DATABASE_ID, PATIENT_COLLECTION_ID, DOCTOR_COLLECTION_ID, account} from '../../lib/appwriteConfig2'
import { ID, Query } from "appwrite";


export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
}

interface PatientFormProps {
  type: string; 
}

const PatientForm: React.FC<PatientFormProps> = ({ type }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [otpErr, setOtpError] = useState(false);

  const [adminLink, setAdminLink] = useState(false);

  const [isDoctor, setIsDoctor] = useState(false);

  const [linkId, setLinkId] = useState<string>(""); 


  const [userId, setUserId] = useState<string>(""); 




  const [isOtp, setIsOtp] = useState(false);

  const OTP_LENGTH = 6;
  const [otp, setOtp] = useState<string[]>(new Array(OTP_LENGTH).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Handle input change
  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // Allow only digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // Handle paste event
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, OTP_LENGTH).split("");
    setOtp(pastedData);

    pastedData.forEach((char, idx) => {
      if (inputsRef.current[idx]) {
        inputsRef.current[idx]!.value = char;
      }
    });
    inputsRef.current[pastedData.length - 1]?.focus();
  };


  useEffect(()=> {
    localStorage.removeItem('doctorInfo')
    localStorage.removeItem('userInfo')
    localStorage.removeItem('expiresAt')
  }, [])


  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const toaster = (message:string, type:string) => {
    if(type == 'err') {
      toast.error(message)
    }else {
      toast.success(message);
    }
  };

  async function onSubmit({
    name,
    email,
    phone,
  }: z.infer<typeof UserFormValidation>) {
    if(type == "patient") {
      loginPatient(name,email,phone);
    }else {
      loginDoctor(name,email,phone);
    }
    
  }

  // const loginDoctor = async (name:string, email:string, phone:string)=> {
  //   setIsLoading(true);

  //   try {
  //     const userData = { name, email, phone };


  //     let checkInfo = await databases.listDocuments(
  //       DATABASE_ID,
  //       DOCTOR_COLLECTION_ID,
  //       [
  //           Query.equal('email', [email]),
  //           Query.equal('phone', [phone]),
  //           Query.equal('name', [name]),
  //       ]
  //   );

  //   if(checkInfo.total == 0) {
  //     let response = await databases.createDocument(
  //             DATABASE_ID,
  //             DOCTOR_COLLECTION_ID,
  //             ID.unique(),
  //             userData
  //           )

  //           const result = await account.create(
  //             ID.unique(), 
  //             email, 
  //             `${email}${phone}`, 
  //             name 
  //         );
  //           const token = await account.createPhoneToken(
  //             ID.unique(),
  //             phone
  //           );


            
  //     setUserId(token.userId);
         



  //     localStorage.setItem('doctorInfo', JSON.stringify(response))

  //     // Set expiration time (current time + 3 hours)
  //     const expirationTime = (new Date().getTime() + 3 * 60 * 60 * 1000).toString();

  //     localStorage.setItem('expiresAt', expirationTime);

      
  //     setIsDoctor(true);
  //     setLinkId(response.$id);
  //     setAdminLink(false);

   


  //     setIsOtp(true);

      
  //     // router.push(`/patients/${response.$id}/register`)
  //     // router.push(`/doctor/register/${response.$id}`)
  //   }else {
  //     localStorage.setItem('doctorInfo', JSON.stringify(checkInfo.documents[0]))

  //     // Set expiration time (current time + 3 hours)
  //     const expirationTime = (new Date().getTime() + 3 * 60 * 60 * 1000).toString();

  //     localStorage.setItem('expiresAt', expirationTime);

      
      
  //     setIsDoctor(true);
  //     setLinkId(checkInfo.documents[0].$id);
  //     setAdminLink(true);

  //     const token = await account.createPhoneToken(
  //       ID.unique(),
  //       phone
  //     );
   

  //     setUserId(token.userId);

  //     setIsOtp(true);

  //     // router.push(`/admin`)
  //   }


  //   toaster('successful', 'success');

          


  //     console.log(userData, 'active')
  //     // const user = await createUser(userData);

  //     setIsLoading(false)

  //     // console.log(user, 'resgistee');

  //     // if (user) router.push(`/patients/${user.$id}/register`);
  //   } catch (error) {
  //     toaster(JSON.stringify(error), 'err');
  //     setIsLoading(false);
  //     console.error(error);
  //   }

  // }


  const loginDoctor = async (name: string, email: string, phone: string) => {
    setIsLoading(true);
  
    try {
      const userData = { name, email, phone };
  
      // Check if the doctor already exists
      const checkInfo = await databases.listDocuments(
        DATABASE_ID,
        DOCTOR_COLLECTION_ID,
        [
          Query.equal("email", [email]),
          Query.equal("phone", [phone]),
        ]
      );
  
      let doctorData;
      let token;
      let isNewDoctor = checkInfo.total === 0;
  
      if (isNewDoctor) {
  
        // 1️⃣ Create the user account first (If this fails, execution stops)
        const accountResult = await account.create(ID.unique(), email, `${email}${phone}`, name);
  
        // 2️⃣ If successful, execute the remaining API calls
        const [response, phoneToken] = await Promise.all([
          databases.createDocument(DATABASE_ID, DOCTOR_COLLECTION_ID, ID.unique(), userData),
          account.createPhoneToken(ID.unique(), phone),
        ]);
  
        doctorData = response;
        token = phoneToken;
      } else {
        // If doctor exists, only generate a new phone token
        const phoneToken = await account.createPhoneToken(ID.unique(), phone);
        doctorData = checkInfo.documents[0];
        token = phoneToken;
      }
  
      // Store doctor info in localStorage
      localStorage.setItem("doctorInfo", JSON.stringify(doctorData));
  
      // Set expiration time (current time + 3 hours)
      const expirationTime = (Date.now() + 3 * 60 * 60 * 1000).toString();
      localStorage.setItem("expiresAt", expirationTime);
  
      // Update state
      setUserId(token.userId);
      setIsOtp(true);
      setIsDoctor(true);
      setLinkId(doctorData.$id);
      setAdminLink(!isNewDoctor); // Admin if doctor already exists
  
      // toaster("Login successful!", "success");
      console.log("Doctor Data:", doctorData);
    } catch (error: any) {
      setIsLoading(false);
  
      // Improved error handling
      let errorMessage = "An unexpected error occurred.";
      if (error?.message) {
        errorMessage = error.message;
      } else {
        try {
          errorMessage = JSON.stringify(error);
        } catch {
          console.error("Error parsing error:", error);
        }
      }
  
      toaster(errorMessage, "err");
    } finally {
      setIsLoading(false);
    }
  };
  
  

  // const loginPatient = async(name:string, email:string, phone:string)=> {
  //   setIsLoading(true);

  //   try {
  //     const userData = { name, email, phone };


  //     let checkInfo = await databases.listDocuments(
  //       DATABASE_ID,
  //       PATIENT_COLLECTION_ID,
  //       [
  //           Query.equal('email', [email]),
  //           Query.equal('phone', [phone]),

  //       ]
  //   );

  //   if(checkInfo.total == 0) {
  //     let response = await databases.createDocument(
  //             DATABASE_ID,
  //             PATIENT_COLLECTION_ID,
  //             ID.unique(),
  //             userData
  //           )

  //     const result = await account.create(
  //         ID.unique(), 
  //         email, 
  //         `${email}${phone}`, 
  //         name 
  //     );

  //     const token = await account.createPhoneToken(
  //       ID.unique(),
  //       phone
  //   );

  //     localStorage.setItem('userInfo', JSON.stringify(response))

  //     // Set expiration time (current time + 3 hours)
  //     const expirationTime = (new Date().getTime() + 3 * 60 * 60 * 1000).toString();

  //     localStorage.setItem('expiresAt', expirationTime);

  //     setIsDoctor(false);
  //     setLinkId(response.$id);


  //     // router.push(`/patients/${response.$id}/register`)

  //   }else {
  //     localStorage.setItem('userInfo', JSON.stringify(checkInfo.documents[0]))

  //     // Set expiration time (current time + 3 hours)
  //     const expirationTime = (new Date().getTime() + 3 * 60 * 60 * 1000).toString();

  //     localStorage.setItem('expiresAt', expirationTime);

  //     setIsDoctor(false);
  //     setLinkId(checkInfo.documents[0].$id);


  //     // router.push(`/patients/${checkInfo.documents[0].$id}/register`)

  //     const token = await account.createPhoneToken(
  //       ID.unique(),
  //       phone
  //     );
   

  //   setUserId(token.userId);

  //   setIsOtp(true);


  //   console.log(token, 'sms');

  //     // const sessionToken = await account.createEmailToken(
  //     //   ID.unique(),
  //     //   email
  //     // );    
  //   }


  //   toaster('successful', 'success');

  //     console.log(userData, 'active')
  //     // const user = await createUser(userData);

  //     setIsLoading(false)


  //     // if (user) router.push(`/patients/${user.$id}/register`);

  //   } catch (error:any) {
  //     setIsLoading(false);
  //     if (typeof error === 'object' && error !== null && 'message' in error) {
  //       toaster((error as { message: string }).message, 'err'); // Type assertion
  //     } else if (typeof error === 'string') {
  //       toaster(error, 'err');
  //     } else {
  //         try {
  //           const parsedError = JSON.stringify(error);
  //           toaster(parsedError, 'err');
  //         } catch (stringifyError) {
  //           toaster("An unexpected error occurred.", 'err'); // Fallback message
  //           console.error("Error stringifying error:", stringifyError);
  //         }
  //     }
  //   }
  // }

  const loginPatient = async (name: string, email: string, phone: string) => {
    setIsLoading(true);
  
    try {
      const userData = { name, email, phone };
  
      // Check if the user already exists
      const checkInfo = await databases.listDocuments(
        DATABASE_ID,
        PATIENT_COLLECTION_ID,
        [
          Query.equal("email", [email]),
          Query.equal("phone", [phone]),
        ]
      );
  
      let userId = "";
      let patientData;
      let token;
  
      if (checkInfo.total === 0) {
  
        // 1️⃣ Create the user account first (If this fails, execution stops)
        const result = await account.create(ID.unique(), email, `${email}${phone}`, name);
  
        // 2️⃣ If successful, create patient record & phone token in parallel
        const [response, phoneToken] = await Promise.all([
          databases.createDocument(DATABASE_ID, PATIENT_COLLECTION_ID, ID.unique(), userData),
          account.createPhoneToken(ID.unique(), phone),
        ]);
  
        userId = phoneToken.userId;
        patientData = response;
        token = phoneToken;
      } else {
        const existingPatient = checkInfo.documents[0];
  
        // Generate phone token for existing user
        const phoneToken = await account.createPhoneToken(ID.unique(), phone);
  
        userId = phoneToken.userId;
        patientData = existingPatient;
        token = phoneToken;
      }
  
      // Store user info in localStorage
      localStorage.setItem("userInfo", JSON.stringify(patientData));
  
      // Set expiration time (current time + 3 hours)
      const expirationTime = (Date.now() + 3 * 60 * 60 * 1000).toString();
      localStorage.setItem("expiresAt", expirationTime);
  
      // Update state
      setUserId(userId);
      setIsOtp(true);
      setIsDoctor(false);
      setLinkId(patientData.$id);
  
      // toaster("Successful", "success");
      console.log('token', token);
      console.log("User Created:", userData);
    } catch (error: any) {
      setIsLoading(false);
  
      console.log(error, 'iii');
  
      // Handle different error types gracefully
      let errorMessage = "An unexpected error occurred.";
      if (error?.message) {
        errorMessage = error.message;
      } else {
        try {
          errorMessage = JSON.stringify(error);
        } catch {
          console.error("Error stringifying error:", error);
        }
      }
  
      toaster(errorMessage, "err");
    } finally {
      setIsLoading(false);
    }
  };
  

  const verifyOtp = async()=> {
    try {
      setIsLoading(true);
  
      console.log("User ID:", userId);
      console.log("OTP Entered:", otp.join(""));

      const session = await account.createSession(
        userId,
        otp.join('')
      );

      toaster("Successful", "success");
  
      setIsLoading(false);
      setOtpError(false);

      if(isDoctor && !adminLink) {
        router.push(`/doctor/register/${linkId}`)
      }else if(isDoctor && adminLink) {
        router.push(`/admin`)
      }else {
        router.push(`/patients/${linkId}/register`)
      }

  
  
      console.log(session, 'omo');
      
    } catch (error) {
      setIsLoading(false);
      setOtpError(true);
      console.log(error);
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
          <section className="mb-12 space-y-4">
            <h1 className="header">Hello!</h1>
            <p className="text-dark-700">{type == "patient" ? "Schedule your first appointment" : "Manage your appointments"}</p>
          </section>

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="name"
            label="Full name"
            placeholder="John Doe"
            iconSrc="/assets/icons/user.svg"
            iconAlt="User icon"
          />

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="email"
            label="Email address"
            placeholder="johndoe@gmail.com"
            iconSrc="/assets/icons/email.svg"
            iconAlt="Email icon"
          />

          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="phone"
            label="Phone number"
            placeholder="+234 803 312 5476"
          />

          <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
        </form>

        <ToastContainer />
      </Form>
      
      {isOtp && <div className="otpmodal">
        <div className="mainModal">
          <div className="first">
            <h1>Verify OTP</h1>
            <svg onClick={()=> {
              setIsOtp(false);
            }} width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.1667 14.1665L25.8334 25.8332M25.8334 14.1665L14.1667 25.8332" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
          <p>Please enter the OTP sent to your registered mobile number.</p>
          <div className="inputs">
              {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputsRef.current[index] = el;
                }}
                type="text"
                maxLength={1}
                style={{border: otpErr? '1px solid red': '1px solid #363A3D'}}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-12 text-center text-xl border border-gray-300 rounded"
              />
            ))}
          </div>
          <button onClick={() => !isLoading && verifyOtp()}>
            {isLoading ? 'Loading' : 'Verify'}
          </button>
        </div>
      </div>}

    </div>
  );
};

export default PatientForm;
