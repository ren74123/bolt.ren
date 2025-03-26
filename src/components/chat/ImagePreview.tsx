import React from 'react';
import { X, Download, Share2 } from 'lucide-react';

interface ImagePreviewProps {
  url: string;
  onClose: () => void;
}

export function ImagePreview({ url, onClose }: ImagePreviewProps) {
  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <div className="absolute top-4 right-4 flex space-x-4">
        <button className="p-2 text-white hover:bg-white/10 rounded-full">
          <Download className="w-6 h-6" />
        </button>
        <button className="p-2 text-white hover:bg-white/10 rounded-full">
          <Share2 className="w-6 h-6" />
        </button>
        <button
          onClick={onClose}
          className="p-2 text-white hover:bg-white/10 rounded-full"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <img
        src={url}
        alt=""
        className="max-w-full max-h-full object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
