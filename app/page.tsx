"use client"
import "@/styles/visaposter.css"
import type React from "react"
import { useState, useRef } from "react"
import html2canvas from "html2canvas"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, Download } from "lucide-react"
import { FaPhone, FaEnvelope, FaGlobe } from "react-icons/fa";

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
    Australia: { left: "/flags/aus2.png", right: "/flags/aus2.png" },
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

    // Ensure all images loaded
    const images = posterRef.current.querySelectorAll('img')
    await Promise.all(
      Array.from(images).map(
        (img) =>
          new Promise<void>((resolve) => {
            if (img.complete) resolve()
            else img.onload = () => resolve()
          })
      )
    )

    const canvas = await html2canvas(posterRef.current, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
    })

    const link = document.createElement("a")
    link.download = `${studentName || "visa-granted"}-poster.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-blue-900">
          AIMS Visa Poster Generator
        </h1>

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
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-auto flex justify-center items-center"
            >
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
            className="relative w-full max-w-[595px] aspect-595/842 mx-auto"
          >
            {/* Background */}
            <img
              src="/images/visa1.png"
              alt="AIMS Visa Template"
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />

            {/* Student Name */}
            {studentName && (
              <div className="student-name-box">
                <div className="student-name-text">
                  <span className="Student-name">{studentName}</span>
                  <div className="visa-p">on Successful Visa Grant for <span>{country}</span></div>
                </div>
              </div>
            )}

            {/* Student Photo */}
            {studentPhoto && (
              <div className="absolute left-1/2 -translate-x-1/2" style={{ top: "43.85%" }}>
                <img
                  src={studentPhoto || "/placeholder.svg"}
                  alt="Student"
                  className="w-24 sm:w-36 md:w-55 h-24 sm:h-36 md:h-55 rounded-full object-cover border-4 border-white shadow-lg bg-white relative z-10"
                />
              </div>
            )}
            <div className="visa-granted-text">
              VISA GRANTED
            </div>

            {/* Left Flag */}
            {leftFlag && (
              <img
                src={leftFlag}
                alt="Left Flag"
                className="absolute w-16 sm:w-25 md:w-31"
                style={{
                  top: "50%",
                  left: "11%",
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
                className="absolute w-16 sm:w-25 md:w-31"
                style={{
                  top: "50%",
                  right: "11%",
                  transform: "translateY(-50%) rotate(18deg)",
                  filter: "drop-shadow(0px 4px 8px rgba(0,0,0,0.35))",
                }}
              />
            )}
            <div className="content">
              <div className="content-1st">Do Visit Us For More Information</div>
              <div className="contact-info">
                <div className="section1">
                  <p><FaPhone className="icon" /> +977-1-4544906</p>
                  <p><FaPhone className="icon" /> +977-9851169306</p>
                </div>
                <div className="section2">
                  <p><FaEnvelope className="icon"/> aimsglobal.edu.np@gmail.com</p>
                  <p><FaGlobe className="icon" /> www.aimsglobal.edu.np</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
