// // app/(auth)/instructor/signup/page.tsx
// 'use client';

// import { useRouter } from 'next/navigation';
// import { useAuth } from '../../../context/AuthContext'; // Adjust the path as needed
// import AuthForm from '@/components/AuthForm'; // Adjust the path as needed

// const InstructorSignUp = () => {
//   const router = useRouter();
//   const { login } = useAuth();

//   const handleSignUp = (email: string, password: string, confirmPassword?: string) => {
//     if (password !== confirmPassword) {
//       alert('Passwords do not match!');
//       return;
//     }

//     // Add your actual sign-up logic here (e.g., API call to create user)
//     // For now, keeping the placeholder logic
//     login(email, 'instructor'); // Assuming login handles the role and perhaps calls your signup API internally
//     router.push('/dashboard'); // Redirect after successful signup
//   };

//   return (
//     <AuthForm
//       title="Instructor Sign Up"
//       buttonText="Sign Up"
//       linkHref="/instructor/signin"
//       linkText="Log In"
//       linkPrompt="Already have an account?"
//       isSignUp={true}
//       onSubmit={handleSignUp}
//     />
//   );
// };

// export default InstructorSignUp;



'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext'; // Adjust the path as needed
import AuthForm from '@/components/AuthForm'; // Adjust the path as needed

const InstructorSignUp = () => {
  const router = useRouter();
  const { login } = useAuth();

  const handleSignUp = async (
    email: string,
    password: string,
    confirmPassword?: string,
    name?: string,
    phone?: string,
    language?: string
  ) => {
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (!name) {
      alert('Name is required!');
      return;
    }

    try {
      // Prepare the payload matching the RegisterDto
      const payload = {
        email,
        password,
        role: 'INSTRUCTOR', // Fixed to INSTRUCTOR for this component
        name,
        ...(phone && { phone }), // Include phone only if provided
        ...(language && { language }), // Include language only if provided
      };

      // Make API call to the NestJS backend
      const response = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Sign-up failed');
      }

      const data = await response.json();
      // Assuming the backend returns a token and user info
      const { accessToken, user } = data;

      // Update AuthContext with the user data and token
      login(user.email, 'INSTRUCTOR', accessToken, user.refreshToken);

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error: any) {
      alert(error.message || 'An error occurred during sign-up');
    }
  };

  return (
    <AuthForm
      title="Instructor Sign Up"
      buttonText="Sign Up"
      linkHref="/instructor/signin"
      linkText="Log In"
      linkPrompt="Already have an account?"
      isSignUp={true}
      onSubmit={handleSignUp}
    />
  );
};

export default InstructorSignUp;