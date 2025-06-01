import * as React from "react";

import { Button } from "@/components/ui/button";
import {
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
import { FormEventHandler } from "react";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

interface AddPostsFormProps extends React.HTMLAttributes<HTMLDivElement> {
  onCancel?: () => void;
}

type PostForm = {
    title: string;
    body: string;
};

export default function AddPostsForm({ className, onCancel, ...props }: AddPostsFormProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<PostForm>>({
        title: '',
        body: '',
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('posts.store'), {
            onSuccess: () => {
                reset('title', 'body');
                onCancel?.();
                toast.success('Post created successfully', {
                    duration: 5000,
                    position: 'top-center',
                });
            },
            onError: () => {
                toast.error('Failed to create post', {
                    duration: 5000,
                    position: 'top-center',
                });
            }
        });
    };

    return (
        <div className={className} {...props}>
            <form onSubmit={handleSubmit}>
                <CardHeader className="mb-4">
                    <CardTitle>Create New Post</CardTitle>
                    <CardDescription>
                        Fill in the details below to create a new post.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" placeholder="Enter post title" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                            <InputError message={errors.title} />
                        </div>
                        <div className="flex flex-col space-y-1.5 mb-4">
                            <Label htmlFor="body">Body</Label>
                            <Textarea id="body" placeholder="Enter post body" rows={4} value={data.body} onChange={(e) => setData('body', e.target.value)} />
                            <InputError message={errors.body} />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" type="button" onClick={onCancel}>Cancel</Button>
                    <Button type="submit" disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                        Create Post
                    </Button>
                </CardFooter>
            </form>
        </div>
    );
}
