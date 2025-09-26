import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import blogs from '../data/blogs.js'; 

const BlogPage = () => {
    const [isHovering, setIsHovering] = useState(false);

    return (
        <div className="container">
            <div className="breadcrumb">
                <Link to="/">Trang chủ</Link>
                <span>{'>'}</span>
                <span>Tin Tức</span>
            </div>
            
            <div className="blog-layout">
                {/* === CỘT TRÁI: DANH SÁCH BÀI VIẾT === */}
                <div className="blog-main-column">
                    <h1 className="page-title" style={{textAlign: 'left', display: 'block'}}>Bài Viết Mới Nhất</h1>
                    <div 
                        className="blog-list"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        {blogs.map(blog => (
                            <article key={blog._id} className="blog-card">
                                <Link to={`/blog/${blog._id}`} className="blog-card-image">
                                    <img src={blog.image} alt={blog.title} />
                                </Link>
                                <div className="blog-card-content">
                                    <h2 className="blog-card-title">
                                        <Link to={`/blog/${blog._id}`}>{blog.title}</Link>
                                    </h2>
                                    <p className="blog-card-meta">Ngày: {blog.date}</p>
                                    <p className="blog-card-excerpt">{blog.excerpt}</p>
                                    <Link to={`/blog/${blog._id}`} className="btn-read-more">Xem tiếp</Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>

                {/* === CỘT PHẢI: SIDEBAR === */}
                <aside className="blog-sidebar">
                    <div className="sidebar-widget">
                        <h3 className="widget-title">Bài viết mới nhất</h3>
                        <ul className="latest-posts-list">
                            {blogs.slice(0, 3).map(blog => ( 
                                <li key={blog._id}>
                                    <Link to={`/blog/${blog._id}`}>{blog.title}</Link>
                                    <span>Ngày: {blog.date}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    <div className="sidebar-widget">
                        <h3 className="widget-title">Banner quảng cáo</h3>
                        <div className="sidebar-banner">
                            {/* Ảnh này chỉ hiện ra khi isHovering là true */}
                            {isHovering && (
                                <img src="/images/blog-banner-hover.jpg" alt="Blog Banner" />
                            )}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default BlogPage;