"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { z } from "zod"
import Image from "next/image"
import * as Popover from '@radix-ui/react-popover';

import { Form, FormControl } from "@/components/ui/form"
import CustomFormField from "@/components/CustomFormField"
import SubmitButton from "@/components/SubmitButton"
import { PatientFormValidation } from "@/lib/validation"
import { registerPatient } from "@/lib/actions/patient.actions"
import { FormFieldType } from "@/components/forms/PatientForm"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants"
import { Label } from "@/components/ui/label"
import { SelectItem } from "@/components/ui/select"
import FileUploader from "@/components/FileUploader"
import { ID, Query } from "appwrite";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




import {databases, DATABASE_ID, PATIENT_COLLECTION_ID, BUCKET_ID, storage, ENDPOINT, PROJECT_ID, DOCTOR_COLLECTION_ID, API_KEY} from '../../lib/appwriteConfig2'
import { InputFile } from "node-appwrite/file"
import { DoctorType } from "@/types/appwrite.types"

const RegisterForm = ({ user }: { user: User }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [userDetails, setUserDetails] = useState({});
    const [identificationType, setidentificationType] = useState<string>("")
    const [gender, setGender] = useState<string>("")
    const [docUrl, setDocUrl] = useState<string>("")
    const [primaryPhysician, setPrimaryPhysician] = useState<string>("")
    const [reselect, setReselect] = useState<boolean>(false)
    const [doctorsInfo, setDoctorsInfo] = useState<DoctorType[]>([]);

    const [hoveredDoctor, setHoveredDoctor] = useState<DoctorType | null>(null);

    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);


    


    const form = useForm<z.infer<typeof PatientFormValidation>>({
        resolver: zodResolver(PatientFormValidation),
        defaultValues: {
            ...PatientFormDefaultValues,
            // primaryPhysician: "",
            name: "",
            email: "",
            phone: "",
            gender: "male", 
        },
    })

    const toaster = (message:string, type:string) => {
        if(type == 'err') {
          toast.error(message)
        }else {
          toast.success(message);
        }
      };
    
    // async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
    //     // setIsLoading(true);

    //     let formData;

    //     if (values.identificationDocument && values.identificationDocument.length > 0) {
    //         const blobFile = new Blob([values.identificationDocument[0]], {
    //             type: values.identificationDocument[0].type
    //         })

    //         formData = new FormData();
    //         formData.append("blobFile", blobFile);
    //         formData.append("fileName", values.identificationDocument[0].name);
    //     }

    //     try {
    //         const patientData = {
    //             ...values,
    //             // userId: user.$id,
    //             birthDate: new Date(values.birthDate),
    //             identificationDocument: formData,
    //         }


    //         // @ts-ignore
    //         const patient = await registerPatient(patientData);

    //         if (patient) router.push(`/patients/${user.$id}/new-appointment`);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }


    async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
        let fileToUpload: File | undefined;
    
        
        if (values.identificationDocument && values.identificationDocument.length > 0) {
            fileToUpload = values.identificationDocument[0]; // Directly assign the File object
        }
    
        if (!BUCKET_ID || !PROJECT_ID || !DATABASE_ID || !PATIENT_COLLECTION_ID) {
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
    
    
            const localInfo = localStorage.getItem("userInfo");
            if (localInfo) {
                try {
                    const parsedInfo = JSON.parse(localInfo);

                    
                    // Prepare patient data with the uploaded file URL
                    const patientData = {
                        ...values,
                        primaryPhysician: doctorsInfo.filter((doc)=> doc.name == form.getValues("primaryPhysician"))[0].$id,
                        birthDate: new Date(values.birthDate),
                        identificationDocument: fileUrl ? fileUrl : parsedInfo.identificationDocument,
                    };
                    
                    // Store patient data in the database
                    const response = await databases.updateDocument(
                        DATABASE_ID,
                        PATIENT_COLLECTION_ID,
                        parsedInfo.$id,
                        patientData
                    );

                    setIsLoading(false);

                    toaster('successful', 'success');



                    
                    if (response) router.push(`/patients/${parsedInfo.$id}/new-appointment`);
            
                    // console.log("Patient data:", patientData);
                    // console.log("Database response:", response);
                    getUsetInfo();

                }catch (error) {
                    toaster(JSON.stringify(error), 'err');

                    console.error("Error fetching user info:", error);
                }
            }
    
        } catch (error) {
            setIsLoading(false);
            toaster(JSON.stringify(error), 'err');


            console.error("Error uploading file or storing data:", error);
        }
    }
    

    useEffect(()=> {
        if(localStorage.userInfo == undefined) {
            router.replace('/');
        }else {
            getDoctors();
            getUsetInfo();
        }
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
            toaster(JSON.stringify(error), 'err');

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

                    setidentificationType(form.getValues("identificationType") || "")
                    setGender(form.getValues("gender") || "male")
                    setDocUrl(userInfo.identificationDocument || "")
                    setPrimaryPhysician(userInfo.primaryPhysician.name || "")

                    // Update form values
                    form.reset({ ...form.getValues(), email: userInfo.email, name: userInfo.name, phone: userInfo.phone, 
                        address: userInfo.address ?? "",
                        occupation: userInfo.occupation ?? "",
                        emergencyContactName: userInfo.emergencyContactName ?? "",
                        emergencyContactNumber: userInfo.emergencyContactNumber ?? "",
                        primaryPhysician: userInfo.primaryPhysician.name ?? "",
                        insuranceProvider: userInfo.insuranceProvider ?? "",
                        insurancePolicyNumber: userInfo.insurancePolicyNumber ?? "",
                        allergies: userInfo.allergies ?? "",
                        currentMedication: userInfo.currentMedication ?? "",
                        familyMedicalHistory: userInfo.familyMedicalHistory ?? "",
                        pastMedicalHistory: userInfo.pastMedicalHistory ?? "",
                        identificationType: userInfo.identificationType ?? "",
                        identificationNumber: userInfo.identificationNumber ?? "",
                        treatmentConsent: userInfo.treatmentConsent ?? false,
                        disclosureConsent: userInfo.disclosureConsent ?? false,
                        privacyConsent: userInfo.privacyConsent ?? false,
                        birthDate: userInfo.birthDate ?? new Date(Date.now()),
                        gender: userInfo.gender ?? "", });

                }
            } catch (error) {
                toaster(JSON.stringify(error), 'err');

                console.error("Error fetching user info:", error);
            }
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
                <section className="space-y-4">
                    <h1 className="header">Welcome!</h1>
                    <p className="text-dark-700">Let us know more about you.</p>
                </section>

                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Personal Information</h2>
                    </div>
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

                <div className="flex flex-col gap-6 xl:flex-row">
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
                </div>

                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        fieldType={FormFieldType.DATE_PICKER}
                        control={form.control}
                        name="birthDate"
                        label="Date of Birth"
                    />

                    <CustomFormField
                        fieldType={FormFieldType.SKELETON}
                        control={form.control}
                        name="gender"
                        label="Gender"
                        renderSkeleton={(field) => (
                            <FormControl>
                                <RadioGroup
                                    className="flex h-11 gap-6 xl:justify-between"
                                    onValueChange={field.onChange}
                                    // defaultValue={field.value}
                                    // defaultValue={gender}
                                    value={field.value || "male"} 
                                
                                >
                                    {GenderOptions.map((option) => (
                                        <div key={option} className="radio-group">
                                            <RadioGroupItem
                                                value={option}
                                                id={option}
                                            />
                                            <Label
                                                htmlFor={option}
                                                className="cursor-pointer"
                                            >
                                                {option}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        )}
                    />
                </div>

                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="address"
                        label="Address"
                        placeholder="ex: 11th Avenue, Lekki Phase 1"
                    />

                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="occupation"
                        label="Occupation"
                        placeholder="Software Engineer"
                    />
                </div>

                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="emergencyContactName"
                        label="Emergency contact name"
                        placeholder="Guardian's Name"
                    />

                    <CustomFormField
                        fieldType={FormFieldType.PHONE_INPUT}
                        control={form.control}
                        name="emergencyContactNumber"
                        label="Emergency contact number"
                        placeholder="+234 803 312 5476"
                    />
                </div>

                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Medical Information</h2>
                    </div>
                </section>


                <div className="relative">
            <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="primaryPhysician"
                label="Primary Physician"
                placeholder="Select a physician"
                defaultValue={primaryPhysician}
            >
                {doctorsInfo.map((doctor) => (
                    <div
                        key={doctor.name}

                        onMouseEnter={(e) => {
                            if (hideTimeout) clearTimeout(hideTimeout); // Cancel hiding timeout
                            setHoveredDoctor(doctor);
                            const rect = e.currentTarget.getBoundingClientRect();
                            setTooltipPosition({ x: rect.right + 10, y: rect.top });
                        }}
                        onMouseLeave={() => {
                            const timeout = setTimeout(() => setHoveredDoctor(null), 300); // Short delay before hiding
                            setHideTimeout(timeout);
                        }}
                        className="relative"
                        style={{width: 'max-content'}}
                    >
                        <SelectItem value={doctor.name}>
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
                    </div>
                ))}
            </CustomFormField>

            {/* Tooltip - Stays visible when hovered */}
            {hoveredDoctor && (
                <div
                    className="fixed bg-white shadow-lg border border-gray-300 p-2 rounded-md z-50 w-48 pointer-events-auto"
                    style={{ top: tooltipPosition.y, left: tooltipPosition.x, zIndex: 1000 }}
                    onMouseEnter={() => {
                        if (hideTimeout) clearTimeout(hideTimeout); // Prevent hiding when hovering over the tooltip
                    }}
                    onMouseLeave={() => setHoveredDoctor(null)} // Hide when leaving the tooltip
                >
                    <p className="text-sm font-medium text-black">{hoveredDoctor.name}</p>
                    <a
                        href={hoveredDoctor.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline text-xs"
                    >
                        View Profile
                    </a>
                </div>
            )}
        </div>

                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="insuranceProvider"
                        label="Insurance provider"
                        placeholder="ex: Nigeria Health Insurance"
                    />

                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="insurancePolicyNumber"
                        label="Insurance policy number"
                        placeholder="ex: NHIP-NG-2024-00123456"
                    />
                </div>

                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control}
                        name="allergies"
                        label="Allergies (if any)"
                        placeholder="ex: Peanuts, Penicillin, Pollen"
                    />

                    <CustomFormField
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control}
                        name="currentMedication"
                        label="Current medication (if any)"
                        placeholder="ex: Ibuprofen 200mg, Paracetamol 500mg"
                    />
                </div>

                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control}
                        name="familyMedicalHistory"
                        label="Family medical history"
                        placeholder="ex: Mother had Diabetes, Father had Hypertension"
                    />

                    <CustomFormField
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control}
                        name="pastMedicalHistory"
                        label="Past medical history"
                        placeholder="ex: Appendectomy, Tonsillectomy"
                    />
                </div>

                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Identification and Verification</h2>
                    </div>
                </section>

                <CustomFormField
                    fieldType={FormFieldType.SELECT}
                    control={form.control}
                    name="identificationType"
                    label="Identification type"
                    placeholder={identificationType!=""?identificationType: "Select an identification type"}
                >
                    {IdentificationTypes.map((type) => (
                        <SelectItem
                            key={type}
                            value={type}
                        >
                            {type}
                        </SelectItem>
                    ))}
                </CustomFormField>

                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="identificationNumber"
                    label="Identification number"
                    placeholder="ex: 1234567890"
                />

                <CustomFormField
                    fieldType={FormFieldType.SKELETON}
                    control={form.control}
                    name="identificationDocument"
                    label="Scanned copy of identification document"
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
                          ):  <FormControl>
                            <FileUploader
                                files={field.value}
                                onChange={field.onChange}
                            />
                        </FormControl>
                    )}
                />

                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Consent and Privacy</h2>
                    </div>
                </section>

                <CustomFormField
                    fieldType={FormFieldType.CHECKBOX}
                    control={form.control}
                    name="treatmentConsent"
                    label="I consent to receive treatment for my health condition."
                />

                <CustomFormField
                    fieldType={FormFieldType.CHECKBOX}
                    control={form.control}
                    name="disclosureConsent"
                    label="I consent to the use of my health information for treatment."
                />

                <CustomFormField
                    fieldType={FormFieldType.CHECKBOX}
                    control={form.control}
                    name="privacyConsent"
                    label="I acknowledge that I have reviewed and agree to the privacy policy."
                />

                <SubmitButton
                    isLoading={isLoading}
                >
                    Get Started
                </SubmitButton>
            </form>

            <ToastContainer />

        </Form>
    )
}

export default RegisterForm