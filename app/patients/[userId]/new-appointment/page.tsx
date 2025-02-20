import AppointmentForm from "@/components/forms/AppointmentForm";
import { getPatient } from "@/lib/actions/patient.actions";
import Image from "next/image";
import Link from "next/link";


export default async function NewAppointment({ params: { userId } }: SearchParamProps) {
    // const patient = await getPatient(userId);

    // if (!patient || !patient.id) {
    //     return (
    //         <div className="flex h-screen items-center justify-center">
    //             <p className="text-lg text-red-300">
    //                 Patient data could not be retrieved. Please try again later.
    //             </p>
    //         </div>
    //     );
    // }

    // console.log(patient, 'hello boss');

    // useEffect(()=> {
    //     console.log(patient, 'hello boss')
    // }, [])

    return (
        <div className="flex h-screen max-h-screen">
            <section className="remove-scrollbar container my-auto">
                <div className="sub-container max-w-[860px] flex-1 justify-between">
                <Link href={'/'}>
                    <Image
                        src="/assets/icons/logo-full.png"
                        alt="CarePulse Logo"
                        height={1000}
                        width={1000}
                        className="mb-12 h-10 w-fit"
                    />
                    </Link>

                    <AppointmentForm
                        type="create"
                        userId={userId}
                        patientId="kskkddd"
                    />

                    <p className="copyright mt-10 py-12">
                        © 2024 HeliCare.
                    </p>

                </div>
            </section>

            <Image
                src="/assets/images/appointment-img.png"
                height={1000}
                width={1000}
                alt="Appointment Image"
                className="side-img max-w-[390px] bg-bottom"
            />
        </div>
    );
}
