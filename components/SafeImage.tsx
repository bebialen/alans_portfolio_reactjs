
import React, { useState } from 'react';
import { Lock } from 'lucide-react';

interface SafeImageProps {
  src?: string;
  alt?: string;
  className?: string;
  placeholderText?: string;
}

const SafeImage: React.FC<SafeImageProps> = ({ 
  src, 
  alt = "Image", 
  className = "",
  placeholderText = "No image available"
}) => {
  const [error, setError] = useState(!src);

  const ndaMessages = [
    "REDACTED: Our lawyers told us that displaying this would violate Article 4, Section 9.2 of the 'Don't-Show-Our-Cool-Stuff' agreement.",
    "CONFIDENTIAL: This image is currently under an NDA so strict, even looking at it might trigger a lawsuit from 2045.",
    "CLASSIFIED: This visual asset is property of a Megacorp that doesn't officially exist. Move along.",
    "ERROR 451: Legal reasons prevent showing this masterpiece. Trust us, it was pixel-perfect.",
    "NDA BREACH PREVENTED: Visual data suppressed to protect the innocent (and Alan's bank account)."
  ];

  const randomNda = ndaMessages[Math.floor(Math.random() * ndaMessages.length)];

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center bg-zinc-900/50 p-6 text-center border border-dashed border-white/10 ${className}`}>
        <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center mb-4 ring-1 ring-white/10">
          <Lock className="w-6 h-6 text-zinc-500" />
        </div>
        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">
          {placeholderText}
        </p>
        <p className="text-[9px] text-zinc-600 font-medium italic leading-relaxed max-w-[200px]">
          "{randomNda}"
        </p>
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className={className}
      onError={() => setError(true)}
    />
  );
};

export default SafeImage;
