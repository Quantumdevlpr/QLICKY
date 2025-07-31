// src/components/generator/QRCodeDisplay.tsx
import React, { useRef, useEffect } from 'react';
import QRCodeStyling from 'qr-code-styling'; // This is the core library import
import { PatternType } from '../../types'; // Path from generator/QRCodeDisplay.tsx to src/types.ts

// Define the props for THIS QRCodeDisplay component
interface QRCodeDisplayProps {
  data: string;       // The text/URL to encode
  size?: number;     // Overall size (e.g., 256)
  fgColor?: string;  // Foreground color of QR code modules
  bgColor?: string;  // Background color of the QR code
  pattern: PatternType; // The selected pattern from PatternSelector
  imageSettings?: {
    src: string;
    height?: number;
    width?: number;
    excavate?: boolean;
  } | null;
  // You can add more props here if you want to control other qr-code-styling options
  // e.g., cornerColor, image for logo, etc.
}

// Initialize the QRCodeStyling instance *once* outside the component.
// This instance will be updated by React's useEffect, not re-created.
const qrCodeInstance = new QRCodeStyling({
  width: 256,
  height: 256,
  type: 'canvas', // 'canvas' is generally good for performance. Use 'svg' if you need SVG output.
  data: 'https://default.com', // Initial dummy data, will be overwritten by props
  dotsOptions: {
    color: '#000000',
    type: 'square', // Default shape when initialized
  },
  backgroundOptions: {
    color: '#FFFFFF',
  },
  cornersSquareOptions: { // Options for the large corner squares (finder patterns)
    color: '#000000',
    type: 'square',
  },
  cornersDotOptions: { // Options for the small dots inside the corner squares
    color: '#000000',
    type: 'square',
  },
});

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  data,
  size = 256,
  fgColor = '#000000',
  bgColor = '#FFFFFF',
  pattern,
  imageSettings,
}) => {
  // Create a ref to attach to the HTML element where the QR code will be drawn
  const ref = useRef<HTMLDivElement>(null);

  // Effect 1: Append the QR code canvas/SVG to the DOM element.
  // This runs only once when the component mounts.
  useEffect(() => {
    if (ref.current) {
      // Clear any previous content in the div, especially useful during hot-reloads
      ref.current.innerHTML = '';
      qrCodeInstance.append(ref.current);
    }
  }, []); // Empty dependency array means this effect runs only once

  // Effect 2: Update the QR code options whenever relevant props change.
  // This is where the pattern (and other properties) will be applied.
  useEffect(() => {
    // Define variables for the shapes based on your PatternType
    let dotShape: 'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded';
    let cornerSquareShape: 'square' | 'dot' | 'extra-rounded';
    let cornerDotShape: 'square' | 'dot';

    // Map your custom pattern names to qr-code-styling's supported shapes
    switch (pattern) {
      case 'squares':
        dotShape = 'square';
        cornerSquareShape = 'square';
        cornerDotShape = 'square';
        break;
      case 'dots':
        dotShape = 'dots'; // This will make the main QR code modules circular
        cornerSquareShape = 'square'; // Keep the main corners square
        cornerDotShape = 'dot'; // Make the inner corner dots circular
        break;
      case 'rounded':
        dotShape = 'rounded'; // This will make the main QR code modules rounded squares
        cornerSquareShape = 'extra-rounded'; // Make the main corners rounded
        cornerDotShape = 'dot'; // Make the inner corner dots circular
        break;
      case 'classy':
        // 'qr-code-styling' offers 'classy' and 'classy-rounded' dot types.
        // Choose the one that best visually matches your SVG preview for "classy".
        dotShape = 'classy';
        cornerSquareShape = 'extra-rounded'; // Often paired with classy dots for a cohesive look
        cornerDotShape = 'dot';
        break;
      default: // Fallback for any unexpected pattern value (shouldn't happen with PatternType)
        dotShape = 'square';
        cornerSquareShape = 'square';
        cornerDotShape = 'square';
    }

    // Prepare image options if logo is provided
    const imageOptions = imageSettings?.src ? {
      image: imageSettings.src,
      imageOptions: {
        hideBackgroundDots: imageSettings.excavate ?? true,
        imageSize: Math.min((imageSettings.width ?? 40) / size, (imageSettings.height ?? 40) / size, 0.4),
        margin: 0,
      }
    } : {};

    // Update the QR code instance with the new options
    qrCodeInstance.update({
      width: size,
      height: size,
      data: data,
      dotsOptions: {
        color: fgColor,
        type: dotShape, // Apply the selected dot shape here
      },
      backgroundOptions: {
        color: bgColor,
      },
      cornersSquareOptions: {
        color: fgColor,
        type: cornerSquareShape, // Apply the corner square shape
      },
      cornersDotOptions: {
        color: fgColor,
        type: cornerDotShape, // Apply the corner dot shape
      },
      ...imageOptions, // Spread the image options if logo is provided
    });
  }, [data, size, fgColor, bgColor, pattern, imageSettings]); // Dependencies: re-run this effect if any of these props change

  return (
    <div
      ref={ref} // Attach this ref to the div so qrCodeInstance can append to it
      className="p-4 bg-white rounded-lg shadow-lg flex justify-center items-center"
    >
      {/* The QR code (canvas or SVG) will be drawn inside this div by qrCodeInstance */}
    </div>
  );
};

export default QRCodeDisplay;