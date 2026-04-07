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
    image: "/images/books/1984.png",
    thumbnails: [
      "/images/books/1984.png",
      "/images/books/1984.png",
      "/images/books/1984.png"
    ],
    price: "120,000 UZS",
    originalPrice: "150,000 UZS",
    discount: "20% Chegirma",
    description: "George Orwellning mashhur antiutopik asari. Erkinlik, haqiqat va inson irodasi haqidagi o'simlik asar.",
    rating: 4.9,
    reviewsCount: 128,
    languageOptions: ["uzbek", "english", "russian"],
    bookTypes: ["paper", "digital"],
    stock: 14,
    isTopSeller: true,
    alternativeSellers: [
      { id: 101, store: "Asaxiy Books", price: "125,000 UZS", img: "/images/books/1984.png", linkId: "1-asaxiy" },
      { id: 102, store: "Azon Kitoblari", price: "115,000 UZS", img: "/images/books/1984.png", linkId: "1-azon" }
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
    image: "/images/books/1984.png",
    thumbnails: [
      "/images/books/1984.png"
    ],
    price: "125,000 UZS",
    description: "Asaxiy do'konidan taqdim etilgan 1984 kitobi.",
    rating: 4.8,
    reviewsCount: 45,
    languageOptions: ["uzbek", "russian"],
    bookTypes: ["paper"],
    stock: 5,
    alternativeSellers: [
      { id: 100, store: "KitobAI Rasmiy", price: "120,000 UZS", img: "/images/books/1984.png", linkId: "1" }
    ],
    comments: [
      { id: 1, user: "Rustam", text: "Yetkazib berish tez bo'ldi.", date: "1 kun oldin" }
    ]
  },
  {
    id: "1-azon",
    title: "1984 (Azon Nashri)",
    author: "George Orwell",
    image: "/images/books/1984.png",
    thumbnails: [
      "/images/books/1984.png"
    ],
    price: "115,000 UZS",
    description: "Azon do'konidan taqdim etilgan arzonroq nashr.",
    rating: 4.7,
    reviewsCount: 89,
    languageOptions: ["uzbek"],
    bookTypes: ["paper"],
    stock: 20,
    alternativeSellers: [
      { id: 100, store: "KitobAI Rasmiy", price: "120,000 UZS", img: "/images/books/1984.png", linkId: "1" }
    ],
    comments: []
  },
  {
    id: "2",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    image: "/images/books/sapiens.png",
    thumbnails: [
        "/images/books/sapiens.png",
        "/images/books/sapiens.png"
    ],
    price: "150,000 UZS",
    description: "Insoniyat tarixi haqida qisqacha ma'lumot. Biz qanday qilib yer yuzida hokimiyatga erishdik?",
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
    image: "/images/books/atomic_habits.png",
    thumbnails: [
        "/images/books/atomic_habits.png",
        "/images/books/atomic_habits.png"
    ],
    price: "135,000 UZS",
    description: "Kichik odatlar orqali ulkan natijalarga erishish yo'llari.",
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
    image: "/images/books/alkimyogar.png",
    thumbnails: [
        "/images/books/alkimyogar.png",
        "/images/books/alkimyogar.png"
    ],
    price: "95,000 UZS",
    description: "O'z orzularingiz ortidan borish va hayotiy sarguzashtlar haqida falsafiy asar.",
    rating: 4.6,
    reviewsCount: 89,
    languageOptions: ["uzbek", "russian"],
    bookTypes: ["paper"],
    stock: 20,
    alternativeSellers: [],
    comments: []
  }
];

export const getBookById = (id: string): Book | undefined => {
  return booksData.find(book => book.id === id);
};
