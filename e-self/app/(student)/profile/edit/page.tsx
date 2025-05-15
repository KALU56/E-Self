// app/profile/edit/page.tsx
'use client';
import { useAuth } from '../../../context/AuthContext';
import { useState } from 'react';
// Import the Image component for optimized images
import Image from 'next/image';


export default function ProfileEdit() {
    const { user, updateUser } = useAuth();
    const [username, setUsername] = useState(user?.username || '');
    // profileImage holds the data URL or the default image path for display
    const [profileImage, setProfileImage] = useState(user?.profileImage || '/default-profile.png');
    // Removed the unused 'selectedImage' state variable
    // const [selectedImage, setSelectedImage] = useState<File | null>(null);


    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Removed the unused setSelectedImage(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                // Set the profileImage state with the data URL for preview
                setProfileImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
            // NOTE: In a real application, you would typically also store the 'file' object
            // to upload it to your backend storage (e.g., S3, Cloudinary) when the user saves.
            // For this example, we are only updating the display URL.
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Add actual API call here to send username and the new profile image (if selected)
        // If you need to send the actual file, you'd use the 'selectedImage' state (if you kept it)
        // or the 'file' object from handleImageUpload and send it in a FormData object.
        // For this simplified example, we are just passing the display URL.
        updateUser({ username, profileImage });
        alert('Profile updated (client-side state only)'); // Placeholder confirmation
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-[#1D1616]">Edit Profile</h2>
            <form onSubmit={handleSubmit}>
                {/* Container for the profile image and upload button */}
                {/* FIX: Ensure parent div has relative positioning for Image fill */}
                <div className="mb-6 relative w-32 h-32 mx-auto rounded-full overflow-hidden">
                    {/* FIX: Replace <img> with Next.js <Image> component */}
                    <Image
                        src={profileImage} // Can be a data URL or a public path
                        alt="Profile"
                        fill // Makes the image fill the parent container
                        style={{ objectFit: 'cover' }} // Replicates object-cover behavior
                        sizes="100vw" // Basic size hint for optimization
                        // Note: rounded-full applied to parent div handles the shape
                    />
                    {/* Upload button overlay */}
                    <label className="absolute bottom-0 right-0 bg-[#8E1616] p-2 rounded-full cursor-pointer z-10"> {/* Added z-10 to ensure it's above the image */}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                        </svg>
                    </label>
                </div>

                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium mb-2 text-gray-700">Username</label>
                    <input
                        id="username" // Added id for label association
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8E1616] focus:border-[#8E1616] text-[#1D1616]" // Added focus styles and text color
                    />
                </div>

                {/* Add other profile fields like bio, etc. if needed */}

                <button
                    type="submit"
                    className="w-full bg-[#8E1616] text-white p-2 rounded-md hover:bg-[#D84040] transition-all focus:outline-none focus:ring-2 focus:ring-[#8E1616] focus:ring-opacity-50" // Added focus styles
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
}