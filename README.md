# CarePulse

## About
This repository contains a patient management system designed for hospitals in Enugu State. CarePulse streamlines patient registration, appointment scheduling, and medical records while implementing complex forms and SMS notifications.

## Tech Stack
- **Next.js**
- **Appwrite**
- **Typescript**
- **TailwindCSS**
- **ShadCN**
- **Twilio**

## Features
- **Register as a Patient:** Users can sign up and create a personal profile as a patient.
- **Book a New Appointment with Doctor:** Patients can schedule appointments with doctors at their convenience and can book multiple appointments.
- **Manage Appointments on Admin Side:** Administrators can efficiently view and handle all scheduled appointments.
- **Confirm/Schedule Appointment from Admin Side:** Admins can confirm and set appointment times to ensure they are properly scheduled.
- **Cancel Appointment from Admin Side:** Administrators have the ability to cancel any appointment as needed.
- **Send SMS on Appointment Confirmation:** Patients receive SMS notifications to confirm their appointment details.
- **Complete Responsiveness:** The application works seamlessly on all device types and screen sizes.
- **File Upload Using Appwrite Storage:** Users can upload and store files securely within the app using Appwrite storage services.
- **Manage and Track Application Performance Using Sentry:** The application uses Sentry to monitor and track its performance and detect any errors.
- **Code Architecture and Reusability:** The application is built with a focus on modular architecture and reusability of components.

## Getting Started
To get a local copy up and running follow these simple steps.

### Prerequisites
- [Node.js](https://nodejs.org/) (version 14 or higher)
- [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/get-npm)

### Installation
1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/CarePulse.git
   ```
2. Navigate to the project directory
   ```bash
   cd CarePulse
   ```
3. Install the dependencies
   ```bash
   npm install
   # or
   yarn install
   ```
4. Set up your environment variables (refer to `.env.example` for required variables)
5. Run the application
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments
- Thanks to the contributors and communities that helped shape this project.
