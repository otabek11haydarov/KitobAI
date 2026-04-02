export interface Comment {
  id: number;
  user: string;
  text: string;
  date: string;
}

export interface Seller {
  id: number;
  store: string;
  price: string;
  img: string;
  linkId: string; // The ID of the book that corresponds to this seller's listing, so we can route to it
}

export interface ChatSession {
  id: string;
  bookName: string;
  image?: string;
  messages: { role: 'ai' | 'user'; text: string }[];
  createdAt: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  image: string;
  thumbnails: string[];
  price: string;
  originalPrice?: string;
  discount?: string;
  description: string;
  rating: number;
  reviewsCount: number;
  languageOptions: string[];
  bookTypes: string[];
  stock: number;
  alternativeSellers: Seller[];
  comments: Comment[];
  isTopSeller?: boolean;
}

export const booksData: Book[] = [
  {
    id: "1",
    title: "1984",
    author: "George Orwell",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop",
    thumbnails: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1589998059171-987d8870337c?q=80&w=400&auto=format&fit=crop"
    ],
    price: "120,000 UZS",
    originalPrice: "150,000 UZS",
    discount: "20% Chegirma",
    description: "Classic dystopian novel. Kitoblarni tahlil qilish uchun shaxsiy intellektual yordamchi bo'lishi mumkin bo'lgan eng yaxshi asarlardan biri.",
    rating: 4.9,
    reviewsCount: 128,
    languageOptions: ["uzbek", "english", "russian"],
    bookTypes: ["paper", "digital"],
    stock: 14,
    isTopSeller: true,
    alternativeSellers: [
      { id: 101, store: "Asaxiy Books", price: "125,000 UZS", img: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=100&auto=format&fit=crop", linkId: "1-asaxiy" },
      { id: 102, store: "Azon Kitoblari", price: "115,000 UZS", img: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=100&auto=format&fit=crop", linkId: "1-azon" }
    ],
    comments: [
      { id: 1, user: "Alijon Y.", text: "Ajoyib kitob, hammaga tavsiya qilaman!", date: "2 kun oldin" },
      { id: 2, user: "Malika R.", text: "Kitobning sifati juda zo'r ekan.", date: "1 hafta oldin" }
    ]
  },
  {
    id: "1-asaxiy",
    title: "1984 (Asaxiy Nashri)",
    author: "George Orwell",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop",
    thumbnails: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop"
    ],
    price: "125,000 UZS",
    description: "Asaxiy do'konidan taqdim etilgan 1984 kitobi.",
    rating: 4.8,
    reviewsCount: 45,
    languageOptions: ["uzbek", "russian"],
    bookTypes: ["paper"],
    stock: 5,
    alternativeSellers: [
      { id: 100, store: "KitobAI Rasmiy", price: "120,000 UZS", img: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=100&auto=format&fit=crop", linkId: "1" }
    ],
    comments: [
      { id: 1, user: "Rustam", text: "Yetkazib berish tez bo'ldi.", date: "1 kun oldin" }
    ]
  },
  {
    id: "1-azon",
    title: "1984 (Azon Nashri)",
    author: "George Orwell",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop",
    thumbnails: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop"
    ],
    price: "115,000 UZS",
    description: "Azon do'konidan taqdim etilgan arzonroq nashr.",
    rating: 4.7,
    reviewsCount: 89,
    languageOptions: ["uzbek"],
    bookTypes: ["paper"],
    stock: 20,
    alternativeSellers: [
      { id: 100, store: "KitobAI Rasmiy", price: "120,000 UZS", img: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=100&auto=format&fit=crop", linkId: "1" }
    ],
    comments: []
  },
  {
    id: "2",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop",
    thumbnails: [
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=400&auto=format&fit=crop"
    ],
    price: "150,000 UZS",
    description: "A brief history of humankind.",
    rating: 4.8,
    reviewsCount: 312,
    languageOptions: ["uzbek", "english"],
    bookTypes: ["paper", "digital"],
    stock: 8,
    isTopSeller: true,
    alternativeSellers: [],
    comments: [
      { id: 1, user: "Sanjar", text: "Dunyoni tushunish uchun eng zo'r kitob.", date: "5 kun oldin" }
    ]
  },
  {
    id: "3",
    title: "Atomic Habits",
    author: "James Clear",
    image: "https://images.unsplash.com/photo-1589998059171-987d8870337c?q=80&w=800&auto=format&fit=crop",
    thumbnails: [
      "https://images.unsplash.com/photo-1589998059171-987d8870337c?q=80&w=400&auto=format&fit=crop"
    ],
    price: "135,000 UZS",
    description: "Build good habits & break bad ones.",
    rating: 4.9,
    reviewsCount: 540,
    languageOptions: ["uzbek", "english", "russian"],
    bookTypes: ["paper", "digital"],
    stock: 35,
    isTopSeller: true,
    alternativeSellers: [],
    comments: []
  },
  {
    id: "4",
    title: "Alkimyogar",
    author: "Paulo Coelho",
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=800&auto=format&fit=crop",
    thumbnails: [
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=400&auto=format&fit=crop"
    ],
    price: "95,000 UZS",
    description: "A journey of self-discovery.",
    rating: 4.6,
    reviewsCount: 89,
    languageOptions: ["uzbek", "russian"],
    bookTypes: ["paper"],
    stock: 2,
    alternativeSellers: [],
    comments: []
  }
];

export const getBookById = (id: string): Book | undefined => {
  return booksData.find(book => book.id === id);
};
