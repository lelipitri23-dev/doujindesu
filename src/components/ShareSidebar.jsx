import { Facebook, Twitter, MessageCircle, Share2 } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/config';

export default function ShareSidebar({ manga }) {
  // 1. Buat URL Halaman saat ini
  const shareUrl = `${SITE_CONFIG.baseUrl}/manga/${manga.slug}`;
  
  // 2. Buat Teks Pesan (misal untuk WA/Twitter)
  const text = `Baca komik ${manga.title} Bahasa Indonesia Gratis di ${SITE_CONFIG.name}`;

  // 3. Buat Link Share Platform
  const links = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + shareUrl)}`,
  };

  return (
    <div className="bg-card p-6 rounded-xl border border-gray-800 text-center shadow-lg sticky top-24">
        <div className="flex justify-center mb-3 text-primary">
            <Share2 size={32} />
        </div>
        <h3 className="text-white font-bold mb-2 text-lg">Bagikan Komik Ini!</h3>
        <p className="text-sm text-gray-400 mb-6">
            Bantu {manga.metadata?.author || 'Author'} agar karyanya makin dikenal.
        </p>
        
        <div className="space-y-3">
            {/* Tombol Facebook */}
            <a 
                href={links.facebook} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#1877F2] hover:bg-blue-700 text-white text-sm font-bold py-2.5 rounded-lg transition"
            >
                <Facebook size={18} fill="currentColor" className="text-white"/> Facebook
            </a>

            {/* Tombol Twitter (X) */}
            <a 
                href={links.twitter} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#1DA1F2] hover:bg-sky-500 text-white text-sm font-bold py-2.5 rounded-lg transition"
            >
                <Twitter size={18} fill="currentColor" className="text-white"/> Twitter
            </a>

            {/* Tombol WhatsApp */}
            <a 
                href={links.whatsapp} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-green-600 text-white text-sm font-bold py-2.5 rounded-lg transition"
            >
                <MessageCircle size={18} className="text-white"/> WhatsApp
            </a>
        </div>
    </div>
  );
}