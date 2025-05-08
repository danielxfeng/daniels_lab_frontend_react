import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { tagSchema, TagsResponse } from '@/schema/schema_tag';
import { DateTimeSchema } from '@/schema/schema_components';
import SelectableTags from '@/components/tags/SelectableTags';
import MotionTextButton from '@/components/motion_components/MotionTextButton';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import siteMeta from '@/constants/siteMeta';

const FilterFormSchema = z.object({
  tags: z.array(tagSchema),
  from: DateTimeSchema.optional(),
  to: DateTimeSchema.optional(),
});

type FormValues = z.infer<typeof FilterFormSchema>;

/// A form to filter posts
const PostsFilterForm = ({ hotTags }: { hotTags: TagsResponse }) => {
  // the params in the URL
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // init the form
  const form = useForm<FormValues>({
    resolver: zodResolver(FilterFormSchema),
    defaultValues: {
      tags: [],
      from: undefined,
      to: undefined,
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  // Sync filter state from URL
  useEffect(() => {
    const from = searchParams.get('from') ?? undefined;
    const to = searchParams.get('to') ?? undefined;
    const allTags = searchParams.getAll('tags');
    const validTags = allTags.filter((tag) => hotTags.tags.includes(tag));
    reset({ from, to, tags: validTags });
  }, [searchParams, hotTags.tags, reset]);

  // The submit handler
  const onSubmit = (values: FormValues) => {
    // If nothing is selected
    if (!values.tags.length && !values.from && !values.to) return;

    // The default params
    const params = new URLSearchParams({ limit: siteMeta.paginationLimit.toString(), offset: '0' });
    if (values.from) params.set('from', values.from);
    if (values.to) params.set('to', values.to);
    values.tags.forEach((tag) => params.append('tags', tag));

    reset();
    navigate(`?${params.toString()}`);
  };

  return (
    <aside className='w-full md:mt-10'>
      <h2>Filter the posts</h2>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <fieldset className='flex flex-col gap-10 md:my-10' disabled={isSubmitting}>
            {/* Tags */}
            <FormField
              control={control}
              name='tags'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='hidden'>Tags</FormLabel>
                  <FormControl>
                    <SelectableTags
                      tags={hotTags.tags}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <hr className='border-muted' />

            {/* Date pickers */}
            <div className='flex flex-col gap-6 md:gap-10'>
              {['from', 'to'].map((fieldName) => (
                <FormField
                  key={fieldName}
                  control={control}
                  name={fieldName as 'from' | 'to'}
                  render={({ field }) => {
                    const valueAsDate = field.value ? new Date(field.value) : undefined;
                    return (
                      <FormItem className='flex flex-col'>
                        <FormLabel>{fieldName === 'from' ? 'From' : 'To'}</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant='outline'
                                className={cn(
                                  'min-w-2/3 flex-1 justify-start text-left font-normal',
                                  !valueAsDate && 'text-muted-foreground',
                                )}
                              >
                                <CalendarIcon className='mr-2 h-4 w-4' />
                                {valueAsDate ? (
                                  format(valueAsDate, 'PPP')
                                ) : (
                                  <span>Pick a date</span>
                                )}
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
              ))}
            </div>

            <hr className='border-muted' />

            <div className='flex gap-2 justify-between w-3/4 mx-auto'>
              {/* Reset button */}
              <MotionTextButton
                label='Reset'
                ariaLabel='Cancel filter'
                type='button'
                onClick={() => navigate('/blog/posts')}
                disabled={isSubmitting}
                className='bg-muted text-muted-foreground w-fit'
              />
              {/* Submit button */}
              <MotionTextButton
                label='Filter'
                ariaLabel='Filter posts'
                type='submit'
                disabled={isSubmitting}
                className='w-fit'
                isLoading={isSubmitting}
              />
            </div>
          </fieldset>
        </form>
      </Form>
    </aside>
  );
};

export default PostsFilterForm;
