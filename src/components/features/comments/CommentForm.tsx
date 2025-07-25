import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ZodError } from 'zod';

import MotionButton from '@/components/motion_components/MotionButton';
import MotionTextarea from '@/components/motion_components/MotionTextArea';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import logError from '@/lib/logError';
import { throwWithValidationErr } from '@/lib/throwWithErr';
import {
  CreateCommentBody,
  CreateCommentBodySchema,
  UpdateCommentBody,
  UpdateCommentBodySchema,
} from '@/schema/schema_comment';
import { CommentResponse, CommentResponseSchema } from '@/schema/schema_comment';
import { UserResponse } from '@/schema/schema_users';
import { createComment, getComment, updateComment } from '@/services/service_comments';

type CommentFormProps = {
  user: Partial<UserResponse> | null;
  comment?: CommentResponse;
  postId?: string;
  setComments: React.Dispatch<React.SetStateAction<CommentResponse[]>>;
};

// An upsert form for comment.
const CommentForm = ({ user, comment, postId, setComments }: CommentFormProps) => {
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
    try {
      const res = await createComment(body);
      const comment = await getComment(res.headers.location.split('/').pop() ?? '');
      const validated = CommentResponseSchema.safeParse(comment.data);
      if (!validated.success) throw validated.error;
      return validated.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error instanceof ZodError)
        return throwWithValidationErr('Comment response parsing error', error);
      logError(error, 'Error on creating a comment.');
      toast.error('Error on creating a comment, please retry later.');
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
      if (!validated.success) throw validated.error;
      return validated.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error instanceof ZodError)
        return throwWithValidationErr('Comment response parsing error', error);
      logError(error, 'Error on updating a comment.');
      toast.error('Error on updating a comment, please retry later.');
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

    const result = await request;

    if (!result) return;

    if (isCreate) {
      setComments((prev) => [result, ...prev]);
    } else {
      setComments((prev) =>
        prev.map((c) => (c.id === comment?.id ? { ...c, content: result.content } : c)),
      );
    }
    reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='my-3'
        aria-label={comment ? 'Edit comment form' : 'New comment form'}
        data-role='form-comment'
      >
        <fieldset disabled={isSubmitting} className='flex flex-col gap-2'>
          <FormField
            control={form.control}
            name='content'
            aria-label='Comment content'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <MotionTextarea
                    {...field}
                    placeholder='Leave a comment...'
                    className='min-h-[100px]'
                    autoComplete='off'
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
              dataRole='button-submit-comment'
            />
          </div>
        </fieldset>
      </form>
    </Form>
  );
};

export default CommentForm;
