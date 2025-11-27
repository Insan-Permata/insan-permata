import { getNewsById } from '@/lib/repositories/news.repository';
import EditNewsClient from './client';

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const article = await getNewsById(id);

    return <EditNewsClient article={article} />;
}
