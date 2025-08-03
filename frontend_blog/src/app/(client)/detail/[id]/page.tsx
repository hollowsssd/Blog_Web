// DO NOT use "use client"
import CommentWrapper from "@/app/components/ui/CommentWrapper";
import Footer from "@/app/components/ui/footer";
import Header from "@/app/components/ui/header";
import LikeWrapper from "@/app/components/ui/LikeWrapper";
import Image from "next/image";

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
            src="/images/avatar/png"           
            alt="Author"
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
