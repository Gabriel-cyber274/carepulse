"use client"
import React, { useEffect, useState } from 'react'
import Image from "next/image";
import Link from "next/link";
import { DoctorType } from '@/types/appwrite.types';
import { ID, Query } from "appwrite";
import {databases, DATABASE_ID, PATIENT_COLLECTION_ID, BUCKET_ID, storage, ENDPOINT, PROJECT_ID, DOCTOR_COLLECTION_ID, API_KEY} from '../../lib/appwriteConfig2'
import { toast, ToastContainer } from 'react-toastify';



function MainLanding() {
    const areasOfSpecialization = [
        { name: "Cardiology", description: "Specializes in heart and cardiovascular system disorders." },
        { name: "Dermatology", description: "Focuses on skin, hair, and nail conditions." },
        { name: "Neurology", description: "Deals with disorders of the nervous system, including the brain and spinal cord." },
        { name: "Pediatrics", description: "Provides medical care for infants, children, and adolescents." },
        { name: "Oncology", description: "Specializes in the diagnosis and treatment of cancer." },
        { name: "Orthopedics", description: "Focuses on the musculoskeletal system, including bones and joints." },
        { name: "Gastroenterology", description: "Deals with digestive system disorders, including the stomach and intestines." },
        { name: "Psychiatry", description: "Treats mental health conditions such as depression, anxiety, and schizophrenia." },
        { name: "Urology", description: "Focuses on urinary tract and male reproductive system disorders." },
        { name: "Nephrology", description: "Specializes in kidney function and diseases." },
        { name: "Ophthalmology", description: "Deals with eye diseases, vision care, and surgery." },
        { name: "Pulmonology", description: "Focuses on lung and respiratory system disorders." },
        { name: "Endocrinology", description: "Specializes in hormone-related conditions, including diabetes and thyroid disorders." },
        { name: "Hematology", description: "Deals with blood disorders, including anemia and leukemia." },
        { name: "Rheumatology", description: "Focuses on autoimmune diseases and joint disorders such as arthritis." },
        { name: "Obstetrics and Gynecology", description: "Cares for women's reproductive health, pregnancy, and childbirth." },
        { name: "Plastic Surgery", description: "Performs reconstructive and cosmetic surgeries." },
        { name: "Anesthesiology", description: "Manages pain and anesthesia for surgeries and procedures." },
        { name: "Pathology", description: "Studies diseases through laboratory analysis of tissues and fluids." },
        { name: "Radiology", description: "Uses imaging techniques like X-rays and MRIs for diagnosis." },
        { name: "General Surgery", description: "Performs a wide range of surgical procedures on various body systems." },
        { name: "Emergency Medicine", description: "Provides immediate care for acute injuries and medical emergencies." },
        { name: "Infectious Disease", description: "Specializes in diagnosing and treating infections caused by bacteria, viruses, and fungi." },
        { name: "Sports Medicine", description: "Focuses on treating and preventing sports-related injuries." },
        { name: "Geriatrics", description: "Cares for elderly patients and age-related conditions." },
        { name: "Family Medicine", description: "Provides comprehensive healthcare for individuals and families across all ages." }
      ];
      

      
    const [doctorsInfo, setDoctorsInfo] = useState<DoctorType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [location, setLocation] = useState('');
    const [docSpecialization, setDocSpecialization] = useState('');
    const [filteredDoc, setFilterDoc] = useState<DoctorType[]>([]);

    const toaster = (message:string, type:string) => {
        if(type == 'err') {
          toast.error(message)
        }else {
          toast.success(message);
        }
      };

      useEffect(()=> {
        getDoctors();
      }, [])

      const getDoctors = async()=> {
        try {
            setIsLoading(true);

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
            setIsLoading(false);

    
            // Set the state with the transformed data
            setDoctorsInfo(doctors2);
            console.log(response.documents, 'active')
        } catch (error) {
            toaster(JSON.stringify(error), 'err');

            setIsLoading(false);
            console.error(error);
        }
    }

    const filterDoctor = () => {
        if (!location && !docSpecialization) {
            toaster("Please provide either location or specialization", "err");
            return;
        }
    
        // Filter doctors based on provided criteria
        const filteredResults = doctorsInfo.filter((doctor) => {
            const matchesLocation = location
                ? doctor.hospital_location.toLowerCase().includes(location.toLowerCase())
                : true;
    
            const matchesSpecialization = docSpecialization
                ? doctor.area_of_specialization.toLowerCase() === docSpecialization.toLowerCase()
                : true;
    
            return matchesLocation && matchesSpecialization;
        });
    
        // Update the state with filtered doctors
        setFilterDoc(filteredResults);
    };
    
    
      

    
  return (
    <div className='land_cont'>
        <div className="first_sec" id='home'>
            <nav>
                <div className="cont">
                    <div className="logo">
                        <img src="/assets/images/Logomark.png" alt="" />
                        <h2>HeliCare</h2>
                    </div>
                    <div className="links">
                        <a href="#home" style={{textDecoration: 'none'}}>
                            <h3>Home</h3>
                        </a>
                        <a href="#doctor" style={{textDecoration: 'none'}}>
                            <h3>Doctors</h3>
                        </a>
                        <a href="#medical" style={{textDecoration: 'none'}}>
                            <h3>Medical Services</h3>
                        </a>
                    </div>
                    
                    <a href="tel:+6285755500817" style={{ textDecoration: "none" }} className="number">
                        <img src="/assets/images/phone.png" alt="" />
                        <h4>+6285755500817</h4>
                    </a>
                </div>
            </nav>
            
            <div className="main_first">
                <div className="cont">
                    <div className="first">
                        <h1>Digital way to
                        take medical
                        services.</h1>
                        <p>We help you to start get best medical service &
                        make your life more easier.</p>
                        <Link href='/patient'>
                            <button>
                                Book an Appointment
                            </button>
                        </Link>
                    </div>
                    <div className="second">
                        <img src="/assets/images/firstland.jpg" alt="" />
                    </div>

                </div>
            </div>
        </div>
        <div className="second_sec" id='doctor'>
            <div className="cont">
                <div className="doctor_search_cont">
                    <h1>Search Doctor</h1>
                    <p>With more than 100+ specialist and Primary Care</p>
                    <div className="fields">
                        <div className="field">
                            <input type="text" value={location} name="" onChange={(e)=> setLocation(e.target.value)} placeholder='Location' />
                        </div>
                        <div className="field mx-2">
                            <select name="" id="" value={docSpecialization} onChange={(e)=> setDocSpecialization(e.target.value)}>
                                <option value="" selected disabled>Type of Specialist</option>
                                {areasOfSpecialization.map((area, index)=> (
                                    <option key={index} value={area.name}>{area.name}</option>
                                ))}
                            </select>
                        </div>
                        <button onClick={()=> { !isLoading && filterDoctor()}}>Find Doctor</button>
                    </div>
                    {filteredDoc.length >0 && <div className="search_result_doc mt-5">
                        {filteredDoc.map((doc, index)=> (
                            <a href={doc.linkedin} target='_blank'>{doc.name}</a>
                        ))}
                    </div>}
                </div>
                <div className="main_second">
                    <div className="first">
                        <h2>ABOUT US</h2>
                        <h1>Our caring doctors are
                        here for you</h1>
                        <p>Compassionate, experienced, and dedicated—our doctors are committed to your health and well-being. Whether it’s routine check-ups or specialized treatments, we ensure you receive the best care possible.</p>
                        <div className="doctor_message">
                            <img src="/assets/images/dr-peter.png" alt="" />
                            <div className="message ms-2">
                                <h3>"Our goal is to provide you with the necessary resources
                                and advice to turn my business idea"</h3>
                                <h4>Dr. Carter</h4>
                            </div>
                        </div>
                        <Link href='/patient'><button>Book an Appointment</button></Link>
                    </div>
                    <div className="second">
                        <img src="/assets/images/third_sec.jpg" alt="" />
                    

                    </div>
                </div>

            </div>
        </div>
        <div className="third_sec" id='medical'>
            <div className="cont">
                <div className="main_third">
                    <div className="first me-5">
                        <h2>SPECIALITES</h2>
                        <h1>Our wide range of
                        specialities</h1>
                        <p>We offer expert medical care across multiple disciplines, ensuring comprehensive treatment tailored to your needs. From primary care to advanced surgical procedures, our specialists are here to provide the best healthcare solutions.</p>
                        <button>Browse All Specialities</button>
                    </div>
                    <div className="overflow">
                        <div className="speacialization ms-5">
                            {areasOfSpecialization.map((area, index)=> (
                                <div className="box me-3">
                                    <img src="/assets/images/doc.png" alt="" />
                                    <h1 className='my-4'>{area.name}</h1>
                                    <p className='mb-3'>{area.description}</p>

                                    {/* <h3>Read More <img className='ms-2' src="/assets/images/right-arr.png" alt="" /></h3> */}
                                </div>

                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </div>
        <div className="fourth_sec">
            <div className="cont">
                <h2>BOOK NOW</h2>
                <h1>Book your medical appointment today</h1>
                <div className="buttons">
                    <a href="tel:+6285755500817" style={{ textDecoration: "none" }}>
                        <button className='first'>
                            <img className='me-3' src="/assets/images/phoneA.png" alt="" />
                            Book an appointment
                        </button>
                    </a>
                    <Link href='/patient'>
                        <button>
                            <img className='me-3' src="/assets/images/personA.png" alt="" />
                            Book an appointment
                        </button>
                    </Link>
                </div>
            </div>
        </div>
        <div className="fifth_sec">
            <div className="cont">
                <div className="first">
                    <div className="logo">
                        <img src="/assets/images/Logomark.png" alt="" />
                        <h2>HeliCare</h2>
                    </div>
                    <p>These are some customer testimonials
                    who are satisfied with the place and
                    service we have provided.</p>
                    <div className="socials">
                        <img src="/assets/images/facebook.png" alt="" />
                        <img src="/assets/images/insta.png" alt="" />
                        <img src="/assets/images/x.png" alt="" />
                        <img src="/assets/images/twitter.png" alt="" />
                    </div>
                </div>
                <div className="second">
                    <div className="links_main me-5">
                        <h1 className='mb-4'>Homepage</h1>
                        
                        <a href="#home" style={{textDecoration: 'none'}}>
                            <h2 className='mb-3'>Home</h2>
                        </a>
                        <a href="#doctor" style={{textDecoration: 'none'}}>
                            <h2 className='mb-3'>Doctors</h2>
                        </a>
                        <a href="#medical" style={{textDecoration: 'none'}}>
                            <h2 className='mb-3'>Medical Services</h2>
                        </a>
                        
                    </div>
                    <div className="links_main legal ms-5">
                        <h1 className='mb-4'>Legal</h1>
                        <a href="/assets/images/Privacy Policy for Doctors (1).pdf" target="_blank" style={{textDecoration: 'none'}}>
                            <h2 className='mb-3'>Doctors Privacy Policy</h2>
                        </a>
                        <a href="/assets/images/Privacy Policy for Patients.pdf" target="_blank" style={{textDecoration: 'none'}}>
                            <h2 className='mb-3'>Patient Privacy Policy</h2>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <div className="copy">
            <h1>All Rights Reserved ®Healthcare 2023</h1>
        </div>
        <ToastContainer />
    </div>
  )
}

export default MainLanding
