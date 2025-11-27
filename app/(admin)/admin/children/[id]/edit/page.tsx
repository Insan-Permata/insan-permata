import { getChildById } from '@/lib/repositories/children.repository';
import EditChildClient from './client';

export default async function EditChildPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const child = await getChildById(id);

    return <EditChildClient child={child} />;
}
