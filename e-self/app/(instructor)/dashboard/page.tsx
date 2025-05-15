"use client";
import React, { useState } from "react";
import {
    FaBook,
    FaUserGraduate,
    FaMoneyBillWave,
    FaUserCircle,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Page() {
    const router = useRouter();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const stats = [
        {
            icon: FaBook,
            title: "Total Courses",
            value: "12",
            onClick: () => router.push("/dashboard/courses"),
        },
        {
            icon: FaUserGraduate,
            title: "Total Students",
            value: "1,245",
            onClick: () => router.push("/dashboard/students"),
        },
        {
            icon: FaMoneyBillWave,
            title: "Total Earnings",
            value: "$5,320",
            onClick: () => router.push("/dashboard/balance"),
        },
    ];

    return (
        <div className="p-6 bg-[#EEEEEE] min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mt-6 bg-white p-4 rounded-lg shadow-md">
                <div>
                    <p className="text-lg font-medium text-[#1D1616]">
                        Hi, <span className="font-semibold">Instructor Name</span>
                    </p>
                    {/* Fixed: Escaped the apostrophe */}
                    <p className="text-sm text-[#1D1616]/70">Today&apos;s Report</p>
                </div>

                {/* Profile Dropdown */}
                <div className="relative">
                    <FaUserCircle
                        className="text-3xl cursor-pointer text-[#1D1616]"
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                    />
                    {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-4 z-10">
                            <ul className="space-y-3">
                                <li>
                                    <button
                                        onClick={() => router.push("/instructor/edit-profile")}
                                        className="text-[#1D1616] hover:text-[#D84040] w-full text-left"
                                    >
                                        Edit Profile
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => router.push("/instructor/settings")}
                                        className="text-[#1D1616] hover:text-[#D84040] w-full text-left"
                                    >
                                        Settings
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => router.push("/instructor/change-password")}
                                        className="text-[#1D1616] hover:text-[#D84040] w-full text-left"
                                    >
                                        Change Password
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => router.push("/")}
                                        className="text-[#1D1616] hover:text-[#D84040] w-full text-left"
                                    >
                                        Log Out
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
                {stats.map((stat, index) => (
                    <Card
                        key={index}
                        onClick={stat.onClick}
                        className="cursor-pointer hover:shadow-xl transition border-none bg-white"
                    >
                        <CardHeader>
                            <stat.icon className="text-4xl text-[#8E1616]" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-lg font-medium text-[#1D1616]">{stat.title}</p>
                            <p className="text-2xl font-bold text-[#1D1616]">{stat.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Courses */}
            <Card className="mt-8 shadow-md">
                <CardHeader>
                    <h2 className="text-xl font-semibold text-[#1D1616]">Recent Courses</h2>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {["Advanced JavaScript", "React for Beginners", "Node.js Masterclass"].map(
                            (course, index) => (
                                <li
                                    key={index}
                                    className="bg-[#F9F9F9] p-4 rounded-lg shadow-sm flex justify-between items-center"
                                >
                                    <span className="font-medium text-[#1D1616]">{course}</span>
                                    <span className="text-[#1D1616]/70">
                                        {Math.floor(Math.random() * 200) + 50} Students
                                    </span>
                                </li>
                            )
                        )}
                    </ul>
                </CardContent>
            </Card>

            {/* Analytics Button */}
            <div className="mt-6 text-center">
                <a
                    href="/analytics"
                    className="inline-block py-2 px-6 bg-[#8E1616] text-white rounded-full shadow-md hover:bg-[#D84040] transition"
                >
                    View Analytics
                </a>
            </div>
        </div>
    );
}