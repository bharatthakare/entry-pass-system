"use client";

import React, { useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Calendar, User, GraduationCap } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";
import { Student } from "@/lib/supabase";
import { generateVerificationUrl } from "@/lib/pass-generator";

interface PassCardProps {
  student: Student;
  onDownload?: () => void;
}

export function PassCard({ student, onDownload }: PassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const verificationUrl = generateVerificationUrl(student.id);

  const handleDownload = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        logging: false,
        useCORS: true, // ✅ allow image & SVG capture
        foreignObjectRendering: true, // ✅ capture inline SVG (QRCodeSVG)
      });

      const link = document.createElement("a");
      link.download = `entry-pass-${student.name.replace(/\s+/g, "-")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      onDownload?.();
    } catch (error) {
      console.error("Failed to generate pass image:", error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card
        ref={cardRef}
        className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-teal-50 border-2 border-blue-200"
      >
        <div className="p-8">
          {/* Header with Logo */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">
              College Entry Pass
            </h1>
            <p className="text-sm text-gray-600">MATH ASSO. PASS</p>
          </div>

          {/* Student Details */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Student Name</p>
                <p className="font-semibold text-gray-900">{student.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Class</p>
                <p className="font-semibold text-gray-900">{student.class}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Event Date</p>
                <p className="font-semibold text-gray-900">30 Sept 2025</p>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="text-center">
            <div className="inline-block p-4 bg-white rounded-lg shadow-sm">
              <QRCodeSVG value={verificationUrl} size={120} level="M" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Scan to verify entry pass
            </p>
          </div>

          {/* Pass ID */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Pass ID: {student.id.slice(0, 8)}
            </p>
          </div>
        </div>
      </Card>

      {/* Download Button */}
      <div className="mt-4">
        <Button
          onClick={handleDownload}
          className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Pass
        </Button>
      </div>
    </div>
  );
}
