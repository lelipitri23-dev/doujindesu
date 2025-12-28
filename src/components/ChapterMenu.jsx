'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { BookOpen, X, List, ChevronUp } from 'lucide-react';

export default function ChapterMenu({ chapters, currentSlug, mangaSlug }) {
  const [isOpen, setIsOpen] = useState(false);
  const activeRef = useRef(null);

  // Auto-scroll ke chapter yang sedang aktif saat menu dibuka
  useEffect(() => {
    if (isOpen && activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isOpen]);

  // Fungsi Render Item List (Dipakai ulang untuk Mobile & Desktop)
  const renderList = () => (
    <div className="space-y-1 p-2">
      {chapters.map((chap) => {
        const isActive = chap.slug === currentSlug;
        return (
          <Link
            key={chap._id}
            href={`/read/${mangaSlug}/${chap.slug}`}
            ref={isActive ? activeRef : null} // Pasang ref jika ini chapter aktif
            onClick={() => setIsOpen(false)} // Tutup menu saat diklik (Mobile)
            className={`block px-4 py-3 rounded-lg text-sm transition border ${
              isActive
                ? 'bg-primary text-white border-primary font-bold shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-gray-800 border-transparent'
            }`}
          >
            Chapter {chap.title}
          </Link>
        );
      })}
    </div>
  );

  return (
    <>
      {/* === TAMPILAN DESKTOP (SIDEBAR) === */}
      <div className="hidden lg:block w-[320px] flex-shrink-0">
        <div className="sticky top-24 bg-card border border-gray-800 rounded-xl overflow-hidden shadow-xl flex flex-col max-h-[calc(100vh-120px)]">
          <div className="p-4 bg-darker border-b border-gray-800 font-bold text-white flex items-center gap-2">
            <BookOpen size={18} className="text-primary" />
            Semua Chapter
          </div>
          <div className="overflow-y-auto custom-scrollbar flex-1">
            {renderList()}
          </div>
        </div>
      </div>

      {/* === TAMPILAN MOBILE (FLOATING BUTTON & SHEET) === */}
      <div className="lg:hidden">
        
        {/* 1. Tombol Melayang (Floating Action Button) */}
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-primary hover:bg-blue-600 text-white p-4 rounded-full shadow-2xl border border-white/20 transition-transform hover:scale-110 active:scale-95 flex items-center gap-2"
        >
          <List size={24} />
          <span className="font-bold text-xs hidden sm:block">Chapter</span>
        </button>

        {/* 2. Overlay Background (Gelap) */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* 3. Bottom Sheet (Panel Daftar Chapter) */}
        <div 
            className={`fixed bottom-0 left-0 w-full bg-card border-t border-gray-800 rounded-t-2xl z-50 shadow-2xl transform transition-transform duration-300 max-h-[75vh] flex flex-col ${
                isOpen ? 'translate-y-0' : 'translate-y-full'
            }`}
        >
            {/* Header Mobile */}
            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-darker rounded-t-2xl">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <BookOpen size={18} className="text-primary"/> Daftar Chapter
                </h3>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                    <X size={24} />
                </button>
            </div>

            {/* List Mobile (Scrollable) */}
            <div className="overflow-y-auto custom-scrollbar p-2 flex-1">
                {renderList()}
            </div>
        </div>
      </div>
    </>
  );
}