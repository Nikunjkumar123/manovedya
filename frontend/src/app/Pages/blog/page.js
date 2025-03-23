"use client";

import React, { useEffect, useState } from "react";
import image1 from "../../Images/blog-1.png";
import image2 from "../../Images/blog-2.png";
import image3 from "../../Images/blog-3.png";
import Image from "next/image";
import Link from "next/link";
import "./blog.css";
import { getData, serverURL } from "@/app/services/FetchNodeServices";
import { Parser } from "html-to-react";
import { formatDate } from "@/app/constant";

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const fetchBlogs = async () => {
    const response = await getData("api/blogs/get-all-blogs");
    if (response.status === true) {
      setBlogs(response.blogs);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);


  // const blogArr = [
  //   {
  //     blogImg: image1,
  //     date: "Dec 5, 2024 | Lifestyle",
  //     title:
  //       "Ayurvedic, Herbal, or Organic: Which Skincare Approach is Right for You?",
  //     desc: "Your skin represents the inner health of your body and your mind. With a growing emphasis on healthy living and sustainability, people have started adopting synthetic-free and eco-friendly products ...",
  //     blogUrl: "/blog/1",
  //   },
  //   {
  //     blogImg: image2,
  //     date: "Dec 5, 2024 | Lifestyle",
  //     title:
  //       "The Importance of Self-Care in a Fast-Paced World: Tips and Tricks",
  //     desc: "Self-care is more important than ever. Learn practical tips to incorporate self-care into your routine, even when life feels hectic and overwhelming ...",
  //     blogUrl: "/blog/2",
  //   },
  //   {
  //     blogImg: image3,
  //     date: "Dec 5, 2024 | Lifestyle",
  //     title: "Natural Remedies for Glowing Skin: A Comprehensive Guide",
  //     desc: "Embrace the power of natural remedies for glowing skin. This guide covers essential oils, DIY masks, and herbal techniques to achieve radiant skin ...",
  //     blogUrl: "/blog/3",
  //   },
  // ];

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  return (
    <section className="blog-section">
      <div className="container">
        <h2 className="section-title text-center">Our Blog</h2>
        <p className="section-description text-center">
          Discover the latest insights, tips, and tricks in lifestyle, wellness,
          and skincare.
        </p>
        <div className="row">
          {blogs.map((item, index) => (
            <div className="col-md-4 col-6" key={index}>
              <div className="blog-card">
                <img
                  src={`${serverURL}/uploads/blogs/${item?.blogImage}`}
                  alt={item?.blogTitle}
                  className="blog-img"
                />
                <div className="blog-details">
                  <p className="blog-date">{formatDate(item?.date)}</p>
                  <h3 className="blog-title">{item?.blogTitle}</h3>
                  <p className="blog-desc"
                    style={{
                      lineHeight: '1.8',
                      fontSize: '18px',
                      color: '#555',
                      marginBottom: '30px',
                      padding: '0 10px',
                      textAlign: 'justify',
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      WebkitLineClamp: 3, // Show only 3 lines with ellipsis
                    }}
                  >{Parser().parse(item?.description)}</p>
                  <Link href={`blog/${item?._id}`} className="read-more-link">
                    Read More →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogPage;
