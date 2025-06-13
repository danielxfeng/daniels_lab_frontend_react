import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import {
  CreateCommentBody,
  CreateCommentBodySchema,
  UpdateCommentBody,
  UpdateCommentBodySchema,
} from '@/schema/schema_comment';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { CommentResponse, CommentResponseSchema } from '@/schema/schema_comment';
import { UserResponse } from '@/schema/schema_users';
import { createComment, getComment, updateComment } from '@/services/service_comments';
import MotionTextarea from '@/components/motion_components/MotionTextArea';
import MotionButton from '@/components/motion_components/MotionButton';

const CommentForm = ({
  user,
  comment,
  postId,
  setComments,
}: {
  user: Partial<UserResponse> | null;
  comment?: CommentResponse;
  postId?: string;
  setComments: React.Dispatch<React.SetStateAction<CommentResponse[]>>;
}) => {
  if (!comment && !postId) throw new Error('Either comment or postId must be provided');
  const isCreate = !comment;

  const form = useForm<CreateCommentBody | UpdateCommentBody>({
    resolver: zodResolver(isCreate ? CreateCommentBodySchema : UpdateCommentBodySchema),
    mode: 'onTouched',
    defaultValues: {
      content: comment?.content ?? '',
      ...(isCreate ? { postId } : {}),
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid },
  } = form;

  const createCommentHelper = async (body: CreateCommentBody): Promise<CommentResponse | null> => {
    const res = await createComment(body);
    if (res.status !== 201) {
      console.error('Error creating comment:', res.statusText);
      return null;
    }
    try {
      const comment = await getComment(res.headers.location.split('/').pop() ?? '');
      const validated = CommentResponseSchema.safeParse(comment.data);
      if (!validated.success) {
        console.error('Error validating comment:', validated.error);
        return null;
      }
      return validated.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error fetching created comment:', error.response?.statusText);
      return null;
    }
  };

  const updateCommentHelper = async (
    commentId: string,
    body: UpdateCommentBody,
  ): Promise<CommentResponse | null> => {
    try {
      const res = await updateComment(commentId, body);
      const validated = CommentResponseSchema.safeParse(res.data);
      if (!validated.success) {
        console.error('Error validating updated comment:', validated.error);
        return null;
      }
      return validated.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error updating comment:', error.response?.statusText);
      return null;
    }
  };

  const onSubmit = async (data: CreateCommentBody | UpdateCommentBody) => {
    if (!user) return toast.warning('Please login to comment');
    if (comment && user.id !== comment.authorId)
      return toast.warning('You can only edit your own comment');

    const request = isCreate
      ? createCommentHelper(data as CreateCommentBody)
      : updateCommentHelper(comment!.id, data as UpdateCommentBody);

    try {
      const result = await request;
      if (!result) throw new Error('Request failed');

      if (isCreate) {
        setComments((prev) => [result, ...prev]);
      } else {
        setComments((prev) =>
          prev.map((c) => (c.id === comment?.id ? { ...c, content: result.content } : c)),
        );
      }

      reset();
    } catch (error) {
      console.error('Error upserting comment:', error);
      toast.error('Oops! Something went wrong, please try later...');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className='my-3'>
        <fieldset disabled={isSubmitting} className='flex flex-col gap-2'>
          <FormField
            control={form.control}
            name='content'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <MotionTextarea
                    {...field}
                    placeholder='Leave a comment...'
                    className='min-h-[100px]'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='my-2 flex w-full justify-end'>
            <MotionButton
              buttonType='submit'
              size='sm'
              variant='ghost'
              text={comment ? 'Update' : 'Comment'}
              supportingText={comment ? 'Update a comment' : 'Create a Comment'}
              isDisabled={!isValid || isSubmitting}
              isLoading={isSubmitting}
            />
          </div>
        </fieldset>
      </form>
    </Form>
  );
};

export default CommentForm;
