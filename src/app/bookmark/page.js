'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import MangaCard from '@/components/MangaCard';
import { Bookmark } from 'lucide-react';

export default function BookmarkPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('komik_bookmarks') || '[]');
    setBookmarks(data);
    setLoading(false);
  }, []);

  return (
    <main className="min-h-screen bg-dark pb-20">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
             <Bookmark className="text-primary" /> BOOKMARK SAYA
        </h1>

        {loading ? <p className="text-white">Memuat...</p> : 
         bookmarks.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {bookmarks.map(manga => <MangaCard key={manga.slug} manga={manga} />)}
            </div>
        ) : (
            <p className="text-gray-400">Belum ada komik yang disimpan.</p>
        )}
      </div>
    </main>
  );
}