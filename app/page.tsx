"use client"

import type React from "react"
import { useState, useRef } from "react"
import html2canvas from "html2canvas"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, Download } from "lucide-react"

export default function VisaPosterGenerator() {
  const [studentName, setStudentName] = useState("")
  const [studentPhoto, setStudentPhoto] = useState<string | null>(null)
  const [country, setCountry] = useState("")
  const [leftFlag, setLeftFlag] = useState<string | null>(null)
  const [rightFlag, setRightFlag] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const posterRef = useRef<HTMLDivElement>(null)

  const flagMap: Record<string, { left: string; right: string }> = {
    USA: { left: "/flags/usa.png", right: "/flags/usa.png" },
    UK: { left: "/flags/uk.png", right: "/flags/uk.png" },
    Australia: { left: "/flags/aus.png", right: "/flags/aus.png" },
    NZ: { left: "/flags/nz.png", right: "/flags/nz.png" },
    Canada: { left: "/flags/canada.png", right: "/flags/canada.png" },
  }

  const handleCountryChange = (value: string) => {
    setCountry(value)
    if (flagMap[value]) {
      setLeftFlag(flagMap[value].left)
      setRightFlag(flagMap[value].right)
    }
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setStudentPhoto(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDownload = async () => {
    if (!posterRef.current) return
    const canvas = await html2canvas(posterRef.current, { scale: 2, useCORS: true })
    const link = document.createElement("a")
    link.download = `${studentName || "visa-granted"}-poster.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  return (
    <div className="min-h-screen bg-muted p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center">AIMS Visa Poster Generator</h1>

        {/* Inputs */}
        <div className="flex flex-wrap gap-4 items-end justify-center">
          <div className="space-y-1 w-full sm:w-60">
            <Label htmlFor="name">Student Name</Label>
            <Input
              id="name"
              placeholder="Enter name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-1 w-full sm:w-60">
            <Label>Country</Label>
            <select
              className="border rounded-md p-2 w-full"
              value={country}
              onChange={(e) => handleCountryChange(e.target.value)}
            >
              <option value="">Select Country</option>
              <option value="USA">USA</option>
              <option value="UK">UK</option>
              <option value="Australia">Australia</option>
              <option value="NZ">New Zealand</option>
              <option value="Canada">Canada</option>
            </select>
          </div>

          <div className="w-full sm:w-auto">
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              ref={fileInputRef}
              className="hidden"
            />
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full sm:w-auto">
              <Upload className="w-4 h-4 mr-2" />
              {studentPhoto ? "Change Photo" : "Upload Photo"}
            </Button>
          </div>

          <Button
            onClick={handleDownload}
            className="bg-green-600 hover:bg-green-700 w-full sm:w-auto flex justify-center items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PNG
          </Button>
        </div>

        {/* Poster Preview */}
        <div className="flex justify-center">
          <div
            ref={posterRef}
            className="relative w-full max-w-[595px] aspect-[595/842] mx-auto"
          >
            {/* Background */}
            <img
              src="/images/visa.png"
              alt="AIMS Visa Template"
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />

            {/* Student Name */}
            {studentName && (
              <div className="absolute left-0 right-0 text-center" style={{ top: "36%" }}>
                <span className="text-base sm:text-2xl md:text-3xl font-bold text-blue-900">
                  {studentName}
                </span>
              </div>
            )}

            {/* Student Photo */}
            {studentPhoto && (
              <div className="absolute left-1/2 -translate-x-1/2" style={{ top: "44%" }}>
                <img
                  src={studentPhoto || "/placeholder.svg"}
                  alt="Student"
                  className="w-33 sm:w-44 md:w-52 h-33 sm:h-44 md:h-52 rounded-full object-cover border-4 border-white shadow-lg"
                />
              </div>
            )}

            {/* Left Flag */}
            {leftFlag && (
              <img
                src={leftFlag}
                alt="Left Flag"
                className="absolute w-20 sm:w-28 md:w-36"
                style={{
                  top: "50%",
                  left: "8.7%",
                  transform: "translateY(-50%) scaleX(-1) rotate(18deg)",
                  filter: "drop-shadow(0px 4px 8px rgba(0,0,0,0.35))",
                }}
              />
            )}

            {/* Right Flag */}
            {rightFlag && (
              <img
                src={rightFlag}
                alt="Right Flag"
                className="absolute w-20 sm:w-28 md:w-36"
                style={{
                  top: "50%",
                  right: "8.8%",
                  transform: "translateY(-50%) rotate(18deg)",
                  filter: "drop-shadow(0px 4px 8px rgba(0,0,0,0.35))",
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
