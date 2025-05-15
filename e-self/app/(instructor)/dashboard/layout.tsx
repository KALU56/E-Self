"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    FaChartLine, // Used for Overview
    FaBook, // Used for Create Course
    // FaGraduationCap, // Not used
    // FaMoneyBillWave, // Not used
} from "react-icons/fa";
import {
    // FiMessageSquare, // Not used
    FiSettings // Used for Settings
} from "react-icons/fi";
import LandingHeader from "../../(components)/instructor/LandingHeader";

import { MdLeaderboard } from "react-icons/md" // Used for Students

const menuItems = [
    { name: "Overview", icon: FaChartLine, link: "/dashboard" },
    { name: "Create Course", icon: FaBook, link: "/dashboard/add-course" },
    { name: "Students", icon: MdLeaderboard, link: "/dashboard/students" },
    { name: "Settings", icon: FiSettings, link: "/dashboard/settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const pathname = usePathname();

    return (
        <>
            <LandingHeader />

            <div className="flex">
                {/* Sidebar */}
                <aside
                    className={`bg-white hidden md:block h-screen fixed top-16 left-0 z-40 shadow-md transition-all duration-300
           ${isSidebarOpen ? "w-64" : "w-20"}`}
                >
                    <div className="flex justify-end p-2">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="text-red-700 hover:bg-gray-200 text-xl p-2 rounded-full transition"
                            title={isSidebarOpen ? "Collapse" : "Expand"}
                        >
                            {isSidebarOpen ? "<" : ">"}
                        </button>
                    </div>

                    <ul className="mt-2 space-y-2 p-4">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.link;
                            return (
                                <li key={item.name}>
                                    <Link
                                        href={item.link}
                                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-200
                      ${isActive ? "bg-[#8E1616] text-white" : "text-gray-700 hover:bg-gray-100"}`}
                                    >
                                        <item.icon className="text-2xl" />
                                        <span className={`${isSidebarOpen ? "block" : "hidden"} transition-all`}>
                                            {item.name}
                                        </span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </aside>

                {/* Main content */}
                <main
                    className={`flex-1 p-6 transition-all duration-300 mt-16 w-full
           ${isSidebarOpen ? "md:ml-64" : "md:ml-20"}`}
                >
                    {children}
                </main>
            </div>

            {/* Mobile Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-inner border-t md:hidden">
                <ul className="flex justify-around items-center h-16">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.link;
                        return (
                            <li key={item.name}>
                                <Link
                                    href={item.link}
                                    className={`flex flex-col items-center text-xs ${
                                        isActive ? "text-[#8E1616]" : "text-gray-600"
                                    }`}
                                >
                                    <item.icon className="text-xl mb-1" />
                                    {item.name.split(" ")[0]}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </>
    );
}