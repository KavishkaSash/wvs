"use client";
import React from "react";
import { Scale, ShieldCheck, Truck, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const Homepage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              Weight Verification System
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Ensure accuracy and compliance with our advanced weight
              verification solution. Fast, reliable, and secure.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link href="/createheader">
                  <button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                    Get Started
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-white shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                  <Scale size={24} />
                </div>
                <h3 className="mt-6 text-center text-lg font-medium text-gray-900">
                  Precise Measurements
                </h3>
                <p className="mt-2 text-center text-gray-600">
                  High-accuracy weight verification with detailed reporting
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="mt-6 text-center text-lg font-medium text-gray-900">
                  Compliance Ready
                </h3>
                <p className="mt-2 text-center text-gray-600">
                  Meets industry standards and regulatory requirements
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                  <Clock size={24} />
                </div>
                <h3 className="mt-6 text-center text-lg font-medium text-gray-900">
                  Real-time Tracking
                </h3>
                <p className="mt-2 text-center text-gray-600">
                  Monitor weights and verify data in real-time
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                  <Truck size={24} />
                </div>
                <h3 className="mt-6 text-center text-lg font-medium text-gray-900">
                  Load Management
                </h3>
                <p className="mt-2 text-center text-gray-600">
                  Efficient handling of multiple weighing stations
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Trusted by Industry Leaders
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Our weight verification system is designed to meet the highest
              standards of accuracy and reliability. <br />
              Developed By TeaTang SE TEAM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
