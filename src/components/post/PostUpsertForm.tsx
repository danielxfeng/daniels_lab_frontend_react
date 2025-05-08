import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosResponse } from 'axios';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CreateOrUpdatePostBodySchema, PostResponseSchema } from '@/schema/schema_post';
import type { CreateOrUpdatePostBody, PostResponse } from '@/schema/schema_post';
import MotionTextButton from '../motion_components/MotionTextButton';
import { createPost, updatePost } from '@/services/services_posts';
import { throwWithValidationErr } from '@/lib/throwWithErr';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';

// A helper function to get the slug from the response
const getSlug = (isCreate: boolean, res: AxiosResponse<PostResponse | undefined>) => {
  if (isCreate) return res.headers.location.split('/').pop();
  const validatedBody = PostResponseSchema.safeParse(res.data);
  if (!validatedBody.success)
    return throwWithValidationErr(
      'validate post response error',
      JSON.stringify(validatedBody.error),
    );
  return validatedBody.data.slug;
};

// A form to create or update a post
// The tags filed is not matched the schema in backend
const PostUpsertForm = ({ post }: { post: PostResponse | null }) => {
  const navigate = useNavigate();
  const form = useForm<CreateOrUpdatePostBody>({
    resolver: zodResolver(CreateOrUpdatePostBodySchema),
    mode: 'onTouched',
    defaultValues: {
      title: post?.title ?? '',
      markdown: post?.markdown ?? '',
      coverUrl: post?.cover ?? '',
      tags: post?.tags ?? [],
      createdAt: post?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  });

  // init the form
  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = form;

  const onSubmit = async (data: CreateOrUpdatePostBody) => {
    const isCreate = !post;
    try {
      const res = isCreate ? await createPost(data) : await updatePost(post!.id, data);

      // Validate the response, and redirect to the post page
      const slug = getSlug(!post, res);
      toast(`Post ${isCreate ? 'created' : 'updated'} successfully!`);
      setTimeout(() => {
        navigate(`/blog/posts/${slug}`);
      }, 1000);
    } catch (error) {
      console.error('Error submitting post:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className='mt-6 w-full max-w-2xl mx-auto'>
        <fieldset disabled={isSubmitting} className='flex flex-col gap-6'>
          {/* Title */}
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder='Post title' {...field} className='border-muted ring-1 bg-muted' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Cover URL */}
          <FormField
            control={form.control}
            name='coverUrl'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cover Image URL</FormLabel>
                <FormControl>
                  <Input placeholder='https://your.cover.url' {...field} className='border-muted ring-1 bg-muted' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Markdown */}
          <FormField
            control={form.control}
            name='markdown'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Markdown Content</FormLabel>
                <FormControl>
                  <Textarea placeholder='Write in markdown...' {...field} className='border-muted ring-1 bg-muted min-h-96' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 
          Post Creation Date
          This is the authored creation date (not DB timestamp).
          It's useful for importing articles from external platforms or backups.
          ISO string is used internally, and converted to local Date for picker.
          */}
          <FormField
            control={form.control}
            name='createdAt'
            render={({ field }) => {
              const valueAsDate = field.value ? new Date(field.value) : undefined;
              return (
                <FormItem className='flex flex-col'>
                  <FormLabel>Post creation date</FormLabel>
                  <FormDescription>
                    Used to record when this article was originally written.
                  </FormDescription>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value ? (
                            valueAsDate ? format(valueAsDate, 'yyyy-MM-dd HH:mm') : ''
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0'>
                      <Calendar
                        mode='single'
                        selected={valueAsDate}
                        onSelect={(date) => field.onChange(date?.toISOString())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          {/*
          Post Update Date
          This is the authored update date (not DB timestamp).
          It's useful for importing articles from external platforms or backups.
          ISO string is used internally, and converted to local Date for picker.
          */}
          <FormField
            control={form.control}
            name='updatedAt'
            render={({ field }) => {
              const valueAsDate = field.value ? new Date(field.value) : undefined;
              return (
                <FormItem className='flex flex-col'>
                  <FormLabel>Post update date</FormLabel>
                  <FormDescription>
                    Used to record when this article was originally written.
                  </FormDescription>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value ? (
                            valueAsDate ? format(valueAsDate, 'yyyy-MM-dd HH:mm') : ''
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0'>
                      <Calendar
                        mode='single'
                        selected={valueAsDate}
                        onSelect={(date) => field.onChange(date?.toISOString())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          {/* Submit */}
          <MotionTextButton
            label={post ? 'Update Post' : 'Create Post'}
            ariaLabel='Submit post'
            type='submit'
            className='btn-primary'
            disabled={!isValid || isSubmitting}
            isLoading={isSubmitting}
          />
        </fieldset>
      </form>
    </Form>
  );
};

export default PostUpsertForm;
