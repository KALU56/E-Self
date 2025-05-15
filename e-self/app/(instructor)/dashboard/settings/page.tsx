"use client";

import React, { useState } from 'react';
import Image from 'next/image'; // Import Image component

const InstructorSettingsPage: React.FC = () => {
    // State for demonstration (you'd manage actual data with hooks/state management)
    // Removed unused setters: setProfileName, setProfileBio, setBankInfo, setPaymentMethod
    const [profileName] = useState('John Doe'); // setProfileName removed
    const [profileBio] = useState('Experienced educator in web development and design.'); // setProfileBio removed
    const [email, setEmail] = useState('john.doe@example.com');
    const [phone, setPhone] = useState('+1 123 456 7890');
    const [teachingLanguage, setTeachingLanguage] = useState('English');
    const [preferredCategories, setPreferredCategories] = useState<string[]>(['Technology', 'Design']);
    const [enrollmentAlerts, setEnrollmentAlerts] = useState(true);
    const [studentMessages, setStudentMessages] = useState(true);
    const [paymentUpdates, setPaymentUpdates] = useState(false);
    const [bankInfo] = useState('**** **** **** 1234'); // setBankInfo removed
    const [paymentMethod] = useState('Bank Transfer'); // setPaymentMethod removed // or 'Telebirr'

    // Placeholder functions for actions
    const handleProfileEdit = () => {
        alert('Edit Profile clicked');
        // Implement profile editing logic (e.g., open a modal)
        // In a real app, editing the profile might use setProfileName and setProfileBio
    };

    const handleChangePassword = () => {
        alert('Change Password clicked');
        // Implement change password logic (e.g., open a modal)
    };

    const handleViewEarnings = () => {
        alert('View Earnings clicked');
        // Navigate to earnings page
    };

    const handleSave = () => {
        alert('Settings Saved!');
        // Implement save logic (e.g., API call to update settings)
        // This is where you would use the current state values (email, phone, etc.)
        // but still wouldn't necessarily need the setters if saving happens on button click
    };

    const handleCancel = () => {
        alert('Changes Cancelled!');
        // Implement cancel logic (e.g., reset form to initial state or navigate back)
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const options = Array.from(e.target.selectedOptions).map(option => option.value);
        setPreferredCategories(options);
    };

    return (
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 bg-[#EEEEEE] min-h-screen text-[#1D1616]">
            <h1 className="text-3xl font-bold text-[#1D1616] mb-8">Instructor Settings</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Sidebar (or top section on smaller screens) */}
                <div className="lg:col-span-1 space-y-8">

                    {/* Profile Info */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-[#1D1616] mb-4">Profile Info</h2>
                        <div className="flex items-center mb-4">
                            {/* Placeholder for Profile Picture */}
                            <div className="w-20 h-20 rounded-full mr-4 bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-600 overflow-hidden">
                                {/* Using Next/Image for potentially optimized images */}
                                {/* Replace with actual image source logic */}
                                <Image
                                    src="/placeholder-profile.png" // Use a placeholder or dynamic path
                                    alt="Profile"
                                    width={80}
                                    height={80}
                                    objectFit="cover"
                                />
                            </div>
                            <div>
                                <p className="text-lg font-medium text-[#1D1616]">{profileName}</p> {/* profileName is used */}
                                <p className="text-sm text-gray-600">{profileBio}</p> {/* profileBio is used */}
                            </div>
                        </div>
                        <button
                            onClick={handleProfileEdit}
                            className="px-4 py-2 bg-[#8E1616] text-white rounded-md hover:bg-[#D84040] focus:outline-none focus:ring-2 focus:ring-[#8E1616] focus:ring-opacity-50"
                        >
                            Edit Profile
                        </button>
                    </div>

                    {/* Payment & Earnings */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-[#1D1616] mb-4">Payment & Earnings</h2>
                        <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700">Bank Information:</p>
                            <p className="text-[#1D1616]">{bankInfo}</p> {/* bankInfo is used */}
                        </div>
                        <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700">Payment Method:</p>
                            <p className="text-[#1D1616]">{paymentMethod}</p> {/* paymentMethod is used */}
                        </div>
                        <button
                            onClick={handleViewEarnings}
                            className="px-4 py-2 border border-gray-300 text-[#1D1616] rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-opacity-50"
                        >
                            View Earnings
                        </button>
                    </div>

                </div>

                {/* Right Content Area (or bottom section on smaller screens) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Account Settings */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-[#1D1616] mb-4">Account Settings</h2>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} // setEmail is used
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8E1616] focus:border-[#8E1616] sm:text-sm text-[#1D1616]"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <input
                                type="tel"
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)} // setPhone is used
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8E1616] focus:border-[#8E1616] sm:text-sm text-[#1D1616]"
                            />
                        </div>
                        <div>
                            <button
                                onClick={handleChangePassword}
                                className="px-4 py-2 border border-gray-300 text-[#1D1616] rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-opacity-50"
                            >
                                Change Password
                            </button>
                        </div>
                    </div>

                    {/* Teaching Preferences */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-[#1D1616] mb-4">Teaching Preferences</h2>
                        <div className="mb-4">
                            <label htmlFor="language" className="block text-sm font-medium text-gray-700">Teaching Language</label>
                            <select
                                id="language"
                                value={teachingLanguage}
                                onChange={(e) => setTeachingLanguage(e.target.value)} // setTeachingLanguage is used
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8E1616] focus:border-[#8E1616] sm:text-sm text-[#1D1616]"
                            >
                                <option value="English">English</option>
                                <option value="Spanish">Spanish</option>
                                <option value="French">French</option>
                                {/* Add more languages as needed */}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="categories" className="block text-sm font-medium text-gray-700">Preferred Course Categories</label>
                            {/* Multi-select dropdown - basic implementation. A dedicated library might be better for complex UIs. */}
                            <select
                                id="categories"
                                multiple
                                value={preferredCategories}
                                onChange={handleCategoryChange} // setPreferredCategories is used within handleCategoryChange
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8E1616] focus:border-[#8E1616] sm:text-sm h-32 text-[#1D1616]" // Increased height for multiple selections
                            >
                                <option value="Technology">Technology</option>
                                <option value="Design">Design</option>
                                <option value="Business">Business</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Photography">Photography</option>
                                {/* Add more categories as needed */}
                            </select>
                        </div>
                    </div>

                    {/* Notification Settings */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-[#1D1616] mb-4">Notification Settings</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">Enrollment Alerts</span>
                                <label htmlFor="enrollmentToggle" className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        id="enrollmentToggle"
                                        className="sr-only peer"
                                        checked={enrollmentAlerts}
                                        onChange={() => setEnrollmentAlerts(!enrollmentAlerts)} // setEnrollmentAlerts is used
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#8E1616] dark:peer-focus:ring-[#8E1616] rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-[#8E1616]"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">Student Messages</span>
                                <label htmlFor="messagesToggle" className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        id="messagesToggle"
                                        className="sr-only peer"
                                        checked={studentMessages}
                                        onChange={() => setStudentMessages(!studentMessages)} // setStudentMessages is used
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#8E1616] dark:peer-focus:ring-[#8E1616] rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-[#8E1616]"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">Payment Updates</span>
                                <label htmlFor="paymentToggle" className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        id="paymentToggle"
                                        className="sr-only peer"
                                        checked={paymentUpdates}
                                        onChange={() => setPaymentUpdates(!paymentUpdates)} // setPaymentUpdates is used
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#8E1616] dark:peer-focus:ring-[#8E1616] rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-[#8E1616]"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end space-x-4">
                <button
                    onClick={handleCancel}
                    className="px-6 py-2 border border-gray-300 text-[#1D1616] rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-opacity-50"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-[#8E1616] text-white rounded-md hover:bg-[#D84040] focus:outline-none focus:ring-2 focus:ring-[#8E1616] focus:ring-opacity-50"
                >
                    Save Settings
                </button>
            </div>
        </div>
    );
};

export default InstructorSettingsPage;