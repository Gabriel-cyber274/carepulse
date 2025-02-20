import Image from "next/image"

import RegisterForm from "@/components/forms/RegisterForm"
import { getUser } from "@/lib/actions/patient.actions"
import DoctorForm from "@/components/forms/DoctorForm";
import Link from "next/link";

const Register = async ({ params: { userId } }: SearchParamProps) => {
    const user = await getUser(userId);


    return (
        <div className="flex h-screen max-h-screen">
            <section className="remove-scrollbar container">
                <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
                    <Link href={'/doctor'}>
                        <Image
                            src="/assets/icons/logo-full.png"
                            alt="CarePulse Logo"
                            height={1000}
                            width={1000}
                            className="mb-12 h-10 w-fit"
                        />
                
                    </Link>

                    <DoctorForm user={user} />

                    <p className="copyright py-12">
                        © 2024 HeliCare.
                    </p>
                </div>
            </section>

            <Image
                src="/assets/images/register-img.png"
                height={1000}
                width={1000}
                alt="Onboarding Image"
                className="side-img max-w-[390px]"
            />
        </div>
    )
}

export default Register