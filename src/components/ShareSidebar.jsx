'use client'; // Wajib ada karena kita menggunakan state (Copy Button)

import { useState } from 'react';
import { Facebook, Twitter, MessageCircle, Share2, Link as LinkIcon, Check } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/config';

export default function ShareSidebar({ manga }) {
  const [copied, setCopied] = useState(false);

  // 1. Validasi data agar tidak error jika manga undefined
  if (!manga) return null;

  // 2. Buat URL
  const shareUrl = `${SITE_CONFIG.baseUrl}/manga/${manga.slug}`;
  const text = `Baca komik ${manga.title} Bahasa Indonesia Gratis di ${SITE_CONFIG.name}`;

  // 3. Link Share
  const links = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + shareUrl)}`,
  };

  // 4. Fungsi Copy Link
  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset icon setelah 2 detik
    });
  };

  return (
    <div className="bg-card p-5 rounded-xl border border-gray-800 text-center shadow-lg sticky top-24">
        {/* Header Icon */}
        <div className="flex justify-center mb-4 relative">
            <div className="bg-primary/10 p-4 rounded-full">
                <Share2 size={32} className="text-primary" />
            </div>
        </div>

        <h3 className="text-white font-bold mb-1 text-lg">Bagikan Komik</h3>
        <p className="text-xs text-gray-400 mb-6 leading-relaxed">
            Dukung <strong>{manga.metadata?.author || 'Author'}</strong> dengan membagikan karya ini ke temanmu.
        </p>
        
        <div className="space-y-3">
            {/* Tombol Copy Link (FITUR BARU) */}
            <button 
                onClick={handleCopy}
                className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-bold transition border ${
                    copied 
                    ? 'bg-green-600 border-green-500 text-white' 
                    : 'bg-darker border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white'
                }`}
            >
                {copied ? <Check size={18} /> : <LinkIcon size={18} />}
                {copied ? 'Tersalin!' : 'Salin Tautan'}
            </button>

            <div className="border-t border-gray-800 my-3"></div>

            {/* Tombol Facebook */}
            <a 
                href={links.facebook} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#1877F2] hover:bg-blue-700 text-white text-sm font-bold py-2.5 rounded-lg transition shadow-md hover:shadow-lg"
            >
                <Facebook size={18} fill="currentColor" /> Facebook
            </a>

            {/* Tombol Twitter (X) */}
            <a 
                href={links.twitter} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#1DA1F2] hover:bg-sky-500 text-white text-sm font-bold py-2.5 rounded-lg transition shadow-md hover:shadow-lg"
            >
                <Twitter size={18} fill="currentColor" /> Twitter
            </a>

            {/* Tombol WhatsApp */}
            <a 
                href={links.whatsapp} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-green-600 text-white text-sm font-bold py-2.5 rounded-lg transition shadow-md hover:shadow-lg"
            >
                <MessageCircle size={18} fill="currentColor" /> WhatsApp
            </a>
        </div>
    </div>
  );
}