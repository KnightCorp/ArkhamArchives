import React, { useState } from "react";
import { Book, Upload, Share2, Headphones, Plus, Search } from "lucide-react";
interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  genre: string;
  description: string;
  reads: number;
  shares: number;
  format: string;
}
import { useNavigate } from "react-router-dom";
const Archives = () => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const navigate = useNavigate();

  const books = [
    {
      id: 1,
      title: "The Midnight Chronicles",
      author: "Victoria Blackwood",
      cover:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600",
      genre: "Gothic Fiction",
      description: "A tale of mystery and darkness in Victorian London",
      reads: 1250,
      shares: 324,
      format: "epub",
    },
    {
      id: 2,
      title: "Echoes in the Dark",
      author: "Marcus Ravencroft",
      cover:
        "https://images.unsplash.com/photo-1603162109209-4d12e5ee6e34?w=400&h=600",
      genre: "Horror",
      description: "Supernatural encounters in an abandoned mansion",
      reads: 890,
      shares: 156,
      format: "pdf",
    },
    {
      id: 3,
      title: "Crimson Shadows",
      author: "Eleanor Night",
      cover:
        "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400&h=600",
      genre: "Dark Fantasy",
      description: "A journey through realms of darkness and light",
      reads: 2100,
      shares: 543,
      format: "epub",
    },
  ];
  const handleModalClose = () => {
    setSelectedBook(null);
  };

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleModalClose();
    }
  };

  return (
    <div className="relative min-h-screen bg-black">
      {/* Smoke Effect Background */}
      <div className="fixed inset-0 bg-[url('https://images.unsplash.com/photo-1557683311-eeb2f49a8532?w=1920')] bg-cover bg-center opacity-5">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-crimson text-silver tracking-wider mb-4">
            The Archives
          </h1>
          <p className="text-silver/60 font-crimson italic">
            Where stories find their eternal rest
          </p>
        </div>

        {/* Search and Upload */}
        <div className="flex space-x-4 mb-12">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-silver/50" />
            <input
              type="text"
              placeholder="Search the archives..."
              className="w-full bg-black/50 border border-silver/30 rounded-lg pl-12 pr-4 py-3 text-silver placeholder-silver/30 focus:outline-none focus:border-silver/50 transition-all font-crimson"
            />
          </div>
          <button className="px-6 py-2 bg-black/50 border border-crimson/30 rounded-lg text-crimson hover:bg-crimson/10 transition-all flex items-center space-x-2 font-crimson">
            <Upload className="w-5 h-5" />
            <span>Upload</span>
          </button>
        </div>

        {/* Categories */}
        <div className="flex space-x-4 mb-12 overflow-x-auto pb-4">
          <button className="px-6 py-2 bg-black/50 border border-silver/30 rounded-lg text-silver hover:bg-silver/10 transition-all whitespace-nowrap">
            All Genres
          </button>
          <button className="px-6 py-2 bg-black/50 border border-silver/30 rounded-lg text-silver hover:bg-silver/10 transition-all whitespace-nowrap">
            Gothic Fiction
          </button>
          <button className="px-6 py-2 bg-black/50 border border-silver/30 rounded-lg text-silver hover:bg-silver/10 transition-all whitespace-nowrap">
            Horror
          </button>
          <button className="px-6 py-2 bg-black/50 border border-silver/30 rounded-lg text-silver hover:bg-silver/10 transition-all whitespace-nowrap">
            Dark Fantasy
          </button>
          <button className="px-6 py-2 bg-black/50 border border-silver/30 rounded-lg text-silver hover:bg-silver/10 transition-all whitespace-nowrap flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>

        {/* Book Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {books.map((book) => (
            <div
              key={book.id}
              onClick={() => setSelectedBook(book)}
              className="group cursor-pointer"
            >
              <div className="bg-black/60 rounded-lg overflow-hidden border border-silver/20 transition-all hover:border-silver/40">
                <div className="relative aspect-[2/3]">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl text-silver font-crimson mb-2">
                      {book.title}
                    </h3>
                    <p className="text-silver/70 font-crimson">{book.author}</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between text-sm text-silver/70">
                    <span>{book.genre}</span>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Book className="w-4 h-4 mr-1" />
                        <span>{book.reads}</span>
                      </div>
                      <div className="flex items-center">
                        <Share2 className="w-4 h-4 mr-1" />
                        <span>{book.shares}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Book Modal */}
        {selectedBook && (
          <div
            className="fixed inset-0 bg-black/90 flex items-center justify-center p-8 z-50"
            onClick={handleModalClick}
          >
            <div
              className="bg-black/80 rounded-lg w-full max-w-4xl border border-silver/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex p-8 gap-8">
                <div className="w-1/3">
                  <img
                    src={selectedBook.cover}
                    alt={selectedBook.title}
                    className="w-full rounded-lg"
                  />
                </div>
                <div className="w-2/3">
                  <button
                    onClick={handleModalClose}
                    className="absolute top-4 right-4 text-silver/60 hover:text-silver w-8 h-8 flex items-center justify-center bg-black/50 rounded-full"
                  >
                    ×
                  </button>
                  <h2 className="text-3xl text-silver font-crimson mb-2">
                    {selectedBook.title}
                  </h2>
                  <p className="text-silver/70 font-crimson mb-4">
                    {selectedBook.author}
                  </p>
                  <p className="text-silver/60 mb-6">
                    {selectedBook.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div>
                      <h3 className="text-silver font-crimson mb-2">Format</h3>
                      <p className="text-silver/70 uppercase">
                        {selectedBook.format}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-silver font-crimson mb-2">Genre</h3>
                      <p className="text-silver/70">{selectedBook.genre}</p>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button className="flex-1 py-3 bg-crimson/10 text-crimson border border-crimson/30 rounded-lg hover:bg-crimson/20 transition-all font-crimson flex items-center justify-center space-x-2">
                      <Book className="w-5 h-5" />
                      <span>Read Now</span>
                    </button>
                    <button className="flex-1 py-3 bg-black/50 text-silver border border-silver/30 rounded-lg hover:bg-silver/10 transition-all font-crimson flex items-center justify-center space-x-2">
                      <Headphones className="w-5 h-5" />
                      <span>Listen</span>
                    </button>
                    <button className="px-6 py-3 bg-black/50 text-silver border border-silver/30 rounded-lg hover:bg-silver/10 transition-all font-crimson">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Archives;
