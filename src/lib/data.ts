export interface BookComment {
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
  linkId: string;
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
  slug: string;
  title: string;
  author: string;
  authorBio: string;
  image: string;
  thumbnails: string[];
  price: string;
  originalPrice?: string;
  discount?: string;
  description: string;
  longDescription: string;
  rating: number;
  reviewsCount: number;
  languageOptions: string[];
  bookTypes: string[];
  stock: number;
  alternativeSellers: Seller[];
  comments: BookComment[];
  isTopSeller?: boolean;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  year: number;
  publisher: string;
  pageCount: number;
  isbn13: string;
  categories: string[];
  tags: string[];
  quote: string;
}

export type BookSort = 'popular' | 'rating' | 'newest' | 'title' | 'price-low' | 'price-high';

function uzs(amount: number) {
  return `${amount.toLocaleString('en-US')} UZS`;
}

function cover(isbn: string, size: 'M' | 'L' = 'L') {
  return `https://covers.openlibrary.org/b/isbn/${isbn}-${size}.jpg`;
}

export const booksData: Book[] = [
  {
    id: '1984',
    slug: '1984',
    title: '1984',
    author: 'George Orwell',
    authorBio: 'George Orwell totalitarianism, propaganda, and power structures haqida yozgan ingliz yozuvchisi.',
    image: cover('9780451524935'),
    thumbnails: [cover('9780451524935', 'M'), cover('9780141036144', 'M')],
    price: uzs(129000),
    originalPrice: uzs(149000),
    discount: '13% chegirma',
    description: 'Total nazorat, propaganda va haqiqat buzilishi haqidagi keskin distopik klassika.',
    longDescription:
      '1984 zamonaviy dunyoda siyosiy manipulyatsiya, kuzatuv, til va haqiqatning qanday boshqarilishi mumkinligini chuqur ko‘rsatadi. Kitob nafaqat syujet, balki g‘oya darajasida ham kuchli suhbat ochadi.',
    rating: 4.9,
    reviewsCount: 128,
    languageOptions: ['uzbek', 'english', 'russian'],
    bookTypes: ['paper', 'digital'],
    stock: 14,
    alternativeSellers: [
      { id: 101, store: 'Asaxiy Books', price: uzs(132000), img: cover('9780451524935', 'M'), linkId: '1984-asaxiy' },
      { id: 102, store: 'Azon Kitoblari', price: uzs(124000), img: cover('9780451524935', 'M'), linkId: '1984-azon' },
    ],
    comments: [
      { id: 1, user: 'Alijon Y.', text: 'Tilning qurol sifatida ishlatilishi haqidagi qismi juda ta’sirli.', date: '2 kun oldin' },
      { id: 2, user: 'Malika R.', text: 'Book club uchun ideal tanlov. Muhokama materiali juda ko‘p.', date: '1 hafta oldin' },
    ],
    isTopSeller: true,
    isFeatured: true,
    year: 1949,
    publisher: 'Secker & Warburg',
    pageCount: 328,
    isbn13: '9780451524935',
    categories: ['Dystopian', 'Political Fiction', 'Classic'],
    tags: ['Big Brother', 'Propaganda', 'Power', 'Surveillance'],
    quote: 'Freedom is the freedom to say that two plus two make four.',
  },
  {
    id: '1984-asaxiy',
    slug: '1984-asaxiy',
    title: '1984 (Asaxiy Nashri)',
    author: 'George Orwell',
    authorBio: 'George Orwell totalitarianism va siyosiy satira yo‘nalishidagi asarlari bilan mashhur.',
    image: cover('9780451524935'),
    thumbnails: [cover('9780451524935', 'M')],
    price: uzs(132000),
    description: 'Asaxiy do‘konidan taqdim etilgan qulay nashr.',
    longDescription: 'Yengil muqova va kitob klub muhokamalari uchun qulay format.',
    rating: 4.8,
    reviewsCount: 45,
    languageOptions: ['uzbek', 'russian'],
    bookTypes: ['paper'],
    stock: 5,
    alternativeSellers: [{ id: 100, store: 'KitobAI Rasmiy', price: uzs(129000), img: cover('9780451524935', 'M'), linkId: '1984' }],
    comments: [{ id: 1, user: 'Rustam', text: 'Yetkazib berish tez va qadoqlash sifatli.', date: '1 kun oldin' }],
    year: 1949,
    publisher: 'Asaxiy',
    pageCount: 328,
    isbn13: '9780451524935',
    categories: ['Dystopian', 'Classic'],
    tags: ['Paperback', 'Reader favorite'],
    quote: 'War is peace. Freedom is slavery. Ignorance is strength.',
  },
  {
    id: '1984-azon',
    slug: '1984-azon',
    title: '1984 (Azon Nashri)',
    author: 'George Orwell',
    authorBio: 'George Orwell siyosiy nazorat va erkinlik mavzulari bilan mashhur yozuvchi.',
    image: cover('9780451524935'),
    thumbnails: [cover('9780451524935', 'M')],
    price: uzs(124000),
    description: 'Narxi qulay, minimal dizayndagi nashr.',
    longDescription: 'Budget-friendly nashr bo‘lib, ayniqsa studentlar uchun mos.',
    rating: 4.7,
    reviewsCount: 89,
    languageOptions: ['uzbek'],
    bookTypes: ['paper'],
    stock: 20,
    alternativeSellers: [{ id: 100, store: 'KitobAI Rasmiy', price: uzs(129000), img: cover('9780451524935', 'M'), linkId: '1984' }],
    comments: [],
    year: 1949,
    publisher: 'Azon',
    pageCount: 328,
    isbn13: '9780451524935',
    categories: ['Dystopian', 'Classic'],
    tags: ['Affordable', 'Paperback'],
    quote: 'If you want a picture of the future, imagine a boot stamping on a human face.',
  },
  {
    id: 'sapiens',
    slug: 'sapiens',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    authorBio: 'Yuval Noah Harari tarix, texnologiya va insoniyatning evolyutsiyasi haqida yozuvchi tarixchi.',
    image: cover('9780062316110'),
    thumbnails: [cover('9780062316110', 'M'), cover('9780099590088', 'M')],
    price: uzs(159000),
    originalPrice: uzs(175000),
    discount: '9% chegirma',
    description: 'Insoniyat tarixini biologiya, iqtisod va madaniyat kesimida izohlaydigan bestseller.',
    longDescription:
      'Sapiens tarixiy faktlarni katta g‘oyalar bilan bog‘lab, insoniyat qanday qilib hozirgi holatga kelganini tushuntiradi. O‘qish uchun ham, muhokama uchun ham juda boy material beradi.',
    rating: 4.8,
    reviewsCount: 312,
    languageOptions: ['uzbek', 'english'],
    bookTypes: ['paper', 'digital'],
    stock: 8,
    alternativeSellers: [],
    comments: [{ id: 1, user: 'Sanjar', text: 'Dunyoni boshqacha ko‘rishga majbur qiladigan kitob.', date: '5 kun oldin' }],
    isTopSeller: true,
    isFeatured: true,
    year: 2011,
    publisher: 'Harper',
    pageCount: 498,
    isbn13: '9780062316110',
    categories: ['History', 'Non-fiction', 'Science'],
    tags: ['Civilization', 'Evolution', 'Ideas', 'Society'],
    quote: 'History is something that very few people have been doing while everyone else was ploughing fields.',
  },
  {
    id: 'atomic-habits',
    slug: 'atomic-habits',
    title: 'Atomic Habits',
    author: 'James Clear',
    authorBio: 'James Clear odatlar, tizimlar va barqaror o‘sish haqida yozadigan zamonaviy muallif.',
    image: cover('9780735211292'),
    thumbnails: [cover('9780735211292', 'M')],
    price: uzs(139000),
    originalPrice: uzs(154000),
    discount: '10% chegirma',
    description: 'Kichik odatlar orqali katta natijaga chiqish bo‘yicha amaliy qo‘llanma.',
    longDescription:
      'Atomic Habits kundalik hayotga mos, aniq va tizimli tavsiyalar beradi. Produktivlik, self-improvement va shaxsiy reja bo‘yicha foydalanuvchilar uchun juda foydali.',
    rating: 4.9,
    reviewsCount: 540,
    languageOptions: ['uzbek', 'english', 'russian'],
    bookTypes: ['paper', 'digital'],
    stock: 35,
    alternativeSellers: [],
    comments: [{ id: 1, user: 'Dilshod', text: 'Nazariyadan ko‘ra ko‘proq amaliy foyda berdi.', date: '3 kun oldin' }],
    isTopSeller: true,
    isNewArrival: true,
    year: 2018,
    publisher: 'Avery',
    pageCount: 320,
    isbn13: '9780735211292',
    categories: ['Self Help', 'Productivity', 'Non-fiction'],
    tags: ['Habits', 'Consistency', 'Growth', 'Systems'],
    quote: 'You do not rise to the level of your goals. You fall to the level of your systems.',
  },
  {
    id: 'alkimyogar',
    slug: 'alkimyogar',
    title: 'Alkimyogar',
    author: 'Paulo Coelho',
    authorBio: 'Paulo Coelho hayot ma’nosi, taqdir va ruhiy safar mavzularini yoritadigan braziliyalik muallif.',
    image: cover('9780061122415'),
    thumbnails: [cover('9780061122415', 'M')],
    price: uzs(99000),
    description: 'O‘z taqdirini izlashga chiqqan cho‘pon yigit haqida ruhiy va ramziy hikoya.',
    longDescription:
      'Alkimyogar ko‘plab kitobxonlar uchun motivatsion va ruhiy safar bo‘lib qolgan. Syujet sodda ko‘rinsa-da, undagi ramzlar va talqinlar chuqur.',
    rating: 4.7,
    reviewsCount: 205,
    languageOptions: ['uzbek', 'english', 'russian'],
    bookTypes: ['paper'],
    stock: 17,
    alternativeSellers: [],
    comments: [{ id: 1, user: 'Nafisa', text: 'Yengil o‘qiladi, lekin uzoq vaqt o‘ylantiradi.', date: '4 kun oldin' }],
    isTopSeller: true,
    isFeatured: true,
    year: 1988,
    publisher: 'HarperOne',
    pageCount: 208,
    isbn13: '9780061122415',
    categories: ['Adventure', 'Philosophy', 'Fiction'],
    tags: ['Destiny', 'Journey', 'Symbolism', 'Meaning'],
    quote: 'When you want something, all the universe conspires in helping you to achieve it.',
  },
  {
    id: 'the-hobbit',
    slug: 'the-hobbit',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    authorBio: 'J.R.R. Tolkien fantasy dunyosini shakllantirgan eng muhim mualliflardan biri.',
    image: cover('9780547928227'),
    thumbnails: [cover('9780547928227', 'M')],
    price: uzs(149000),
    description: 'Bilbo Bagginsning xazina, xavf va o‘sish bilan to‘la sarguzashti.',
    longDescription:
      'The Hobbit fantasy janriga kirish uchun juda yaxshi tanlov. Unda sarguzasht, xarakter rivoji va kuchli world-building uyg‘unlashgan.',
    rating: 4.9,
    reviewsCount: 418,
    languageOptions: ['english', 'russian'],
    bookTypes: ['paper', 'digital'],
    stock: 9,
    alternativeSellers: [],
    comments: [{ id: 1, user: 'Bekzod', text: 'World-building darajasi ajoyib.', date: '1 hafta oldin' }],
    isFeatured: true,
    year: 1937,
    publisher: 'Mariner Books',
    pageCount: 300,
    isbn13: '9780547928227',
    categories: ['Fantasy', 'Adventure', 'Classic'],
    tags: ['Middle-earth', 'Dragons', 'Quest', 'Coming of age'],
    quote: 'There is nothing like looking, if you want to find something.',
  },
  {
    id: 'to-kill-a-mockingbird',
    slug: 'to-kill-a-mockingbird',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    authorBio: 'Harper Lee adolat, axloq va jamiyat mavzulariga bag‘ishlangan kuchli klassik asari bilan mashhur.',
    image: cover('9780061120084'),
    thumbnails: [cover('9780061120084', 'M')],
    price: uzs(145000),
    description: 'Adolat, bolalik va jamiyatdagi stereotiplar haqida kuchli roman.',
    longDescription:
      'To Kill a Mockingbird insoniylik, vijdon va jamiyatdagi tengsizliklarni o‘tkir, ammo nozik ko‘rsatadi. Book clubs va maktab o‘qishlari uchun juda kuchli asar.',
    rating: 4.9,
    reviewsCount: 284,
    languageOptions: ['english', 'uzbek'],
    bookTypes: ['paper', 'digital'],
    stock: 12,
    alternativeSellers: [],
    comments: [{ id: 1, user: 'Saida', text: 'Atticus Finch obrazi juda kuchli yozilgan.', date: '6 kun oldin' }],
    isNewArrival: true,
    year: 1960,
    publisher: 'Harper Perennial',
    pageCount: 336,
    isbn13: '9780061120084',
    categories: ['Classic', 'Literary Fiction', 'Social Justice'],
    tags: ['Justice', 'Empathy', 'Childhood', 'Courage'],
    quote: 'You never really understand a person until you consider things from his point of view.',
  },
  {
    id: 'pride-and-prejudice',
    slug: 'pride-and-prejudice',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    authorBio: 'Jane Austen ijtimoiy kuzatuv va xarakterlar o‘rtasidagi nozik dinamika bilan mashhur ingliz yozuvchisi.',
    image: cover('9780141439518'),
    thumbnails: [cover('9780141439518', 'M')],
    price: uzs(119000),
    description: 'Munosabatlar, faxr va noto‘g‘ri tasavvurlar ustiga qurilgan klassik romantik roman.',
    longDescription:
      'Pride and Prejudice yengil va aqlli dialoglari, kuchli qahramonlari va ijtimoiy kuzatuvlari bilan o‘qishni yoqimli qiladi. Stil va xarakter tahlili uchun juda mos.',
    rating: 4.8,
    reviewsCount: 196,
    languageOptions: ['english', 'uzbek'],
    bookTypes: ['paper'],
    stock: 11,
    alternativeSellers: [],
    comments: [{ id: 1, user: 'Madina', text: 'Dialoglari va ritmi juda yoqimli.', date: '2 hafta oldin' }],
    year: 1813,
    publisher: 'Penguin Classics',
    pageCount: 480,
    isbn13: '9780141439518',
    categories: ['Classic', 'Romance', 'Literary Fiction'],
    tags: ['Marriage', 'Society', 'Character growth', 'Dialogue'],
    quote: 'I could easily forgive his pride, if he had not mortified mine.',
  },
  {
    id: 'little-prince',
    slug: 'little-prince',
    title: 'The Little Prince',
    author: 'Antoine de Saint-Exupéry',
    authorBio: 'Saint-Exupéry ramziy va falsafiy hikoya uslubi bilan dunyo bo‘ylab sevib o‘qiladigan muallif.',
    image: cover('9780156012195'),
    thumbnails: [cover('9780156012195', 'M')],
    price: uzs(92000),
    description: 'Soddalik ortiga yashirilgan chuqur hayotiy haqiqatlar haqidagi nozik qissa.',
    longDescription:
      'The Little Prince bolalar uchun ertakday tuyuladi, ammo kattalar uchun munosabatlar, mas’uliyat va hayot ma’nosi haqida juda kuchli asar hisoblanadi.',
    rating: 4.9,
    reviewsCount: 260,
    languageOptions: ['uzbek', 'english', 'russian'],
    bookTypes: ['paper', 'digital'],
    stock: 18,
    alternativeSellers: [],
    comments: [{ id: 1, user: 'Zarina', text: 'Har safar qayta o‘qiganda boshqa ma’no ochiladi.', date: '3 kun oldin' }],
    isTopSeller: true,
    year: 1943,
    publisher: 'Mariner Books',
    pageCount: 96,
    isbn13: '9780156012195',
    categories: ['Philosophy', 'Classic', 'Fable'],
    tags: ['Meaning', 'Relationships', 'Wonder', 'Wisdom'],
    quote: 'It is only with the heart that one can see rightly; what is essential is invisible to the eye.',
  },
];

export const bookCategories = Array.from(new Set(booksData.flatMap((book) => book.categories))).sort();

function parsePrice(price: string) {
  return Number(price.replace(/[^\d]/g, ''));
}

export function getBookById(id: string) {
  return booksData.find((book) => book.id === id || book.slug === id);
}

export function getFeaturedBooks(limit = 4) {
  return booksData.filter((book) => book.isFeatured).slice(0, limit);
}

export function getTopSellerBooks(limit = 4) {
  return booksData.filter((book) => book.isTopSeller).slice(0, limit);
}

export function getNewArrivalBooks(limit = 4) {
  return booksData
    .filter((book) => book.isNewArrival)
    .sort((left, right) => right.year - left.year)
    .slice(0, limit);
}

export function getRelatedBooks(bookId: string, limit = 4) {
  const currentBook = getBookById(bookId);
  if (!currentBook) return [];

  return booksData
    .filter((book) => book.id !== currentBook.id)
    .map((book) => {
      const sharedCategories = book.categories.filter((category) => currentBook.categories.includes(category)).length;
      const sharedTags = book.tags.filter((tag) => currentBook.tags.includes(tag)).length;
      return { book, score: sharedCategories * 3 + sharedTags };
    })
    .sort((left, right) => right.score - left.score || right.book.rating - left.book.rating)
    .slice(0, limit)
    .map((item) => item.book);
}

export function searchBooks(query: string, category = 'All', sort: BookSort = 'popular') {
  const normalizedQuery = query.trim().toLowerCase();

  const filtered = booksData.filter((book) => {
    const matchesQuery =
      normalizedQuery === '' ||
      `${book.title} ${book.author} ${book.description} ${book.categories.join(' ')} ${book.tags.join(' ')}`.toLowerCase().includes(normalizedQuery);

    const matchesCategory = category === 'All' || book.categories.includes(category);

    return matchesQuery && matchesCategory;
  });

  return filtered.sort((left, right) => {
    switch (sort) {
      case 'rating':
        return right.rating - left.rating;
      case 'newest':
        return right.year - left.year;
      case 'title':
        return left.title.localeCompare(right.title);
      case 'price-low':
        return parsePrice(left.price) - parsePrice(right.price);
      case 'price-high':
        return parsePrice(right.price) - parsePrice(left.price);
      case 'popular':
      default:
        return right.reviewsCount - left.reviewsCount;
    }
  });
}

export function getBookPromptSuggestions(book: Book) {
  return [
    `${book.title} kitobining asosiy g'oyalarini tushuntir`,
    `${book.author} bu asarda qanday uslub ishlatgan?`,
    `${book.title} bo'yicha book club uchun 5 ta savol tuz`,
  ];
}
