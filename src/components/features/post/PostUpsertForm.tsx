import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosResponse } from 'axios';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';

import TagSelector from '@/components/features/tags/TagsSelector';
import MotionButton from '@/components/motion_components/MotionButton';
import MotionInput from '@/components/motion_components/MotionInput';
import MotionTextarea from '@/components/motion_components/MotionTextArea';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import logError from '@/lib/logError';
import { throwWithValidationErr } from '@/lib/throwWithErr';
import { cn } from '@/lib/utils';
import type { CreateOrUpdatePostBody, PostResponse } from '@/schema/schema_post';
import { CreateOrUpdatePostBodySchema, PostResponseSchema } from '@/schema/schema_post';
import { createPost, updatePost } from '@/services/services_posts';

// A helper function to get the slug from the response
const getSlug = (isCreate: boolean, res: AxiosResponse<PostResponse | undefined>) => {
  if (isCreate) return res.headers.location.split('/').pop();
  const validatedBody = PostResponseSchema.safeParse(res.data);
  if (!validatedBody.success)
    return throwWithValidationErr('validate post response error', validatedBody.error);
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
      toast.success(`Post ${isCreate ? 'created' : 'updated'} successfully!`);
      setTimeout(() => {
        navigate(`/blog/posts/${slug}`);
      }, 1000);
    } catch (error) {
      toast.error('Error submitting post');
      logError(error, 'Error submitting post');
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='mx-auto mt-6 w-full max-w-2xl'
        data-role='post-upsert-form'
        aria-label='Post Upsert Form'
      >
        <fieldset disabled={isSubmitting} className='flex flex-col gap-6'>
          {/* Title */}
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <MotionInput
                    placeholder='Post title'
                    {...field}
                    data-role='input-title'
                    autoComplete='off'
                  />
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
                  <MotionInput
                    placeholder='https://your.cover.url'
                    {...field}
                    data-role='input-cover-url'
                    autoComplete='off'
                  />
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
                  <MotionTextarea
                    placeholder='Write in markdown...'
                    {...field}
                    className='min-h-96'
                    data-role='input-markdown'
                    autoComplete='off'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tags: A combo box to select/input tags. */}
          <FormField
            control={form.control}
            name='tags'
            render={({ field }) => {
              const errors = form.formState.errors.tags;

              return (
                <FormItem>
                  <FormLabel htmlFor='tagInput'>Tags</FormLabel>
                  <FormControl>
                    <TagSelector field={field} inputId={'tagInput'} />
                  </FormControl>
                  {
                    // To solve that the `FormMessage` does not show the nested errors.
                    Array.isArray(errors) &&
                      errors.map((err, idx) =>
                        err?.message ? (
                          <p key={idx + err.message} className='text-destructive text-sm'>
                            Tag{idx}: {err.message}
                          </p>
                        ) : null,
                      )
                  }
                  <FormMessage />
                </FormItem>
              );
            }}
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
                <FormItem className='flex flex-col' data-role='date-picker-creation-date'>
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
                            'border-border w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                          aria-label='Pick creation date'
                        >
                          {field.value ? (
                            valueAsDate ? (
                              format(valueAsDate, 'yyyy-MM-dd HH:mm')
                            ) : (
                              ''
                            )
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
            data-role='date-picker-update-date'
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
                            'border-border w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                          aria-label='Pick update date'
                        >
                          {field.value ? (
                            valueAsDate ? (
                              format(valueAsDate, 'yyyy-MM-dd HH:mm')
                            ) : (
                              ''
                            )
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
          <MotionButton
            text={post ? 'Update Post' : 'Create Post'}
            supportingText='Submit post'
            buttonType='submit'
            variant='highlight'
            size='md'
            isFullWidth={true}
            isDisabled={!isValid || isSubmitting}
            isLoading={isSubmitting}
            dataRole='button-submit-post'
          />
        </fieldset>
      </form>
    </Form>
  );
};

export default PostUpsertForm;
