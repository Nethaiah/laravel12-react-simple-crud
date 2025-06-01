import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useForm } from "@inertiajs/react";
import InputError from "./input-error";
import { FormEventHandler, useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { type Post } from './posts-table'; // Make sure Post type is exported from posts-table.tsx

interface EditPostsFormProps extends React.HTMLAttributes<HTMLDivElement> {
    postToEdit: Post | null; // Post can be null if no post is selected
    onCancel?: () => void;
}

type PostFormValues = {
    title: string;
    body: string;
};

export default function EditPostsForm({ className, postToEdit, onCancel, ...props }: EditPostsFormProps) {
    const { data, setData, put, processing, errors, reset } = useForm<PostFormValues>({
        title: postToEdit?.title || '',
        body: postToEdit?.body || '',
    });

    // Effect to update form when postToEdit changes (e.g., user selects a different post to edit)
    useEffect(() => {
        if (postToEdit) {
            setData({
                title: postToEdit.title,
                body: postToEdit.body,
            });
        } else {
            reset();
        }
    }, [postToEdit, setData, reset])


    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!postToEdit || !postToEdit.id) {
            toast.error('Error: No post selected or Post ID is missing. Cannot update.');
            return;
        }
        put(route('posts.update', postToEdit.id), {
            onSuccess: () => {
                onCancel?.(); // Close modal
                toast.success('Post updated successfully', {
                    duration: 5000,
                    position: 'top-center',
                });
            },
            onError: () => {
                toast.error('Failed to update post', {
                    duration: 5000,
                    position: 'top-center',
                });
            }
        });
    };

    // Do not render the form if no post is selected for editing
    if (!postToEdit) {
        return null;
    }

    return (
        <div className={className} {...props}>
            <form onSubmit={handleSubmit}>
                <CardHeader className="mb-4">
                    <CardTitle>Edit Post</CardTitle>
                    <CardDescription>
                        Update the details for post: "{postToEdit.title}"
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="edit-title">Title</Label>
                            <Input
                                id="edit-title"
                                placeholder="Enter post title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                            />
                            <InputError message={errors.title} />
                        </div>
                        <div className="flex flex-col space-y-1.5 mb-4">
                            <Label htmlFor="edit-body">Body</Label>
                            <Textarea
                                id="edit-body"
                                placeholder="Enter post body"
                                rows={4}
                                value={data.body}
                                onChange={(e) => setData('body', e.target.value)}
                            />
                            <InputError message={errors.body} />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" type="button" onClick={onCancel}>Cancel</Button>
                    <Button type="submit" disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                        Update Post
                    </Button>
                </CardFooter>
            </form>
        </div>
    );
}
