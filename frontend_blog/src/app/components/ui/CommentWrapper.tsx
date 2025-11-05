'use client';

import CommentForm from "./CommentForm";



export default function CommentWrapper({ postId }: { postId: number }) {
 

  return <CommentForm postId={postId} />;
}
