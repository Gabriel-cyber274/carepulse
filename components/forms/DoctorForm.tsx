"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { z } from "zod";

import Image from 'next/image';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Form, FormControl } from "@/components/ui/form";
import CustomFormField from "@/components/CustomFormField";
import SubmitButton from "@/components/SubmitButton";
import { UserFormValidation, DoctorFormValidation } from "@/lib/validation";
import { createUser } from "@/lib/actions/patient.actions";
import {databases, DATABASE_ID, PATIENT_COLLECTION_ID, BUCKET_ID, storage, ENDPOINT, PROJECT_ID, DOCTOR_COLLECTION_ID, API_KEY} from '../../lib/appwriteConfig2'
import { ID, Query } from "appwrite";
import FileUploader from "@/components/FileUploader"


import { SelectItem } from "@/components/ui/select"

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
}

const DoctorForm = ({ user }: { user: User }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [docUrl, setDocUrl] = useState<string>("")
  const [area, setArea] = useState<string>("")
  const [reselect, setReselect] = useState<boolean>(false)



  const areasOfSpecialization = [
    "Cardiology",
    "Dermatology",
    "Neurology",
    "Pediatrics",
    "Oncology",
    "Orthopedics",
    "Gastroenterology",
    "Psychiatry",
    "Urology",
    "Nephrology",
    "Ophthalmology",
    "Pulmonology",
    "Endocrinology",
    "Hematology",
    "Rheumatology",
    "Obstetrics and Gynecology",
    "Plastic Surgery",
    "Anesthesiology",
    "Pathology",
    "Radiology",
    "General Surgery",
    "Emergency Medicine",
    "Infectious Disease",
    "Sports Medicine",
    "Geriatrics",
    "Family Medicine",
  ];  

  const form = useForm<z.infer<typeof DoctorFormValidation>>({
    resolver: zodResolver(DoctorFormValidation),
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

  async function onSubmit(values: z.infer<typeof DoctorFormValidation>) {
    let fileToUpload: File | undefined;
    
        
    if (values.image && values.image.length > 0) {
        fileToUpload = values.image[0]; // Directly assign the File object
    }

    if (!BUCKET_ID || !PROJECT_ID || !DATABASE_ID || !DOCTOR_COLLECTION_ID) {
        console.error("Required environment variables are missing.");
        return;
    }

    setIsLoading(true);

    try {
        let fileUrl = "";
        if (fileToUpload) {
            // Upload file
            const uploadedFile = await storage.createFile(
                BUCKET_ID,
                ID.unique(),
                fileToUpload
            );
            fileUrl = `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${uploadedFile.$id}/view?project=${PROJECT_ID}`;

            console.log("File uploaded successfully:", uploadedFile);
            console.log("File URL:", fileUrl);
        } else {
            console.warn("No file selected for upload.");
        }

        
        const localInfo = localStorage.getItem("doctorInfo");
        if (localInfo) {
            
            const parsedInfo = JSON.parse(localInfo);

                    
            const doctorData = {
                ...values,
                image: fileUrl ? fileUrl : parsedInfo.image,
            };
            
            const response = await databases.updateDocument(
                DATABASE_ID,
                DOCTOR_COLLECTION_ID,
                parsedInfo.$id,
                doctorData
            );

            setIsLoading(false);

            toaster('successful', 'success');

            if (response) router.push(`/admin`);

        }

    } catch (error) {
      toaster(JSON.stringify(error), 'err');
      setIsLoading(false);
      console.error(error);
    }
  }

  useEffect(()=> {
    if(localStorage.doctorInfo == undefined) {
      router.replace('/doctor');
    } else {
      getUsetInfo();
    }
  }, [])


  const getUsetInfo =async()=> {
    const localInfo = localStorage.getItem("doctorInfo");
    if (localInfo) {
        try {
            const parsedInfo = JSON.parse(localInfo);
            const checkInfo = await databases.listDocuments(
                DATABASE_ID,
                DOCTOR_COLLECTION_ID,
                [Query.equal("email", [parsedInfo.email])]
            );

            if (checkInfo.documents.length > 0) {
                const userInfo = checkInfo.documents[0];
                setUserDetails(userInfo);
                localStorage.setItem("doctorInfo", JSON.stringify(userInfo));

                setDocUrl(userInfo.image ?? "")
                setArea(userInfo.area_of_specialization ?? "")

                // Update form values
                form.reset({ ...form.getValues(), email: userInfo.email, name: userInfo.name, phone: userInfo.phone, 
                    hospital_name: userInfo.hospital_name ?? "",
                    hospital_location: userInfo.hospital_location ?? "",
                    area_of_specialization: userInfo.area_of_specialization ?? "",
                });

            }
        } catch (error) {
            toaster(JSON.stringify(error), 'err');
            console.error("Error fetching user info:", error);
        }
    }
}

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="header">Hello!</h1>
          <p className="text-dark-700">Setup your profile</p>
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

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="hospital_name"
          label="hospital name"
          placeholder="enter hospital name"
        />

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="hospital_location"
          label="hospital location"
          placeholder="enter hospital location"
        />

        <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="area_of_specialization"
            label="Area of specialization"
            placeholder="Select specialization"
            defaultValue={area}
        >
            {areasOfSpecialization.map((type) => (
                <SelectItem
                    key={type}
                    value={type}
                >
                    {type}
                </SelectItem>
            ))}
        </CustomFormField>

        <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="image"
            label="Profile picture"
            renderSkeleton={(field) => (
                (docUrl !== "" && !reselect) ?
                    (
                        <div className="relative group">
                        <Image
                            onClick={() => setReselect(true)}
                            src={docUrl}
                            alt="uploaded image"
                            width={1000}
                            height={1000}
                            className="max-h-[400px] overflow-hidden object-cover"
                        />
                        
                        {/* Tooltip on hover */}
                        <div onClick={() => setReselect(true)} className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            Click to reselect
                        </div>
                        </div>
                    ):  
                        <FormControl>
                            <FileUploader
                                files={field.value}
                                onChange={field.onChange}
                            />
                        </FormControl>
            )}
        />

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>

      <ToastContainer />
    </Form>
  );
};

export default DoctorForm;
