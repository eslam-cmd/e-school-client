
import StudentLoginPage from "@/components/auth/login-student/Login";
export const metadata = {
  title: " Login",
  description: "Student Login",
  openGraph: {
    title: "E-School | Login",
    description: "An integrated educational platform for managing students and lessons.",
    url: "https://e-school-client.vercel.app",
    siteName: "E-School",
    images: [
      {
        url: "logo2.jpg",
        width: 1200,
        height: 630,
        alt: "E-School Dashboard"
      }
    ],
    locale: "ar_AR",
    type: "website"
  }
};
export default function Login() {
  return (
  <>
  <StudentLoginPage />
  </>) ;
}
