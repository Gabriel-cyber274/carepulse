import * as sdk from "node-appwrite";

export const {
  PROJECT_ID,
  API_KEY,
  DATABASE_ID,
  PATIENT_COLLECTION_ID,
  DOCTOR_COLLECTION_ID,
  APPOINTMENT_COLLECTION_ID,
  NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
  NEXT_PUBLIC_ENDPOINT: ENDPOINT,
} = process.env;

const client = new sdk.Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("67266b3900309af63d56")
  .setKey(
    "standard_24590562538a843e9f1e6870993a036ab8c8a6f1b8982883580e1b368dc69ea539f62beb7efb27221a473c64a2844418a467858aa6cfbe320673c28c674fc60e11b9d5d2eb76ed82fb1fe7b9d334cd718035274aa785868c31823d9fc3a4b32fef57e5aed76047899f0cfa84d73de89de33cf70160bd5edc43b389d2dc911500"
  );

export const databases = new sdk.Databases(client);
export const storage = new sdk.Storage(client);
export const messaging = new sdk.Messaging(client);
export const users = new sdk.Users(client);
