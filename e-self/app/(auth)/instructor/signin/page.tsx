// // app/(auth)/instructor/signin/page.tsx
// 'use client';

// import { useRouter } from 'next/navigation';
// import { useAuth } from '../../../context/AuthContext'; // Adjust the path as needed
// import AuthForm from '@/components/AuthForm'; // Adjust the path as needed

// const InstructorSignIn = () => {
//   const router = useRouter();
//   const { login } = useAuth();

//   const handleSignIn = (email: string, password: string) => {
//     // Add your actual sign-in logic here (e.g., API call)
//     // For now, keeping the placeholder logic
//     if (email && password) {
//       login(email, 'instructor'); // Assuming login handles the role
//       router.push('/dashboard'); // Redirect to instructor dashboard
//     } else {
//       alert('Please enter email and password.');
//     }
//   };

//   return (
//     <AuthForm
//       title="Instructor Sign In"
//       buttonText="Sign In"
//       linkHref="/instructor/signup"
//       linkText="Sign Up"
//       linkPrompt="Don't have an account?"
//       onSubmit={handleSignIn}
//     />
//   );
// };

// export default InstructorSignIn;



// app/(auth)/instructor/signin/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import AuthForm from '@/components/AuthForm';

const InstructorSignIn = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (email: string, password: string) => {
    try {
      setError(null); // Clear previous errors

      // Validate inputs
      if (!email || !password) {
        throw new Error('Please enter both email and password.');
      }

      // Make API call to backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailOrPhone: email, password }),
      });

      // Handle response
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      const { accessToken, refreshToken } = data;

      // Call login from AuthContext with tokens
      login(email, 'INSTRUCTOR', accessToken, refreshToken);

      // Navigate to instructor dashboard
      router.push('/instructor/dashboard');
    } catch (error: any) {
      setError(error.message || 'An error occurred during login');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted">
      <div className="w-full max-w-md p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        <AuthForm
          title="Instructor Sign In"
          buttonText="Sign In"
          linkHref="/instructor/signup"
          linkText="Sign Up"
          linkPrompt="Don't have an account?"
          isSignUp={false}
          onSubmit={handleSignIn}
        />
      </div>
    </div>
  );
};

export default InstructorSignIn;


