import { getStaffById } from '@/lib/repositories/staff.repository';
import EditStaffClient from './client';

export default async function EditStaffPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const staff = await getStaffById(id);

    return <EditStaffClient staff={staff} />;
}
