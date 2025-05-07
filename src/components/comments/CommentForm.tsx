import {
  CommentResponse,
  CommentResponseSchema,
  CreateCommentBody,
  CreateCommentBodySchema,
  UpdateCommentBody,
  UpdateCommentBodySchema,
} from '@/schema/schema_comment';
import { AuthResponse as User } from '@/schema/schema_auth';
import { createComment, getComment, updateComment } from '@/services/service_comments';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Textarea } from '../ui/textarea';
import MotionTextButton from '../motion_components/MotionTextButton';

// Create of Crud comments
const createCommentHelper = async (body: CreateCommentBody): Promise<CommentResponse | null> => {
  // Send the request.
  const res = await createComment(body);

  // Validate the response
  if (res.status !== 201) {
    console.error('Error creating comment:', res.statusText);
    return null;
  }

  try {
    // Get the created comment
    const comment = await getComment(res.headers.location.split('/').pop() ?? '');
    const validatedData = CommentResponseSchema.safeParse(comment.data);
    if (!validatedData.success) {
      console.error('Error validating created comment data:', validatedData.error);
      return null;
    }
    return validatedData.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error fetching created comment:', error.response!.statusText);
    return null;
  }
};

// Update of Crud comments
const updateCommentHelper = async (
  commentId: string,
  body: UpdateCommentBody,
): Promise<CommentResponse | null> => {
  try {
    // Send the request.
    const res = await updateComment(commentId, body);
    // Validate the response data
    const validatedData = CommentResponseSchema.safeParse(res.data);
    if (!validatedData.success) {
      console.error('Error validating updated comment data:', validatedData.error);
      return null;
    }
    // Return the validated data
    return validatedData.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error updating comment:', error.response?.statusText);
    return null;
  }
};

// An upsert form for create or update a comment
// Need to pass the postId to create a comment, or the comment to update
const CommentForm = ({
  user,
  comment,
  postId,
  setComments,
}: {
  user: Partial<User> | null;
  comment?: CommentResponse;
  postId?: string;
  setComments: React.Dispatch<React.SetStateAction<CommentResponse[]>>;
}) => {
  // Validate the props
  if (!comment && !postId) throw new Error('Either comment or postId must be provided');
  const isCreate = !comment;

  // A RHF to upsert a comment
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CreateCommentBody | UpdateCommentBody>({
    resolver: zodResolver(isCreate ? CreateCommentBodySchema : UpdateCommentBodySchema),
    mode: 'onTouched',
    defaultValues: {
      content: comment?.content ?? '',
      ...(isCreate ? { postId } : {}),
    },
  });

  // A closure to handle the submit
  const onSubmit = async (data: CreateCommentBody | UpdateCommentBody) => {
    // Permission check
    if (!user) return toast.warning('Please login to comment');
    if (comment && user.id !== comment.authorId)
      return toast.warning('You can only edit your own comment');

    // help to validate the request
    const getValidatedReq = (data: CreateCommentBody | UpdateCommentBody) => {
      const validatedReq = isCreate
        ? CreateCommentBodySchema.safeParse(data)
        : UpdateCommentBodySchema.safeParse(data);
      if (!validatedReq.success)
        throw new Error(`Invalid request data: ${JSON.stringify(validatedReq.error)} `);
      return validatedReq.data;
    };

    // A closure to handle the request
    const requestFunc = async (req: CreateCommentBody | UpdateCommentBody, commentId?: string) => {
      if (isCreate) return await createCommentHelper(req as CreateCommentBody);
      return await updateCommentHelper(commentId!, req as UpdateCommentBody);
    };

    // A closure to handle the DOM update
    const domUpdate = (res: CommentResponse) => {
      if (isCreate) {
        setComments((prev) => [res, ...prev]);
      } else {
        setComments((prev) =>
          prev.map((c) => {
            if (c.id === comment?.id) {
              return { ...c, content: res.content };
            }
            return c;
          }),
        );
      }
    };

    try {
      // Validate the request
      const validatedReq = getValidatedReq(data);

      // Perform the request
      const res = await requestFunc(validatedReq, comment?.id);
      if (!res) throw new Error('Request failed');

      // Update the DOM
      domUpdate(res);
    } catch (error) {
      console.error('Error creating/updating comment:', error);
      toast.error('Oops! Something went wrong, please try later...');
    } finally {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='my-3'>
      <fieldset className='flex flex-col gap-2' disabled={isSubmitting}>
        <Textarea
          {...register('content')}
          className='min-h-[100px] focus-visible:ring-1'
          placeholder='Leave a comment...'
        />
        {errors.content && (
          <span className='text-destructive text-sm'>{errors.content.message}</span>
        )}
        <div className='my-2 flex w-full'>
          <MotionTextButton
            type='submit'
            label={comment ? 'Update' : 'Comment'}
            ariaLabel={comment ? 'Update a comment' : 'Create a Comment'}
            disabled={isSubmitting || !isValid}
            className='bg-muted-foreground text-muted w-full px-3.5 py-1.5 text-sm'
          />
        </div>
      </fieldset>
    </form>
  );
};

export default CommentForm;
