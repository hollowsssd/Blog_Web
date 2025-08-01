// DO NOT use "use client"
import Image from "next/image";
import Footer from "@/app/components/ui/footer";
import Header from "@/app/components/ui/header";
import LikeWrapper from "@/app/components/ui/LikeWrapper";
import CommentWrapper from "@/app/components/ui/CommentWrapper";

type Params = {
  params: { id: string };
};

type Post = {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  tags: {
    id: number;
    name: string;
  }[];
};

type Comment = {
  id: number;
  content: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
  };
};


export default async function PostDetailPage({ params }: Params) {
  //post
  const { id } = params;

  const res = await fetch(`http://localhost:8080/post/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return <div>Post not found</div>;
  }

  //like
   const likeRes = await fetch(`http://localhost:8080/likes/count/${id}`, {
     cache: "no-store",
   })
   const likeCount: number = likeRes.ok ? await likeRes.json() : 0;

  //comment
  const post: Post = await res.json();

  const commentRes = await fetch(`http://localhost:8080/comments/post/${id}`, {
    cache: 'no-store',
  });

  const comments: Comment[] = commentRes.ok ? await commentRes.json() : [];

  return (
    <main className="min-h-screen bg-white text-gray-900 px-6 md:px-16 lg:px-32 pb-20">
      {/* Header */}
      <Header />

      {/* Post content */}
      <section className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-3 leading-snug">
          {post.title}
        </h1>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-2">
          {post.tags?.map((tag) => (
            <span
              key={tag.id}
              className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded"
            >
              {tag.name}
            </span>
          ))}
        </div>

        {/* Author info */}
        <div className="flex items-center gap-3 mb-6 text-sm text-gray-500">
          <Image
            src="data:image/webp;base64,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"            alt="Author"
            width={32}
            height={32}
            className="rounded-full"
          />
          <span>
            By {post.user.name} •{" "}
            {new Date(post.createdAt).toLocaleString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false,
            })}
          </span>
        </div>

        {/* Thumbnail (optional) */}
          {post.imageUrl && (
            <Image
              src={`http://localhost:8080/post/images/${post.imageUrl}`}
              alt="Post Thumbnail"
              width={800}
              height={500}
              className="rounded-xl mb-6 w-full object-cover"
            />
          )}

        {/* Like */}
        <LikeWrapper postId={post.id} />

        {/* Content */}
        <article className="prose prose-lg max-w-none mb-10">
          <p>{post.content}</p>
        </article>

        {/* Comments Section */}
        <CommentWrapper postId={post.id} />
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
