# Laravel 12 + React Simple CRUD Application

This project demonstrates a modern full-stack web application implementing CRUD (Create, Read, Update, Delete) operations using Laravel 12 as the backend framework and React for the frontend, connected via Inertia.js.

## Technologies Used

- **Backend**: Laravel 12
- **Frontend**: React with TypeScript
- **Data Passing**: Inertia.js
- **UI Framework**: Tailwind CSS with ShadCN UI components
- **Database**: PostgreSQL
- **Form Handling**: Inertia.js useForm hook
- **Notifications**: Sonner Toast library

## Architecture Overview

### Backend Structure

The application follows Laravel's MVC architecture:

- **Routes**: Defined in `routes/posts.php` using Laravel's resource routing
- **Controllers**: `PostsController.php` handles all CRUD operations
- **Models**: `Posts.php` model with appropriate fillable fields
- **Validation**: Form requests and inline validation with custom rules
- **Database**: Migrations and seeders for the posts table

### Frontend Structure

The frontend utilizes React with TypeScript and is organized as follows:

- **Pages**: Main page components in `resources/js/pages/`
- **Components**: Reusable UI components in `resources/js/components/`
- **Layouts**: Layout components in `resources/js/layouts/`
- **Types**: TypeScript type definitions throughout the codebase

### Data Flow

1. React components make requests via Inertia.js
2. Laravel controllers process requests and return responses
3. Inertia.js renders the appropriate React components with the data
4. UI updates are handled through React state and props

## CRUD Functionality

### 1. Creating Posts

#### Components Involved:
- `resources/js/pages/posts/index.tsx` - Contains the "Create Post" button and modal
- `resources/js/components/add-posts-form.tsx` - Form component for adding posts

#### Controller Method:
```php
// PostsController.php
public function store(Request $request)
{
    $request->validate([
        'title' => ['required', 'string', 'max:25', new Clean()],
        'body' => ['required', 'string', 'max:255', new Clean()],
    ]);

    $post = Posts::create($request->all());
    return redirect()->route('posts.index');
}
```

#### React Component:
```tsx
// add-posts-form.tsx (key parts)
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
```

### 2. Reading Posts

#### Components Involved:
- `resources/js/pages/posts/index.tsx` - Main page that displays posts
- `resources/js/components/posts-table.tsx` - Table component for displaying posts

#### Controller Method:
```php
// PostsController.php
public function index()
{
    return Inertia::render('posts/index', [
        'posts' => Posts::latest()->get(),
    ]);
}
```

#### React Component:
```tsx
// posts-table.tsx (key parts)
export default function PostsTable({ posts, onEditClick }: PostsTableProps) {
  // Table setup with TanStack Table
  const table = useReactTable({
    data: posts,
    columns,
    // ...table configuration
  });

  // Table rendering with search, pagination, etc.
}
```

### 3. Updating Posts

#### Components Involved:
- `resources/js/pages/posts/index.tsx` - Contains the edit modal
- `resources/js/components/edit-posts-form.tsx` - Form component for editing posts
- `resources/js/components/posts-table.tsx` - Contains the edit action button

#### Controller Method:
```php
// PostsController.php
public function update(Request $request, Posts $post)
{
    $request->validate([
        'title' => ['required', 'string', 'max:25', new Clean()],
        'body' => ['required', 'string', 'max:255', new Clean()],
    ]);

    $post->update($request->all());
    return redirect()->route('posts.index');
}
```

#### React Components:
```tsx
// edit-posts-form.tsx (key parts)
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
```

```tsx
// posts-table.tsx (edit action)
<DropdownMenuItem onSelect={(e) => {
    e.preventDefault();
    onEditClick?.(post);
}}>
    Edit Post
</DropdownMenuItem>
```

### 4. Deleting Posts

#### Components Involved:
- `resources/js/components/posts-table.tsx` - Contains delete button and confirmation dialog

#### Controller Method:
```php
// PostsController.php
public function destroy(Posts $post)
{
    $post->delete();
    return redirect()->route('posts.index');
}
```

#### React Component:
```tsx
// posts-table.tsx (key parts)
const handleDeletePost = () => {
  if (!postToDelete || !postToDelete.id) return;
  
  router.delete(route('posts.destroy', postToDelete.id), {
    onSuccess: () => {
      toast.success('Post deleted successfully', {
        duration: 5000,
        position: 'top-center',
      });
      setIsDeleteDialogOpen(false);
      setPostToDelete(null);
    },
    onError: () => {
      toast.error('Failed to delete post', {
        duration: 5000,
        position: 'top-center',
      });
    }
  });
};
```

## Form Handling with Inertia.js

The application uses Inertia.js's `useForm` hook for form state management:

1. Form state is initialized with default values
2. Input changes update the form state via `setData`
3. Form submission is handled by Inertia methods (`post`, `put`, `delete`)
4. Success and error callbacks manage UI state (closing modals, showing notifications)

Example:
```tsx
const { data, setData, post, processing, errors, reset } = useForm<Required<PostForm>>({
    title: '',
    body: '',
});
```

## Modal Management

Modals are implemented using ShadCN UI's Dialog component:

1. Modal visibility is controlled by React state variables
2. Opening a modal is triggered by user actions (clicking buttons)
3. Closing a modal happens on:
   - Explicit cancel button click
   - Successful form submission
   - Clicking outside the modal (configurable)

Example:
```tsx
const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
const [selectedPost, setSelectedPost] = React.useState<Post | null>(null);

// Opening modal
<Button onClick={() => {
  setSelectedPost(post);
  setIsEditModalOpen(true);
}}>
  Edit
</Button>

// Modal component
<Dialog open={isEditModalOpen} onOpenChange={(open) => {
  setIsEditModalOpen(open);
  if (!open) setSelectedPost(null); 
}}>
  <DialogContent>
    <EditPostsForm 
      postToEdit={selectedPost} 
      onCancel={() => setIsEditModalOpen(false)}
    />
  </DialogContent>
</Dialog>
```

## Validation

The application uses Laravel's validation system with custom rules:

- **Backend Validation**: Using Laravel's `validate` method in controllers
- **Frontend Validation**: Displaying validation errors returned from the backend
- **Custom Rules**: Using the `Clean` rule from the `jonpurvis/squeaky` package to sanitize input

```php
$request->validate([
    'title' => ['required', 'string', 'max:25', new Clean()],
    'body' => ['required', 'string', 'max:255', new Clean()],
]);
```

## Additional Features

### Toast Notifications

The application uses the Sonner toast library to provide feedback to users:

```tsx
toast.success('Post created successfully', {
    duration: 5000,
    position: 'top-center',
});
```

### Loading States

Form submission loading states are handled using the `processing` state from Inertia's `useForm`:

```tsx
<Button type="submit" disabled={processing}>
    {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
    Create Post
</Button>
```

### Confirmation Dialogs

Delete operations use confirmation dialogs to prevent accidental deletions:

```tsx
<AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction asChild>
        <Button onClick={handleDeletePost} variant="destructive">
          Delete Post
        </Button>
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

## Database Setup

### Migrations

The database schema is defined in migration files:

```php
// create_posts_table.php
public function up(): void
{
    Schema::create('posts', function (Blueprint $table) {
        $table->id();
        $table->string('title');
        $table->text('body');
        $table->timestamps();
    });
}
```

### Seeders

The application includes seeders to populate the database with test data:

```php
// DatabaseSeeder.php
public function run(): void
{
    Posts::factory()->count(20)->create([
        'title' => fake()->sentence(6),
        'body' => fake()->paragraph(10),
    ]);
}
```

To run migrations and seeders:

```bash
php artisan migrate:fresh --seed
```

## Running the Application

1. Clone the repository
2. Install PHP dependencies: `composer install`
3. Install JavaScript dependencies: `npm install`
4. Set up your `.env` file with database credentials
5. Run migrations and seeders: `php artisan migrate:fresh --seed`
6. Build assets: `npm run dev`
7. Start the server: `php artisan serve`
8. Visit `http://localhost:8000` in your browser

## Data Flow and State Management Approach

### CRUD Operation Patterns

#### Data Passing

The application uses several patterns for passing data between components:

1. **Props Drilling**: Data is passed down from parent to child components
   ```tsx
   // posts/index.tsx passing selected post to EditPostsForm
   <EditPostsForm 
       postToEdit={selectedPost} 
       onCancel={() => setIsEditModalOpen(false)}
   />
   ```

2. **Callback Functions**: Child components communicate with parents via callback props
   ```tsx
   // posts-table.tsx triggering edit in parent
   <DropdownMenuItem onSelect={(e) => {
       e.preventDefault();
       onEditClick?.(post);
   }}>
       Edit Post
   </DropdownMenuItem>
   ```

3. **Local State Management**: React's useState for component-specific state
   ```tsx
   const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
   const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
   const [selectedPost, setSelectedPost] = React.useState<Post | null>(null);
   ```

#### ID Handling for Edit/Delete Operations

1. **Edit Flow**:
   - User clicks "Edit" in the posts table
   - The complete post object is stored in state: `setSelectedPost(post)`
   - Modal opens with the form pre-populated with post data
   - On submit, the ID is extracted from the post object: `put(route('posts.update', postToEdit.id), ...)`

2. **Delete Flow**:
   - User clicks "Delete" in the posts table
   - The post to delete is stored in state: `setPostToDelete(post)`
   - Confirmation dialog opens
   - On confirm, the ID is extracted from the stored post: `router.delete(route('posts.destroy', postToDelete.id), ...)`

### Data Display Techniques

1. **Table Rendering**: Using TanStack Table (React Table) for advanced table features
   ```tsx
   // Mapping over table rows
   {table.getRowModel().rows.map((row) => (
     <TableRow key={row.id}>
       {row.getVisibleCells().map((cell) => (
         <TableCell key={cell.id}>
           {flexRender(cell.column.columnDef.cell, cell.getContext())}
         </TableCell>
       ))}
     </TableRow>
   ))}
   ```

2. **Conditional Rendering**: Showing different UI based on state
   ```tsx
   // Only render edit form if a post is selected
   if (!postToEdit) {
     return null;
   }
   ```

3. **Data Transformation**: Processing data before display
   ```tsx
   // Truncating long text in table cells
   cell: ({ row }) => (
     <div className="truncate max-w-md">{row.getValue("body")}</div>
   )
   ```

### Modal and Dialog Management

1. **Modal State**: Each modal has its own open/close state
   ```tsx
   const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
   ```

2. **Cleanup on Close**: Resetting state when modals close
   ```tsx
   <Dialog open={isEditModalOpen} onOpenChange={(open) => {
       setIsEditModalOpen(open);
       if (!open) setSelectedPost(null); 
   }}>
   ```

3. **Confirmation Dialogs**: Using AlertDialog for destructive actions
   ```tsx
   <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
     {/* Dialog content */}
   </AlertDialog>
   ```

## Conclusion

This Laravel 12 + React application demonstrates a modern approach to building full-stack web applications with a clean separation of concerns. The combination of Laravel's robust backend capabilities with React's dynamic frontend provides an excellent foundation for building complex web applications.
