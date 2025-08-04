"use client"
import CommentWrapper from "@/app/components/ui/CommentWrapper";
import Footer from "@/app/components/ui/footer";
import Header from "@/app/components/ui/header";
import LikeWrapper from "@/app/components/ui/LikeWrapper";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

type PostDetailPageProps = {
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

export default async function PostDetailPage() {
  const { id } = useParams();

  try {
    const res = await axios.get<Post>(`http://localhost:8080/post/${id}`, {
      headers: {
        "Cache-Control": "no-store",
      },
    });

    const post = res.data;

    return (
      <main className="min-h-screen bg-white text-gray-900 px-6 md:px-16 lg:px-32 pb-20">
        <Header />

        <section className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-3 leading-snug">{post.title}</h1>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-2">
            {post.tags?.map((tag) => (
              <Link
                key={tag.id}
                href={`/article?tag=${encodeURIComponent(tag.name)}`}
                className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded hover:bg-blue-200 transition"
              >
                {tag.name}
              </Link>
            ))}
          </div>

          {/* Author info */}
          <div className="flex items-center gap-3 mb-6 text-sm text-gray-500">
            <Image
              src="/images/avatar.png"
              alt="Author"
              width={32}
              height={32}
              className="rounded-full"
            />
            <Link href={`/profile/${post.user.id}`} className="underline">
              {post.user.name}
            </Link>
            <span>
              •{" "}
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

          {/* Thumbnail */}
          {post.imageUrl && (
            <Image
              src={`http://localhost:8080/post/images/${post.imageUrl}`}
              alt="Post Thumbnail"
              width={800}
              height={500}
              className="rounded-xl mb-6 w-full object-cover"
            />
          )}

          <LikeWrapper postId={post.id} />

          <article className="prose prose-lg max-w-none mb-10">
            <p>{post.content}</p>
          </article>

          <CommentWrapper postId={post.id} />
        </section>

        <Footer />
      </main>
    );
  } catch (error) {
    return <div>Post not found</div>;
  }
}
