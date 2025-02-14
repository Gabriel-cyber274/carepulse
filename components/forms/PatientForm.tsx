"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Form } from "@/components/ui/form";
import CustomFormField from "@/components/CustomFormField";
import SubmitButton from "@/components/SubmitButton";
import { UserFormValidation } from "@/lib/validation";
import { createUser } from "@/lib/actions/patient.actions";
import {databases, DATABASE_ID, PATIENT_COLLECTION_ID, DOCTOR_COLLECTION_ID} from '../../lib/appwriteConfig2'
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

  const loginDoctor = async (name:string, email:string, phone:string)=> {
    setIsLoading(true);

    try {
      const userData = { name, email, phone };


      let checkInfo = await databases.listDocuments(
        DATABASE_ID,
        DOCTOR_COLLECTION_ID,
        [
            Query.equal('email', [email]),
        ]
    );

    if(checkInfo.total == 0) {
      let response = await databases.createDocument(
              DATABASE_ID,
              DOCTOR_COLLECTION_ID,
              ID.unique(),
              userData
            )

      localStorage.setItem('doctorInfo', JSON.stringify(response))

      // Set expiration time (current time + 3 hours)
      const expirationTime = (new Date().getTime() + 3 * 60 * 60 * 1000).toString();

      localStorage.setItem('expiresAt', expirationTime);

      
      // router.push(`/patients/${response.$id}/register`)
      router.push(`/doctor/register/${response.$id}`)
    }else {
      localStorage.setItem('doctorInfo', JSON.stringify(checkInfo.documents[0]))

      // Set expiration time (current time + 3 hours)
      const expirationTime = (new Date().getTime() + 3 * 60 * 60 * 1000).toString();

      localStorage.setItem('expiresAt', expirationTime);

      router.push(`/admin`)
    }


    toaster('successful', 'success');

          


      console.log(userData, 'active')
      // const user = await createUser(userData);

      setIsLoading(false)

      // console.log(user, 'resgistee');

      // if (user) router.push(`/patients/${user.$id}/register`);
    } catch (error) {
      toaster(JSON.stringify(error), 'err');
      setIsLoading(false);
      console.error(error);
    }

  }

  const loginPatient = async(name:string, email:string, phone:string)=> {
    setIsLoading(true);

    try {
      const userData = { name, email, phone };


      let checkInfo = await databases.listDocuments(
        DATABASE_ID,
        PATIENT_COLLECTION_ID,
        [
            Query.equal('email', [email]),
        ]
    );

    if(checkInfo.total == 0) {
      let response = await databases.createDocument(
              DATABASE_ID,
              PATIENT_COLLECTION_ID,
              ID.unique(),
              userData
            )

      localStorage.setItem('userInfo', JSON.stringify(response))

      // Set expiration time (current time + 3 hours)
      const expirationTime = (new Date().getTime() + 3 * 60 * 60 * 1000).toString();

      localStorage.setItem('expiresAt', expirationTime);



      // console.log(response, 'active created')
      router.push(`/patients/${response.$id}/register`)

    }else {
      localStorage.setItem('userInfo', JSON.stringify(checkInfo.documents[0]))

      // Set expiration time (current time + 3 hours)
      const expirationTime = (new Date().getTime() + 3 * 60 * 60 * 1000).toString();

      localStorage.setItem('expiresAt', expirationTime);

      // console.log(checkInfo.documents[0].$id, 'active2')
      router.push(`/patients/${checkInfo.documents[0].$id}/register`)
    }


    toaster('successful', 'success');

          


      console.log(userData, 'active')
      // const user = await createUser(userData);

      setIsLoading(false)

      // console.log(user, 'resgistee');

      // if (user) router.push(`/patients/${user.$id}/register`);
    } catch (error) {
      toaster(JSON.stringify(error), 'err');
      setIsLoading(false);
      console.error(error);
    }
  }

  return (
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
  );
};

export default PatientForm;
