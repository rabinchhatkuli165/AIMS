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

  // Country → Flag File Mapping
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

          {/* Name */}
          <div className="space-y-1">
            <Label htmlFor="name">Student Name</Label>
            <Input
              id="name"
              placeholder="Enter name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-60"
            />
          </div>

          {/* Country Dropdown */}
          <div className="space-y-1">
            <Label>Country</Label>
            <select
              className="border rounded-md p-2 w-60"
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

          {/* Upload Photo */}
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              ref={fileInputRef}
              className="hidden"
            />
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              <Upload className="w-4 h-4 mr-2" />
              {studentPhoto ? "Change Photo" : "Upload Photo"}
            </Button>
          </div>

          {/* Download Button */}
          <Button onClick={handleDownload} className="bg-green-600 hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" />
            Download PNG
          </Button>
        </div>

        {/* Poster Preview */}
        <div className="flex justify-center">
          <div ref={posterRef} className="relative" style={{ width: 595, height: 842 }}>

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
                <span className="text-2xl font-bold text-blue-900">{studentName}</span>
              </div>
            )}

            {/* Student Photo */}
            {studentPhoto && (
              <div className="absolute left-1/2 -translate-x-1/2" style={{ top: "44%" }}>
                <img
                  src={studentPhoto || "/placeholder.svg"}
                  alt="Student"
                  className="w-52 h-52 rounded-full object-cover border-4 border-white shadow-lg"
                />
              </div>
            )}

            {/* Left Flag */}
            {/* Left Flag (pole near circle, flag to the left) */}
            {leftFlag && (
              <img
                src={leftFlag}
                alt="Left Flag"
                className="absolute"
                style={{
                  width: "140px",
                  top: "50%",
                  left: "9.5%",
                  transform: "translateY(-50%) scaleX(-1) rotate(18deg)",
                  filter: "drop-shadow(0px 4px 8px rgba(0,0,0,0.35))",
                }}
              />
            )}

            {/* Right Flag (flip horizontally so pole touches circle) */}
            {rightFlag && (
              <img
                src={rightFlag}
                alt="Right Flag"
                className="absolute"
                style={{
                  width: "140px",
                  top: "50%",
                  right: "9.5%",
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
