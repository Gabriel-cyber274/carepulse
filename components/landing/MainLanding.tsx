"use client"
import React, { useEffect, useState } from 'react'
import Image from "next/image";
import Link from "next/link";
import { DoctorType } from '@/types/appwrite.types';
import { ID, Query } from "appwrite";
import {databases, DATABASE_ID, PATIENT_COLLECTION_ID, BUCKET_ID, storage, ENDPOINT, PROJECT_ID, DOCTOR_COLLECTION_ID, API_KEY} from '../../lib/appwriteConfig2'
import { toast, ToastContainer } from 'react-toastify';
import {getDoctorLanding} from '../../lib/actions/apis';



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
    const [scrolled, setScrolled] = useState(false);


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

            // let response = await databases.listDocuments(
            //     DATABASE_ID,
            //     DOCTOR_COLLECTION_ID,
            //     [Query.isNotNull("image")]
            // );

            let response = await getDoctorLanding();

            
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
    

    useEffect(() => {
      const handleScroll = () => {
        if (window.scrollY > 50) {
          setScrolled(true);
        } else {
          setScrolled(false);
        }
      };
  
      window.addEventListener("scroll", handleScroll);
      
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, []);
    
      

    
  return (
    <div className='land_cont'>
            <nav className={scrolled ? "scrolled" : ""}>
                <div className="cont">
                    <div className="logo">
                        <img src="/assets/images/Logomark.png" alt="" />
                        <h2>ViePulse</h2>
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
        <div className="first_sec" id='home'>
            
            <div className="main_first">
                <div className="cont">
                    <div className="first">
                        <h1>Digital way to
                        take medical
                        services.</h1>
                        <p>We help you to start get best medical service &
                        make your life more easier.</p>
                        <Link href='/patient'>
                            <button style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                Book an Appointment <svg className='ms-2' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M15.2375 16.0798C15.127 16.1828 15.0383 16.307 14.9769 16.445C14.9154 16.583 14.8823 16.732 14.8796 16.8831C14.877 17.0341 14.9048 17.1842 14.9613 17.3242C15.0179 17.4643 15.1021 17.5916 15.209 17.6984C15.3158 17.8052 15.443 17.8894 15.5831 17.946C15.7232 18.0026 15.8733 18.0304 16.0243 18.0277C16.1754 18.0251 16.3243 17.992 16.4623 17.9305C16.6003 17.869 16.7245 17.7804 16.8275 17.6698L21.704 12.7948L22.499 11.9998L21.704 11.2048L16.829 6.32985C16.6169 6.12482 16.3328 6.01129 16.0378 6.01371C15.7429 6.01613 15.4606 6.13431 15.252 6.3428C15.0433 6.55129 14.9248 6.8334 14.9221 7.12837C14.9194 7.42334 15.0327 7.70757 15.2375 7.91985L18.1925 10.8748L2.62402 10.8748C2.32565 10.8748 2.03951 10.9934 1.82853 11.2043C1.61755 11.4153 1.49902 11.7015 1.49902 11.9998C1.49902 12.2982 1.61755 12.5844 1.82853 12.7953C2.03951 13.0063 2.32565 13.1248 2.62402 13.1248L18.1925 13.1248L15.2375 16.0798Z" fill="#122955"/>
                                </svg>
                            </button>
                        </Link>
                    </div>
                    <div className="second">
                        {/* <img src="/assets/images/firstland.jpg" alt="" /> */}
                        <img src="/assets/images/first1.png" alt="" />
                        <div className="discount">
                            <svg width="63" height="64" viewBox="0 0 63 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="0.232422" y="0.739746" width="62.4931" height="62.4931" rx="6.24658" fill="#D8FFF3"/>
                            <path d="M25.2305 38.2354L37.7305 25.7354" stroke="#00CE9C" stroke-width="4.16667" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M26.2721 27.8187C26.8474 27.8187 27.3138 27.3523 27.3138 26.777C27.3138 26.2017 26.8474 25.7354 26.2721 25.7354C25.6968 25.7354 25.2305 26.2017 25.2305 26.777C25.2305 27.3523 25.6968 27.8187 26.2721 27.8187Z" fill="#00CE9C" stroke="#00CE9C" stroke-width="4.16667" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M36.6891 38.2352C37.2644 38.2352 37.7308 37.7688 37.7308 37.1935C37.7308 36.6182 37.2644 36.1519 36.6891 36.1519C36.1138 36.1519 35.6475 36.6182 35.6475 37.1935C35.6475 37.7688 36.1138 38.2352 36.6891 38.2352Z" fill="#00CE9C" stroke="#00CE9C" stroke-width="4.16667" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M12.7305 31.9854C12.7305 34.4476 13.2155 36.8858 14.1577 39.1607C15.1 41.4355 16.4811 43.5025 18.2222 45.2436C19.9633 46.9847 22.0303 48.3658 24.3052 49.3081C26.58 50.2504 29.0182 50.7354 31.4805 50.7354C33.9428 50.7354 36.3809 50.2504 38.6558 49.3081C40.9306 48.3658 42.9976 46.9847 44.7387 45.2436C46.4798 43.5025 47.8609 41.4355 48.8032 39.1607C49.7455 36.8858 50.2305 34.4476 50.2305 31.9854C50.2305 29.5231 49.7455 27.0849 48.8032 24.81C47.8609 22.5352 46.4798 20.4682 44.7387 18.7271C42.9976 16.986 40.9306 15.6049 38.6558 14.6626C36.3809 13.7203 33.9428 13.2354 31.4805 13.2354C29.0182 13.2354 26.58 13.7203 24.3052 14.6626C22.0303 15.6049 19.9633 16.986 18.2222 18.7271C16.4811 20.4682 15.1 22.5352 14.1577 24.81C13.2155 27.0849 12.7305 29.5231 12.7305 31.9854Z" stroke="#00CE9C" stroke-width="4.16667" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>

                            <h2 className='mt-2'>Get the Discount 30% for the first time </h2>
                        </div>
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
                        <button onClick={filterDoctor} disabled={isLoading}>
                            {isLoading ? "Searching..." : "Find Doctor"}
                        </button>
                    </div>
                    {filteredDoc.length >0 && <div className="search_result_doc mt-5">
                        {filteredDoc.map((doc, index)=> (
                            <a key={index} href={doc.linkedin} target='_blank'>{doc.name}</a>
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
                                <h3>&quot;Our goal is to provide you with the necessary resources
                                and advice to turn my business idea&quot;</h3>
                                <h4>Dr. Carter</h4>
                            </div>
                        </div>
                        <Link href='/patient'><button>Book an Appointment</button></Link>
                    </div>
                    <div className="second">
                        {/* <img src="/assets/images/third_sec.jpg" alt="" /> */}
                        <img src="/assets/images/first2.png" alt="" />

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
                                <div className="box me-3" key={index}>
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
                        <h2>ViePulse</h2>
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
                        <a href="/assets/images/viepulse D.pdf" target="_blank" style={{textDecoration: 'none'}}>
                            <h2 className='mb-3'>Doctors Privacy Policy</h2>
                        </a>
                        <a href="/assets/images/viepulse.pdf" target="_blank" style={{textDecoration: 'none'}}>
                            <h2 className='mb-3'>Patient Privacy Policy</h2>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <div className="copy">
            <h1>All Rights Reserved ®ViePulse 2025</h1>
            <h1 className='mt-2'>powered by Amsley Technlogy</h1>
        </div>
        <ToastContainer />
    </div>
  )
}

export default MainLanding
