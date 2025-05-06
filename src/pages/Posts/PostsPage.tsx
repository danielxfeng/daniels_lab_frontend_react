import { useEffect } from 'react';
import { Control, Controller, useForm } from 'react-hook-form';
import { useLoaderData, useNavigate, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Helmet } from 'react-helmet-async';
import { cn } from '@/lib/utils';
import { tagSchema, TagsResponse } from '@/schema/schema_tag';
import { DateTimeSchema } from '@/schema/schema_components';
import MotionH1 from '@/components/motion_components/MotionH1';
import SelectableTags from '@/components/tags/SelectableTags';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import MotionTextButton from '@/components/motion_components/MotionTextButton';
import PostsList from '@/components/PostList';
import siteMeta from '@/constants/siteMeta';

const FilterFormSchema = z.object({
  tags: z.array(tagSchema),
  from: DateTimeSchema.optional(),
  to: DateTimeSchema.optional(),
});

// A component to set the meta information for SEO
const MetaInfo = () => (
  <Helmet>
    <title>All Posts – YourSiteName</title>
    <meta name='description' content={`Browse all blog posts on ${siteMeta.siteName}`} />
    <meta property='og:title' content={`All Posts – ${siteMeta.siteName}`} />
    <meta property='og:description' content={`Browse all blog posts on ${siteMeta.siteName}.`} />
    <meta property='og:type' content='website' />
    <meta property='og:url' content={`${siteMeta.siteUrl}/blog/posts`} />
    <meta property='og:image' content={`${siteMeta.siteUrl}/cover.png`} />
    <meta name='twitter:card' content='summary_large_image' />
  </Helmet>
);

type FormValues = z.infer<typeof FilterFormSchema>;

// A component to use Shadcn-ui's date picker
const DatePickerField = ({
  name,
  control,
  label,
}: {
  name: keyof FormValues;
  control: Control<FormValues>;
  label?: string;
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const date = typeof field.value === 'string' ? new Date(field.value) : undefined;
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className={cn(
                  'min-w-2/3 flex-1 justify-start text-left font-normal',
                  !date && 'text-muted-foreground',
                )}
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {date ? format(date, 'PPP') : <span>{label || 'Pick a date'}</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0'>
              <Calendar
                mode='single'
                selected={date}
                onSelect={(d) => field.onChange(d?.toISOString())}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );
      }}
    />
  );
};

// A Form to filter the posts with a list of tags and a date range
const PostsFilter = ({ hotTags }: { hotTags: TagsResponse }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(FilterFormSchema), // Bind schema to the form
    defaultValues: {
      tags: [],
      from: undefined,
      to: undefined,
    },
  });

  // useEffect here to reset the filters to match the URL search params
  useEffect(() => {
    const from = searchParams.get('from') ?? undefined;
    const to = searchParams.get('to') ?? undefined;

    const allTags = searchParams.getAll('tags');
    const validTags = allTags.filter((tag) => hotTags.tags.includes(tag));

    reset({ from, to, tags: validTags });
  }, [searchParams, hotTags.tags, reset]);

  // A closure to handle the form submission
  const onSubmit = (values: FormValues) => {
    // Prevent empty submissions
    if (!values.tags.length && !values.from && !values.to) return;

    // Assemble the query parameters
    const params = new URLSearchParams({ limit: '10', offset: '0' });
    if (values.from) params.set('from', values.from);
    if (values.to) params.set('to', values.to);
    values.tags.forEach((tag) => params.append('tags', tag));

    // Reset the form and navigate to the posts page
    reset();
    navigate(`?${params.toString()}`);
  };

  return (
    <aside className='w-full md:mt-10'>
      <h2>Filter the posts</h2>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <fieldset className='flex flex-col gap-10 md:my-10' disabled={isSubmitting}>
          {/* The list of selectable tags */}
          <Controller
            name='tags'
            control={control}
            render={({ field }) => (
              <SelectableTags
                tags={hotTags.tags}
                selectedTags={field.value}
                setSelectedTags={field.onChange}
              />
            )}
          />
          <hr className='border-muted' />
          {/* The date range picker */}
          <div className='flex w-fit flex-wrap gap-2 md:gap-10'>
            <DatePickerField name='from' control={control} label='From' />
            <DatePickerField name='to' control={control} label='To' />
          </div>
          <hr className='border-muted' />
          <div className='flex gap-2'>
            <MotionTextButton
              label='Reset'
              ariaLabel='Cancel filter'
              type='button'
              onClick={() => {
                navigate('/blog/posts');
              }}
              disabled={isSubmitting}
              className='bg-muted text-muted-foreground w-fit'
            />
            <MotionTextButton
              label='Filter'
              ariaLabel='Filter posts'
              type='submit'
              disabled={isSubmitting}
              className='w-fit'
            />
          </div>
        </fieldset>
      </form>
    </aside>
  );
};

/**
 * The main page for the posts.
 * It contains a filter form and a list of posts.
 */
const PostsPage = () => {
  const { postsListRes, hotTags } = useLoaderData();
  return (
    <>
      <MetaInfo />
      <div className='inner-container flex flex-col items-start'>
        <MotionH1>Posts</MotionH1>
        <div className='posts flex flex-col-reverse gap-10 md:flex-row md:justify-between'>
          <div className='w-full md:w-1/4'>
            <PostsFilter hotTags={hotTags} />
          </div>
          <div className='w-full md:w-3/4'>
            <PostsList postsResponse={postsListRes} />
          </div>
        </div>
      </div>
    </>
  );
};

export default PostsPage;
