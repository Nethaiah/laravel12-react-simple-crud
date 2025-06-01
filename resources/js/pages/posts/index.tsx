import * as React from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import PostsTable, { type Post } from '@/components/posts-table';
import AddPostsForm from '@/components/add-posts-form';
import EditPostsForm from '@/components/edit-posts-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';

interface PostsIndexProps {
  posts: Post[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Posts',
        href: '/posts',
    }
];

export default function PostsIndex({ posts }: PostsIndexProps) {
    const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
    const [selectedPost, setSelectedPost] = React.useState<Post | null>(null);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Posts" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Button className='w-fit' onClick={() => setIsAddModalOpen(true)}>
                    Create Post
                </Button>
                <PostsTable
                    posts={posts}
                    onEditClick={(post) => {
                        setSelectedPost(post);
                        setIsEditModalOpen(true);
                    }}
                />
            </div>
            {/* Add Post Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <AddPostsForm onCancel={() => setIsAddModalOpen(false)} />
            </DialogContent>
        </Dialog>

        {/* Edit Post Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={(open) => {
            setIsEditModalOpen(open);
            if (!open) setSelectedPost(null);
        }}>
            <DialogContent className="sm:max-w-[425px]">
                <EditPostsForm
                    postToEdit={selectedPost}
                    onCancel={() => setIsEditModalOpen(false)}
                />
            </DialogContent>
        </Dialog>
        </AppLayout>
    );
}
