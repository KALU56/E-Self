"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaChartLine, FaBook, FaGraduationCap, FaMoneyBillWave } from "react-icons/fa";
import { FiMessageSquare, FiSettings } from "react-icons/fi";
import { MdLeaderboard } from "react-icons/md";

import LandingHeader from "../../(components)/instructor/LandingHeader";

const menuItems = [
  { name: "Overview", icon: FaChartLine, link: "/dashboard" },
  { name: "Create Course", icon: FaBook, link: "/dashboard/create-course" },
  { name: "Students", icon: MdLeaderboard, link: "/dashboard/students" },
  { name: "Balance", icon: FaMoneyBillWave, link: "/dashboard/balance" },
  { name: "Get Certificate", icon: FaGraduationCap, link: "/dashboard/certificate" },
  { name: "Messages", icon: FiMessageSquare, link: "/dashboard/messages", badge: 5 },
  { name: "Settings", icon: FiSettings, link: "/dashboard/settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  return (
    <>
      {/* Header */}
      <LandingHeader />

      {/* Sidebar + Content */}
      <div className="flex-1">
        {/* Sidebar */}
        <aside
          className={`bg-white h-screen fixed top-16 left-0 z-40 shadow-md transition-all duration-300 
            ${isSidebarOpen ? "w-64" : "w-18 sm:w-20 md:w-20 lg:w-21"} `}
        >
          {/* Sidebar Toggle Button */}
          <div className="flex justify-end p-2">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-red-700 hover:bg-gray-200 text-2xl p-2"
            >
              {isSidebarOpen ? ">" : "<"}
            </button>
          </div>

          {/* Sidebar Menu */}
          <ul className="mt-2 space-y-4 p-4">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.link}
                  className={`flex items-center p-3 rounded-lg transition-all duration-200 
                    ${pathname === item.link ? "bg-red-500 text-white" : "text-gray-700 hover:bg-gray-200"}`}
                >
                  <item.icon className="text-[#8E1616] text-2xl" />
                  <span className={`ml-2 ${isSidebarOpen ? "block" : "hidden"}`}>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 p-6 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-16"}`}>
          {children}  {/* Dashboard Pages will be rendered here */}
        </main>
      </div>
    </>
  );
}
