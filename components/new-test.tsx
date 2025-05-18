"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import CustomerForm from "@/components/customer-form"
import SensorConnect from "@/components/sensor-connect"
import TestExercises from "@/components/test-exercises"
import TestRating from "@/components/test-rating"
import { ClipboardList, Bluetooth, Dumbbell, Star } from "lucide-react"

export default function NewTest() {
  const [step, setStep] = useState(1)
  const [customerData, setCustomerData] = useState<any>(null)
  const [sensorConnected, setSensorConnected] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [testData, setTestData] = useState<any>({
    exercises: [],
    ratings: {},
  })

  const handleCustomerSubmit = (data: any) => {
    setCustomerData(data)
    setStep(2)
  }

  const handleSensorConnect = () => {
    setSensorConnected(true)
    setStep(3)
  }

  const handleTestComplete = (exerciseData: any, zipFileId: string) => {
    setTestData((prev) => ({
      ...prev,
      exercises: exerciseData,
      zipFileId: zipFileId,
    }))
    setTestCompleted(true)
    setStep(4)
  }

  const handleRatingSubmit = async (ratings: any) => {
    setTestData((prev) => ({
      ...prev,
      ratings,
    }))

    try {
      // Get token from localStorage
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication required")
      }

      // Send test data to API
      const response = await fetch("/api/tests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerId: customerData.id,
          exercises: Object.entries(testData.exercises).map(([id, data]: [string, any]) => ({
            name: id,
            category:
              id.includes("knee") || id.includes("lunge")
                ? "mobility"
                : id.includes("squat")
                  ? "strength"
                  : "endurance",
            completed: true,
            data: data,
          })),
          ratings,
          zipFileId: testData.zipFileId, // Add the zipFileId to link with the test
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save test data")
      }

      // Reset the form
      alert("Test completed and data saved successfully!")
      setStep(1)
      setCustomerData(null)
      setSensorConnected(false)
      setTestCompleted(false)
      setTestData({
        exercises: [],
        ratings: {},
      })
    } catch (error) {
      console.error("Error saving test data:", error)
      alert(error instanceof Error ? error.message : "An error occurred while saving test data")
    }
  }

  return (
    <Card className="border-primary/20 bg-card">
      <CardHeader>
        <CardTitle className="text-xl text-primary">New Fitness Test</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className={`flex-1 border-t-2 ${step >= 1 ? "border-primary" : "border-gray-700"}`}></div>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? "bg-primary text-black" : "bg-gray-700"}`}
            >
              <ClipboardList size={18} />
            </div>
            <div className={`flex-1 border-t-2 ${step >= 2 ? "border-primary" : "border-gray-700"}`}></div>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? "bg-primary text-black" : "bg-gray-700"}`}
            >
              <Bluetooth size={18} />
            </div>
            <div className={`flex-1 border-t-2 ${step >= 3 ? "border-primary" : "border-gray-700"}`}></div>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? "bg-primary text-black" : "bg-gray-700"}`}
            >
              <Dumbbell size={18} />
            </div>
            <div className={`flex-1 border-t-2 ${step >= 4 ? "border-primary" : "border-gray-700"}`}></div>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 4 ? "bg-primary text-black" : "bg-gray-700"}`}
            >
              <Star size={18} />
            </div>
            <div className={`flex-1 border-t-2 ${step >= 4 ? "border-primary" : "border-gray-700"}`}></div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>Customer Info</span>
            <span>Connect Sensor</span>
            <span>Test Exercises</span>
            <span>Rating</span>
          </div>
        </div>

        {step === 1 && <CustomerForm onSubmit={handleCustomerSubmit} />}

        {step === 2 && <SensorConnect onConnect={handleSensorConnect} customerData={customerData} />}

        {step === 3 && <TestExercises onComplete={handleTestComplete} customerData={customerData} />}

        {step === 4 && (
          <TestRating onSubmit={handleRatingSubmit} onBack={() => setStep(3)} customerData={customerData} />
        )}
      </CardContent>
    </Card>
  )
}

