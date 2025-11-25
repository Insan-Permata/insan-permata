export interface NewsItem {
    id: string;
    title: string;
    imageUrl: string;
    date: Date;
    author: string;
    excerpt: string;
    content?: string; // Optional, only loaded for detail view
}
