'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import MangaCard from '@/components/MangaCard';
import Link from 'next/link';
import { Bookmark, Frown, Trash2, BookOpen } from 'lucide-react';

export default function BookmarkPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ambil data dari LocalStorage saat component dimuat
  useEffect(() => {
    // Cek apakah window tersedia (client-side)
    if (typeof window !== 'undefined') {
      const data = JSON.parse(localStorage.getItem('komik_bookmarks') || '[]');
      setBookmarks(data);
    }
    setLoading(false);
  }, []);

  // Fungsi Hapus Semua Bookmark
  const clearBookmarks = () => {
    if (confirm('Yakin ingin menghapus semua bookmark?')) {
        localStorage.removeItem('komik_bookmarks');
        setBookmarks([]);
    }
  };

  return (
    <main className="min-h-screen bg-dark pb-20 font-sans">
      <Navbar />
      
      <div className="w-full mx-auto px-4 py-8">
        
        {/* HEADER SECTION */}
        <div className="bg-card p-6 rounded-lg border border-gray-800 mb-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <div className="bg-primary/20 p-3 rounded-full text-primary">
                    <Bookmark size={24} />
                </div>
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide">
                        BOOKMARK SAYA
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Daftar komik yang kamu simpan untuk dibaca nanti.
                    </p>
                </div>
            </div>

            {/* Tombol Hapus (Hanya muncul jika ada bookmark) */}
            {bookmarks.length > 0 && (
                <button 
                    onClick={clearBookmarks}
                    className="flex items-center gap-2 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-600/50 px-4 py-2 rounded transition text-sm font-bold"
                >
                    <Trash2 size={16} /> Hapus Semua
                </button>
            )}
        </div>

        {/* CONTENT SECTION */}
        {loading ? (
            <div className="flex items-center justify-center py-20">
                 <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
        ) : bookmarks.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {bookmarks.map((manga) => (
                    <MangaCard key={manga.slug} manga={manga} />
                ))}
            </div>
        ) : (
            // EMPTY STATE (Tampilan jika kosong)
            <div className="flex flex-col items-center justify-center py-20 bg-card/50 rounded-lg border border-gray-800 border-dashed">
                <div className="bg-gray-800 p-4 rounded-full mb-4">
                    <Frown size={48} className="text-gray-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-300">Belum Ada Bookmark</h3>
                <p className="text-gray-500 mt-2 text-center max-w-md px-4">
                    Kamu belum menyimpan komik apapun. Mulailah membaca dan simpan komik favoritmu agar mudah ditemukan!
                </p>
                <div className="mt-8">
                    <Link 
                        href="/list" 
                        className="bg-primary hover:bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-primary/20 transition flex items-center gap-2"
                    >
                        <BookOpen size={18} /> Mulai Jelajahi Komik
                    </Link>
                </div>
            </div>
        )}
      </div>
    </main>
  );
}