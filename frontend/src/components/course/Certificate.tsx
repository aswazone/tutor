import { X } from "lucide-react";
import CertificateImage from "../../assets/certificate.png";
import { Download } from "../common/Download";
import { QRCodeCanvas } from "qrcode.react";
import jsPDF from "jspdf";
import React, { useState } from "react";
import { useCallback, useRef } from 'react';
import { toPng } from 'html-to-image';


const Certificate = ({name = "Aswin KP",course = "React JS",onClose}: 
  {name?: string,course?: string,onClose?: () => void}) => {

  const [isDownloading, setIsDownloading] = useState(false);
  const certId = `CERT-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000)}`;
  const issueDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const qrValue = `
    Student: ${name}
    Course: ${course}
    CertID: ${certId}
    Date: ${issueDate}
  `;



  const ref = useRef<HTMLDivElement>(null)
  const imageDataRef = useRef<string | null>(null);

  const handleDownload = async () => {
  try {
    setIsDownloading(true);
    
    const certElement = document.getElementById("certificate-content");
    if (!certElement) {
      console.error("Certificate content not found");
      return;
    }
  
    // Use the existing imageDataRef
    const imgData = imageDataRef.current;
    if (!imgData) {
      console.error("Image data not found");
      return;
    }
    
    // 2️⃣ Trigger image download
    const link = document.createElement("a");
    link.href = imgData;
    link.download = `certificate-${Date.now()}.png`;
    link.click();
  
    // 3️⃣ Create PDF too (optional)
    const pdf = new jsPDF({
      orientation: "landscape", // or portrait
      unit: "px",
      format: [certElement.offsetWidth, certElement.offsetHeight],
    });
  
    pdf.addImage(imgData, "PNG", 0, 0, certElement.offsetWidth, certElement.offsetHeight);
    pdf.save(`certificate-${Date.now()}.pdf`);
  
    setIsDownloading(false);
  } catch (error) {
    setIsDownloading(false);
    console.error("Error downloading certificate:", error);
  }
};

  const onButtonClick = useCallback(() => {
    if (ref.current === null) {
      return
    }

    toPng(ref.current, { cacheBust: true, })
      .then((dataUrl) => {
        const link = document.createElement('a')
        link.download = 'my-image-name.png'
        link.href = dataUrl
        imageDataRef.current = dataUrl; 
        link.click()
        handleDownload();
      })
      .catch((err) => {
        console.log(err)
      })
  }, [ref])


  


  return (
    <>
      <div  className="fixed top-8 z-40 w-full h-full bg-sky-900/5 backdrop-blur-lg">
        <div id='certificate-content'className="w-full h-full" ref={ref}>
        <div className="relative w-200 mx-auto my-15 p-4 border-2 border-sky-200/10 backdrop-blur">
          <img src={CertificateImage} alt="Certificate" className="w-200" />
          <h1 className="absolute top-[40%] left-[50%] translate-x-[-50%] text-7xl font-semibold wc-certificate-font text-[#32caeb] capitalize">{name}</h1>
          <p className="absolute top-[53%] left-[57%] translate-x-[-50%] text-md font-semibold wc-certificate-font text-[#a06cd0d3] capitalize">#{course}</p>
          <div className="absolute top-[70%] left-[50%] translate-x-[-50%] bg-sky-500/10 rounded-xs backdrop-blur-sm border-1 border-sky-200/20 p-1">
            <QRCodeCanvas
              value={qrValue}
              size={55}
              bgColor="#dae5f4"
              fgColor="#0c2855"
            />
          </div>
          <p className="absolute top-[82%] left-[50%] translate-x-[-50%] text-[8px] opacity-70 font-semibold">Scan the QR code to verify your certificate</p>
          <p className="absolute bottom-[4%] left-8  text-[9px] font-semibold text-white/60">Certificate ID: {certId}</p>
          <p className="absolute bottom-[4%] right-8  text-[9px] font-semibold text-white/60">Issued on: {issueDate}</p>

        </div>
        </div>
        <X className="w-8 h-8 absolute z-60 top-[8%] right-[2%] cursor-pointer border rounded-full p-1 text-sky-300" onClick={onClose}/>
        <div className="absolute w-[160px] bottom-[22%] right-[11%] px-1 z-50 border rounded-full rounded-br-none border-sky-600/30 animate-caret-blink hover:animate-none hover:border-sky-600/80 flex items-center gap-1">
          {
          !isDownloading && 
          <Download
            stroke="#32caeb"
            className="w-4 h-4"
            onClick={onButtonClick}
            
          />}
          <span className="text-sm font-semibold text-sky-300/80">{isDownloading ? "Wait..." : "Download it..!"}</span>
        </div>
      </div>
    </>
  );
};

export default React.memo(Certificate);
