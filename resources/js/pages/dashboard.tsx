import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import AllPostsTable from '@/components/all-posts-table';
import { type PostWithUser } from '@/components/all-posts-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    }
];

interface DashboardProps {
    postsWithUserData: PostWithUser[];
}

export default function Dashboard({ postsWithUserData }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <AllPostsTable posts={postsWithUserData} />
            </div>
        </AppLayout>
    );
}
