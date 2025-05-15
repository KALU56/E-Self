// // components/AuthForm.tsx
// 'use client';

// import { Card, CardContent } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Button } from '@/components/ui/button';
// import Link from 'next/link';
// import { useState } from 'react';

// interface AuthFormProps {
//   title: string;
//   buttonText: string;
//   linkHref: string;
//   linkText: string;
//   linkPrompt: string;
//   isSignUp?: boolean; // Flag to indicate if it's a sign-up form
//   onSubmit: (email: string, password: string, confirmPassword?: string) => void;
// }

// const AuthForm: React.FC<AuthFormProps> = ({
//   title,
//   buttonText,
//   linkHref,
//   linkText,
//   linkPrompt,
//   isSignUp = false,
//   onSubmit,
// }) => {
//   const [email, setEmail] = useState('');
//   const [name, setName] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSubmit(email, password, isSignUp ? confirmPassword : undefined);
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-muted">
//       <Card className="w-full max-w-md p-6 shadow-lg">
//         <CardContent>
//           <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 placeholder="Enter your email"
//               />
//             </div>
//             <div>
//               <Label htmlFor="name">Name</Label>
//               <Input
//                 id="name"
//                 type="name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 required
//                 placeholder="Enter your name"
//               />
//             </div>
//             <div>
//               <Label htmlFor="password">Password</Label>
//               <Input
//                 id="password"
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 placeholder={isSignUp ? 'Enter password' : 'Enter your password'}
//               />
//             </div>
//             {isSignUp && (
//               <div>
//                 <Label htmlFor="confirmPassword">Confirm Password</Label>
//                 <Input
//                   id="confirmPassword"
//                   type="password"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   required
//                   placeholder="Confirm your password"
//                 />
//               </div>
//             )}
//             <Button type="submit" className="w-full bg-[#8E1616] hover:bg-[#7a1212] text-white">
//             {buttonText}
//           </Button>

//           </form>
//           <p className="mt-4 text-center text-sm">
//             {linkPrompt}{' '}
//             <Link href={linkHref} className="text-primary hover:underline">
//               {linkText}
//             </Link>
//           </p>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default AuthForm;





'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState } from 'react';

interface AuthFormProps {
  title: string;
  buttonText: string;
  linkHref: string;
  linkText: string;
  linkPrompt: string;
  isSignUp?: boolean;
  includeName?: boolean;
  includePhone?: boolean;
  includeLanguage?: boolean;
  onSubmit: (
    email: string,
    password: string,
    confirmPassword?: string,
    name?: string,
    phone?: string,
    language?: string
  ) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({
  title,
  buttonText,
  linkHref,
  linkText,
  linkPrompt,
  isSignUp = false,
  includeName = true,
  includePhone = true,
  includeLanguage = true,
  onSubmit,
}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [language, setLanguage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(
      email,
      password,
      isSignUp ? confirmPassword : undefined,
      includeName ? name : undefined,
      includePhone ? phone : undefined,
      includeLanguage ? language : undefined
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <CardContent>
          <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>
            {includeName && (
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text" // Fixed from type="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter your name"
                />
              </div>
            )}
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6} // Align with RegisterDto
                placeholder={isSignUp ? 'Enter password' : 'Enter your password'}
              />
            </div>
            {isSignUp && (
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6} // Align with RegisterDto
                  placeholder="Confirm your password"
                />
              </div>
            )}
            {includePhone && (
              <div>
                <Label htmlFor="phone">Phone (e.g., +251941416514)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+251941416514"
                  pattern="^\+251[79]\d{8}$" // Align with RegisterDto
                />
              </div>
            )}
            {includeLanguage && (
              <div>
                <Label htmlFor="language">Language</Label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Language</option>
                  <option value="en">English</option>
                  <option value="am">Amharic</option>
                </select>
              </div>
            )}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white"
            >
              {buttonText}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm">
            {linkPrompt}{' '}
            <Link href={linkHref} className="text-primary hover:underline">
              {linkText}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;