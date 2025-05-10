import React from "react";
import { QRCodeCanvas } from "qrcode.react";

const QRCodeGenerator = () => {
  const registrationUrl = "http://localhost:5173"; // Change to your registration form URL

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-xl font-bold mb-2">Scan to Register</h2>
      <QRCodeCanvas value={registrationUrl} size={200} />
      <p className="mt-2">Or visit: <a href={registrationUrl} className="text-blue-500">{registrationUrl}</a></p>
    </div>
  );
};

export default QRCodeGenerator;
