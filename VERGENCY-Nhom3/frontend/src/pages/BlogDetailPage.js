// src/pages/BlogDetailPage.js
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import blogs from '../data/blogs.js';

const BlogDetailPage = () => {
    const { id: blogId } = useParams();
    
    const blog = blogs.find(b => b._id === blogId);

    useEffect(() => {
        if (window.FB) {
            window.FB.XFBML.parse();
        }
    }, [blogId]); 

    if (!blog) {
        return (
            <div className="container">
                <h2>Bài viết không tồn tại</h2>
                <Link to="/blog" className="btn-read-more">Quay lại trang Blog</Link>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="breadcrumb">
                <Link to="/">Trang chủ</Link>
                <span>{'>'}</span>
                <Link to="/blog">Tin tức</Link>
                <span>{'>'}</span>
                <span>{blog.title}</span>
            </div>

            <article className="blog-detail-content">
                <h1 className="blog-detail-title">{blog.title}</h1>
                <p className="blog-detail-meta">Ngày: {blog.date}</p>
                <div className="blog-post-body">
                    <p>{blog.excerpt}</p>
                    {/* (Sau này, nội dung đầy đủ của bài viết sẽ được hiển thị ở đây) */}
                    <p>Đây là phần nội dung chi tiết hơn của bài viết. Bạn có thể thêm nhiều đoạn văn, hình ảnh, và các định dạng khác vào đây để làm cho bài viết của mình phong phú và hấp dẫn hơn.</p>
                </div>
            </article>

            {/* --- PHẦN BÌNH LUẬN FACEBOOK --- */}
            <div className="comment-section">
                <h3>BÌNH LUẬN</h3>
                <div 
                    className="fb-comments" 
                    data-href={`https://your-website-url.com/blog/${blogId}`} 
                    data-width="100%" 
                    data-numposts="5"
                ></div>
            </div>
        </div>
    );
};

export default BlogDetailPage;