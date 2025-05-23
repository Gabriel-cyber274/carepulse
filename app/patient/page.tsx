import PatientForm from "@/components/forms/PatientForm";
import Image from "next/image";
import Link from "next/link";


export default function Home() {
  return (
    <div className="flex h-screen max-h-screen">
      {/* TODO: OTP Verification ~ Pass key modal */}

      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          {/* <Image
            // src="/assets/icons/logo-full.svg"
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

          <PatientForm type="patient" />

          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              © 2025 ViePulse.
            </p>
            {/* <Link href="/?admin=true" className="text-green-500">
              Admin
            </Link> */}
            {/* <Link href="/admin" className="text-green-500">
              Admin
            </Link> */}
          </div>
        </div>
      </section>

      <Image
        src="/assets/images/onboarding-img.png"
        height={1000}
        width={1000}
        alt="Onboarding Image"
        className="side-img max-w-[50%]"
      />
    </div>
  );
}
