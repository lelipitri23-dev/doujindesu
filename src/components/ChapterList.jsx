'use client';

import { useState } from 'react';
import Link from 'next/link';
import { List, Search } from 'lucide-react';

export default function ChapterList({ chapters, slug, updatedAt }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Logika Filter
  const filteredChapters = chapters.filter((chap) => 
    chap.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    String(chap.chapter_index).includes(searchTerm)
  );

  return (
    <div className="bg-card rounded-xl border border-gray-800 overflow-hidden shadow-lg">
        {/* Header dengan Search Bar */}
        <div className="p-5 border-b border-gray-700 bg-gradient-to-r from-card to-darker flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
                <List className="text-primary" size={20} /> 
                <h3 className="text-lg font-bold text-white">DAFTAR CHAPTER</h3>
            </div>
            
            {/* Input Pencarian */}
            <div className="relative w-full md:w-64">
                <input 
                    type="text" 
                    placeholder="Cari chapter..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-darker border border-gray-700 text-sm text-white px-4 py-2 pl-9 rounded-full focus:outline-none focus:border-primary transition"
                />
                <Search size={14} className="absolute left-3 top-3 text-gray-500" />
            </div>
        </div>

        {/* Informasi Update Terakhir */}
        <div className="px-5 py-2 bg-darker/30 border-b border-gray-800 text-xs text-gray-400 text-right">
            Updated: {new Date(updatedAt).toLocaleDateString()}
        </div>

        {/* List Chapter */}
        <div className="max-h-[500px] overflow-y-auto custom-scrollbar bg-darker/50 p-3 space-y-2">
            {filteredChapters.length > 0 ? (
                filteredChapters.map((chap) => (
                    <Link 
                        href={`/read/${slug}/${chap.slug}`} 
                        key={chap._id} 
                        className="group flex justify-between items-center p-4 bg-card hover:bg-gray-800 rounded-lg border border-gray-800 hover:border-primary/50 transition-all duration-200"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-darker rounded-lg flex items-center justify-center text-gray-500 font-bold text-sm group-hover:bg-primary group-hover:text-white transition shadow-inner">
                                {chap.chapter_index}
                            </div>
                            <span className="text-sm md:text-base font-semibold text-gray-200 group-hover:text-primary transition">
                                Chapter {chap.title}
                            </span>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                            {new Date(chap.createdAt).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}
                        </span>
                    </Link>
                ))
            ) : (
                <div className="text-center py-10 text-gray-500 flex flex-col items-center">
                    <Search size={32} className="mb-2 opacity-50"/>
                    <p>Chapter tidak ditemukan.</p>
                </div>
            )}
        </div>
    </div>
  );
}