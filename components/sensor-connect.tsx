"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Battery, Bluetooth, CheckCircle, AlertCircle } from "lucide-react"

interface SensorConnectProps {
  onConnect: () => void
  customerData: any
}

export default function SensorConnect({ onConnect, customerData }: SensorConnectProps) {
  const [connecting, setConnecting] = useState(false)
  const [connected, setConnected] = useState(false)
  const [progress, setProgress] = useState(0)
  const [sensors, setSensors] = useState([
    { id: "LL", name: "Left Lower", battery: 0, connected: false },
    { id: "LU", name: "Left Upper", battery: 0, connected: false },
    { id: "RL", name: "Right Lower", battery: 0, connected: false },
    { id: "RU", name: "Right Upper", battery: 0, connected: false },
  ])

  const handleConnect = () => {
    setConnecting(true)

    // Simulate connecting to sensors
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setConnecting(false)
          setConnected(true)

          // Simulate sensor battery levels
          setSensors((prev) =>
            prev.map((sensor) => ({
              ...sensor,
              battery: Math.floor(Math.random() * 30) + 70, // 70-100%
              connected: true,
            })),
          )

          return 100
        }
        return prev + 5
      })
    }, 100)
  }

  const getBatteryIcon = (level: number) => {
    if (level >= 80) return <Battery size={16} className="text-green-500" />
    if (level >= 40) return <Battery size={16} className="text-yellow-500" />
    return <Battery size={16} className="text-red-500" />
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Bluetooth size={20} className="text-primary" />
          Connect IMU Sensors
        </h3>
        <p className="text-sm text-gray-400">
          Please connect the IMU sensors to the customer. Make sure all four sensors are properly attached.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {sensors.map((sensor) => (
          <Card
            key={sensor.id}
            className={`border ${sensor.connected ? "border-green-500" : "border-gray-700"} bg-secondary`}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{sensor.name}</span>
                <Badge
                  variant={sensor.connected ? "default" : "outline"}
                  className={sensor.connected ? "bg-green-500" : ""}
                >
                  {sensor.connected ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle size={12} />
                      Connected
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <AlertCircle size={12} />
                      Disconnected
                    </span>
                  )}
                </Badge>
              </div>
              {sensor.connected && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm flex items-center gap-1">
                    {getBatteryIcon(sensor.battery)}
                    Battery:
                  </span>
                  <Progress value={sensor.battery} className="h-2" />
                  <span className="text-sm">{sensor.battery}%</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {connecting && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span>Connecting to sensors...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => window.history.back()} className="border-gray-700">
          Back
        </Button>

        {!connected ? (
          <Button onClick={handleConnect} disabled={connecting} className="bg-primary text-black hover:bg-primary/90">
            {connecting ? "Connecting..." : "Connect to Sensors"}
          </Button>
        ) : (
          <Button onClick={onConnect} className="bg-primary text-black hover:bg-primary/90">
            Next: Start Testing
          </Button>
        )}
      </div>
    </div>
  )
}

