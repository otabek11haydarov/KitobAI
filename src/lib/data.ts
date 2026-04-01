export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  rating: number;
  quality: 'Excellent' | 'Good' | 'Fair';
  source: string;
  image: string;
  isAIRecommended?: boolean;
}

export const BOOKS: Book[] = [
  {
    id: '1',
    title: '1984',
    author: 'George Orwell',
    price: 45000,
    rating: 4.8,
    quality: 'Excellent',
    source: 'Asaxiy Books',
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: '2',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    price: 85000,
    rating: 4.9,
    quality: 'Excellent',
    source: 'Factor Books',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60',
    isAIRecommended: true
  },
  {
    id: '3',
    title: 'Alkimyogar',
    author: 'Paulo Coelho',
    price: 32000,
    rating: 4.5,
    quality: 'Good',
    source: 'Bookuz',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format&fit=crop&q=60'
  }
];
