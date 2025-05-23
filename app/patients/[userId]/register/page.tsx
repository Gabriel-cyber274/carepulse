import Image from "next/image"

import RegisterForm from "@/components/forms/RegisterForm"
import { getUser } from "@/lib/actions/patient.actions"
import Link from "next/link";

const Register = async ({ params: { userId } }: SearchParamProps) => {
    const user = await getUser(userId);

    return (
        <div className="flex h-screen max-h-screen">
            <section className="remove-scrollbar container">
                <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
                <Link href={'/'}>
                    {/* <Image
                        src="/assets/icons/logo-full.png"
                        alt="CarePulse Logo"
                        height={1000}
                        width={1000}
                        className="mb-12 h-10 w-fit"
                    /> */}
                        <div className="logo flex items-center mb-4">
                            {/* <img src="/assets/images/Logomark.png" alt="" /> */}
                            <img className='me-2' src="/LOGO.svg" width="38" height="38" alt="" />
                            <h2 className="ms-2">ViePulse</h2>
                        </div>
                    </Link>

                    <RegisterForm user={user} />

                    <p className="copyright py-12">
                        © 2024 ViePulse.
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