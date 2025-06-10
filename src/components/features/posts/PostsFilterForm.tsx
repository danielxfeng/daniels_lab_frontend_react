import { useCallback, useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
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
import SelectableTags from '@/components/features/tags/SelectableTags';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Plus } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import siteMeta from '@/constants/siteMeta';
import useConditionalDebounce from '@/hooks/useConditionalDebounce';
import useUserStore from '@/stores/useUserStore';
import MotionButton from '@/components/motion_components/MotionButton';
import { GlowingEffect } from '@/components/third_party/GlowingEffect';

const FilterFormSchema = z.object({
  tags: z.array(tagSchema),
  from: DateTimeSchema.optional(),
  to: DateTimeSchema.optional(),
});

type FormValues = z.infer<typeof FilterFormSchema>;

/**
 * @summary PostsFilterForm
 * @description
 * A form to filter posts by tags and date range.
 *
 * This form applies a stable window auto-submission approach:
 * when the the changed form values are stable, auto submit is triggered.
 *
 * The form follows a `directed cycle` data loop driven by the URL parameters:
 * - The form state is synced from the current URL parameters.
 * - On form submission, useNavigate is called to update the URL, which triggers a loader re-fetch.
 * - The loader fetches both the filtered data and the latest hot tags, which re-renders the form as well.
 */
const PostsFilterForm = ({ hotTags }: { hotTags: TagsResponse }) => {
  // the params in the URL
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [dateCloseStatus, setDateCloseStatus] = useState<boolean[]>([true, true]);

  // Define the init values on re-rendering.
  // useEffect is not needed here since the URL driven logic of the page.
  // The loader re-fetches hotTags on URL change, so the from is re-rendered when URL changes.
  // Therefore, initValues always reflect the latest URL state.
  const initValues: FormValues = {
    tags: searchParams.getAll('tags').filter((tag) => hotTags.tags.includes(tag)),
    from: searchParams.get('from') ?? undefined,
    to: searchParams.get('to') ?? undefined,
  };

  // Init a conditional debounce hook, initValues and delay are captured in closure,
  // since it's stable during the component's lifecycle.
  const [debounce, setDebounce] = useConditionalDebounce<FormValues>({ initValues, delay: 1000 }); // 1000ms delay

  // init the form
  const form = useForm<FormValues>({
    resolver: zodResolver(FilterFormSchema),
    defaultValues: initValues,
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  // tracks the current form values for auto submission
  const currValues = useWatch<FormValues>({ control }) as FormValues;

  // The submit handler
  const onSubmit = useCallback(
    (values: FormValues) => {
      const params = new URLSearchParams({
        limit: siteMeta.paginationLimit.toString(),
        offset: '0',
      });
      if (values.from) params.set('from', values.from);
      if (values.to) params.set('to', values.to);
      values.tags.forEach((tag) => params.append('tags', tag));
      navigate(`?${params.toString()}`);
    },
    [navigate],
  );

  // Fire the auto submit when the debounce value is stable (values are not null))
  useEffect(() => {
    if (debounce) onSubmit(debounce);
  }, [debounce, onSubmit]);

  // Send instable values to the hook.
  useEffect(() => {
    setDebounce({ values: currValues, conditions: dateCloseStatus });
  }, [currValues, dateCloseStatus, setDebounce]);
  // A snapshot of the user from the Zustand store
  const user = useUserStore.getState().user;
  return (
    <div className='border-border relative w-full rounded-2xl border p-2 md:rounded-3xl md:p-3'>
      <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} />
      <aside className='border-0.75 border-border z-10 overflow-hidden rounded-xl px-5 py-8'>
        {/* A new post button for admin user */}
        {user?.isAdmin && (
          <div className='flex justify-start'>
            <MotionButton
              supportingText='Create a new post'
              text='New Post'
              size='md'
              variant='highlight'
              icon={<Plus />}
              to='/blog/posts/new'
              isExternal={false}
              isFullWidth={true}
            />
          </div>
        )}
        {user?.isAdmin && <hr className='border-border mt-9' />}
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <fieldset className='flex flex-col gap-6 lg:my-10' disabled={isSubmitting}>
              {/* Tags */}
              <FormField
                control={control}
                name='tags'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className='flex flex-col gap-2'>
                        <div className='mt-3 flex items-center justify-between'>
                          <h4>🔥 tags:</h4>
                          {/* Reset button */}
                          <MotionButton
                            text='Reset'
                            supportingText='Cancel filter'
                            buttonType='button'
                            onClick={() => form.reset({ tags: [], from: undefined, to: undefined })}
                            disabled={isSubmitting}
                            variant='ghost'
                            size='sm'
                          />
                        </div>
                        <SelectableTags
                          tags={hotTags.tags}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date pickers */}
              <div className='flex flex-col gap-2'>
                {['from', 'to'].map((fieldName, i) => (
                  <FormField
                    key={fieldName}
                    control={control}
                    name={fieldName as 'from' | 'to'}
                    render={({ field }) => {
                      const valueAsDate = field.value ? new Date(field.value) : undefined;
                      return (
                        <FormItem className='flex flex-col'>
                          <FormLabel>{fieldName === 'from' ? 'From' : 'To'}</FormLabel>
                          <Popover
                            onOpenChange={(open) => {
                              setDateCloseStatus((prev) => {
                                if (prev[i] === !open) return prev; // No update, no re-render
                                const newStatus = [...prev];
                                newStatus[i] = !open;
                                return newStatus;
                              });
                            }}
                          >
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant='outline'
                                  className={cn(
                                    'border-border min-w-2/3 flex-1 justify-start text-left font-normal',
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
            </fieldset>
          </form>
        </Form>
      </aside>
    </div>
  );
};

export default PostsFilterForm;
