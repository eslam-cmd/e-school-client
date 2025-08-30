import TeacherLoginPage from "@/components/auth/login-tetcher/login";
export const metadata = {
    title: "Login for the teacher",
    description: "An integrated educational platform for managing students and lessons.",
    openGraph: {
      title: "E-School | Control Panel",
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
export default function login(){
    return(
        <>
        <TeacherLoginPage/>
        </>
    );
}