import Link from 'next/link';
import { Search, Bookmark } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-card border-b border-gray-800 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-white flex items-center gap-2">
          <span className="bg-primary px-2 rounded text-white">KOMIK</span>CAST
        </Link>

        {/* Menu Desktop */}
        <div className="hidden md:flex items-center gap-6 text-sm font-bold text-gray-300">
          <Link href="/" className="hover:text-primary transition">HOME</Link>
          <Link href="/list" className="hover:text-primary transition">DAFTAR KOMIK</Link>
          <Link href="/bookmark" className="hover:text-primary transition flex items-center gap-1">
             <Bookmark size={16}/> BOOKMARK
          </Link>
        </div>

        {/* Search Bar Sederhana */}
        <form action="/search" className="flex items-center bg-darker rounded-full px-4 py-2 border border-gray-700">
             <input 
                name="q"
                type="text" 
                placeholder="Cari komik..." 
                className="bg-transparent text-sm text-white focus:outline-none w-32 sm:w-64"
             />
             <button type="submit"><Search className="w-4 h-4 text-gray-400 hover:text-white" /></button>
        </form>
      </div>
    </nav>
  );
}