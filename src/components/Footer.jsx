import Link from 'next/link';
import { Facebook, Twitter, Instagram, Github, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-card border-t border-gray-800 pt-12 pb-6 mt-auto">
      <div className="container mx-auto px-4">
        
        {/* Bagian Atas: 3 Kolom */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            
            {/* Kolom 1: Brand & Disclaimer */}
            <div className="space-y-4">
                <Link href="/" className="text-2xl font-bold text-white flex items-center gap-2">
                    <span className="bg-primary px-2 rounded text-white">KOMIK</span>CAST
                </Link>
                <p className="text-gray-400 text-sm leading-relaxed">
                    Semua komik di website ini hanya preview dari komik aslinya, 
                    mungkin terdapat banyak kesalahan bahasa, nama tokoh, dan alur cerita. 
                    Untuk versi aslinya, silahkan beli komiknya jika tersedia di kotamu.
                </p>
            </div>

            {/* Kolom 2: Navigasi Cepat */}
            <div className="flex flex-col gap-2">
                <h3 className="text-white font-bold mb-2 border-l-4 border-primary pl-3">TAUTAN</h3>
                <Link href="/" className="text-gray-400 hover:text-primary transition text-sm">Home</Link>
                <Link href="/list" className="text-gray-400 hover:text-primary transition text-sm">Daftar Komik</Link>
                <Link href="/type/manhwa" className="text-gray-400 hover:text-primary transition text-sm">Manhwa</Link>
                <Link href="/type/manhua" className="text-gray-400 hover:text-primary transition text-sm">Manhua</Link>
                <Link href="/bookmark" className="text-gray-400 hover:text-primary transition text-sm">Bookmark Saya</Link>
            </div>

            {/* Kolom 3: Social & Support */}
            <div>
                <h3 className="text-white font-bold mb-4 border-l-4 border-primary pl-3">IKUTI KAMI</h3>
                <div className="flex gap-4 mb-6">
                    <a href="#" className="bg-darker p-2 rounded hover:bg-[#1877F2] hover:text-white text-gray-400 transition">
                        <Facebook size={20} />
                    </a>
                    <a href="#" className="bg-darker p-2 rounded hover:bg-[#1DA1F2] hover:text-white text-gray-400 transition">
                        <Twitter size={20} />
                    </a>
                    <a href="#" className="bg-darker p-2 rounded hover:bg-[#E1306C] hover:text-white text-gray-400 transition">
                        <Instagram size={20} />
                    </a>
                    <a href="#" className="bg-darker p-2 rounded hover:bg-gray-600 hover:text-white text-gray-400 transition">
                        <Github size={20} />
                    </a>
                </div>
                
                <p className="text-gray-500 text-xs">
                    Email: support@komikcast.clone
                </p>
            </div>
        </div>

        {/* Bagian Bawah: Copyright */}
        <div className="border-t border-gray-800 pt-6 text-center">
            <p className="text-gray-500 text-sm flex items-center justify-center gap-1">
                &copy; {new Date().getFullYear()} Komikcast Clone. Made with <Heart size={14} className="text-red-500 fill-red-500" /> by You.
            </p>
        </div>

      </div>
    </footer>
  );
}