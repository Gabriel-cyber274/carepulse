
declare namespace NodeJS {
    interface ProcessEnv {
      PROJECT_ID: string;
      API_KEY: string;
      DATABASE_ID: string;
      PATIENT_COLLECTION_ID: string;
      DOCTOR_COLLECTION_ID: string;
      APPOINTMENT_COLLECTION_ID: string;
      NEXT_PUBLIC_BUCKET_ID: string;
      NEXT_PUBLIC_ENDPOINT: string;
    }
  }
  