// app/(auth)/student/signin/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext'; // Adjust the path as needed
import AuthForm from '@/components/AuthForm'; // Adjust the path as needed

const StudentSignIn = () => {
  const router = useRouter();
  const { login } = useAuth();

  const handleSignIn = (email: string, password: string) => {
    // Add your actual sign-in logic here (e.g., API call)
    // For now, keeping the placeholder logic
    if (email && password) {
      login(email, 'student'); // Assuming login handles the role
      router.push('/'); // Redirect to student home/dashboard
    } else {
      alert('Please enter email and password.');
    }
  };

  return (
    <AuthForm
      title="Student Sign In"
      buttonText="Sign In"
      linkHref="/student/signup"
      linkText="Sign Up"
      linkPrompt="Don't have an account?"
      onSubmit={handleSignIn}
    />
  );
};

export default StudentSignIn;