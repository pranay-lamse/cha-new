"use client"; // Ensures this is a client component

import { useState, useEffect } from "react";

import { getToken } from "@/utils/storage"; // Token handler
import { marcellus } from "@/config/fonts";
import Link from "next/link";
import { Status } from "@/interfaces";
import axiosClient from "@/api/axiosClient";
import { GET_BLOG_POSTS } from "@/graphql/queries";
import axiosClientGeneralToken from "@/api/axiosClientGeneralToken";
import Loader from "./Loader";

interface Props {
  status: Status;
  title: string;
  searchParams?: {
    query?: string;
    page?: string;
  };
}

const Blogs = ({ status, title, searchParams }: Props) => {
  const currentPage = Number(searchParams?.page) || 1;
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const response = await axiosClientGeneralToken.post("", {
          query: GET_BLOG_POSTS,
          variables: { first: 20 }, // Fetch first 20 posts
        });

        setData(response.data?.data?.posts?.nodes || []);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [currentPage]);

  return (
    <div className="grid">
      <div className="title-all">
        <h1 className={`${marcellus.className} text-center text-5xl`}>
          {title}
        </h1>
      </div>
      <div className="container mx-auto w-full sm:w-11/12 lg:w-[1170px] my-10 sm:my-20 about px-2">
        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 blog">
            {data.length > 0 ? (
              data.map((blog) => (
                <article key={blog.id} className="post type-post">
                  <div className="elementor-post__text">
                    <h3 className="elementor-post__title">
                      <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                    </h3>
                    <div className="elementor-post__meta-data">
                      <span className="elementor-post-date">
                        {new Date(blog.date).toLocaleDateString()}
                      </span>
                      <span className="elementor-post-avatar">
                        By {blog.author.node.name}
                      </span>
                    </div>
                    {blog.featuredImage?.node?.sourceUrl && (
                      <img
                        src={blog.featuredImage.node.sourceUrl}
                        alt={blog.featuredImage.node.altText || "Blog Image"}
                        className="w-full h-auto rounded-md"
                      />
                    )}
                    <div className="elementor-post__excerpt pb-2">
                      <div
                        dangerouslySetInnerHTML={{ __html: blog.excerpt }}
                        className="text-gray-700"
                      />
                    </div>
                    <div className="post__read-more">
                      <Link href={`/blog/${blog.slug}`}>Read More »</Link>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <p className="text-center col-span-3">No blog posts found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;
