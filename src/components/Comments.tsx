const Comments = ({ postId, userId }: { postId: string; userId: string | undefined }) => {
  return <>{postId} {userId} </>;
};

export default Comments;
