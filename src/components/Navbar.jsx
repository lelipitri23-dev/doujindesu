'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Bookmark, Menu, X, Home, BookOpen, ChevronDown, Layers } from 'lucide-react'; // Tambah ChevronDown & Layers
import { SITE_CONFIG } from '@/lib/config';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Helper untuk mengecek link aktif
  const isActive = (path) => pathname === path ? 'text-primary font-bold' : 'text-gray-300 hover:text-primary';

  const toggleMenu = () => setIsOpen(!isOpen);

  // Data Types untuk Dropdown
  const types = [
    { name: 'Manga', href: '/type/manga' },
    { name: 'Manhwa', href: '/type/manhwa' },
    { name: 'Doujinshi', href: '/type/doujinshi' },
  ];

  return (
    <nav className="bg-card border-b border-gray-800 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        
        {/* === 1. LOGO & BRAND === */}
        <Link href="/" className="text-xl md:text-2xl font-bold text-white flex items-center gap-1 flex-shrink-0">
          <span className="bg-primary px-2 rounded text-white uppercase">
             {SITE_CONFIG.name.slice(0, 5)}
          </span>
          <span className="hidden sm:inline uppercase">
             {SITE_CONFIG.name.slice(5)}
          </span>
        </Link>

        {/* === 2. SEARCH BAR (Desktop) === */}
        <div className="flex-1 max-w-md mx-auto hidden sm:block">
            <form action="/search" className="flex items-center bg-darker rounded-full px-4 py-2 border border-gray-700 focus-within:border-primary transition w-full">
                <input 
                    name="q"
                    type="text" 
                    placeholder="Cari komik, manhwa..." 
                    className="bg-transparent text-sm text-white focus:outline-none w-full"
                    autoComplete="off"
                />
                <button type="submit" aria-label="Search">
                    <Search className="w-4 h-4 text-gray-400 hover:text-white" />
                </button>
            </form>
        </div>

        {/* === 3. MENU DESKTOP === */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium h-full">
          <Link href="/" className={`${isActive('/')} transition`}>Home</Link>
          <Link href="/list" className={`${isActive('/list')} transition`}>Daftar Manga</Link>
          
          {/* --- DROPDOWN TYPES (BARU) --- */}
          <div className="relative group h-full flex items-center">
            <button className={`flex items-center gap-1 transition ${pathname.includes('/type') ? 'text-primary font-bold' : 'text-gray-300 hover:text-primary'}`}>
                Type <ChevronDown size={14} />
            </button>
            
            {/* Isi Dropdown (Muncul saat Hover) */}
            <div className="absolute top-10 left-0 w-40 bg-card border border-gray-800 shadow-xl rounded-lg py-2 hidden group-hover:block animate-in fade-in zoom-in-95 duration-200">
                {types.map((type) => (
                    <Link 
                        key={type.name} 
                        href={type.href} 
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-darker hover:text-primary transition"
                    >
                        {type.name}
                    </Link>
                ))}
            </div>
          </div>
          {/* ----------------------------- */}

          <Link href="/bookmark" className={`${isActive('/bookmark')} transition flex items-center gap-1`}>
             <Bookmark size={16}/> Bookmark
          </Link>
        </div>

        {/* === 4. TOMBOL MENU MOBILE === */}
        <div className="flex items-center gap-3 md:hidden">
            <Link href="/search" className="sm:hidden text-gray-300">
                <Search size={24} />
            </Link>
            <button onClick={toggleMenu} className="text-gray-300 hover:text-white focus:outline-none">
                {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
        </div>
      </div>

      {/* === 5. DROPDOWN MENU MOBILE === */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-card border-b border-gray-800 shadow-xl animate-in slide-in-from-top-5 duration-200 h-[calc(100vh-64px)] overflow-y-auto">
            <div className="flex flex-col p-4 space-y-4">
                
                {/* Search Mobile */}
                <form action="/search" className="flex items-center bg-darker rounded-lg px-4 py-3 border border-gray-700 sm:hidden">
                    <input name="q" type="text" placeholder="Mau baca apa?" className="bg-transparent text-sm text-white focus:outline-none w-full" />
                    <button type="submit"><Search className="w-5 h-5 text-gray-400" /></button>
                </form>

                <Link href="/" onClick={() => setIsOpen(false)} className={`flex items-center gap-3 px-2 py-2 rounded-lg ${pathname === '/' ? 'bg-primary/10 text-primary' : 'text-gray-300 hover:bg-gray-800'}`}>
                    <Home size={20} /> <span className="font-bold">Home</span>
                </Link>

                <Link href="/list" onClick={() => setIsOpen(false)} className={`flex items-center gap-3 px-2 py-2 rounded-lg ${pathname === '/list' ? 'bg-primary/10 text-primary' : 'text-gray-300 hover:bg-gray-800'}`}>
                    <BookOpen size={20} /> <span className="font-bold">Daftar Manga</span>
                </Link>

                {/* --- TYPES SECTION DI MOBILE (Expand) --- */}
                <div className="bg-darker/30 rounded-lg p-3 border border-gray-800">
                    <div className="flex items-center gap-3 px-2 mb-2 text-gray-400 font-bold text-xs uppercase tracking-wider">
                        <Layers size={16} /> Type
                    </div>
                    <div className="grid grid-cols-2 gap-2 pl-2">
                        {types.map((type) => (
                            <Link 
                                key={type.name} 
                                href={type.href} 
                                onClick={() => setIsOpen(false)}
                                className={`text-sm py-1.5 px-2 rounded ${pathname === type.href ? 'text-primary bg-primary/10' : 'text-gray-300 hover:text-white'}`}
                            >
                                {type.name}
                            </Link>
                        ))}
                    </div>
                </div>
                <Link href="/bookmark" onClick={() => setIsOpen(false)} className={`flex items-center gap-3 px-2 py-2 rounded-lg ${pathname === '/bookmark' ? 'bg-primary/10 text-primary' : 'text-gray-300 hover:bg-gray-800'}`}>
                    <Bookmark size={20} /> <span className="font-bold">Bookmark</span>
                </Link>
            </div>
        </div>
      )}
    </nav>
  );
}