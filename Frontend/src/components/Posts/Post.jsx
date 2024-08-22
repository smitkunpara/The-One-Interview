import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../../ThemeContext";
import NavBar from "../Navbar/Navbar";
import "./Post.css";

const Post = () => {
  const { questionId } = useParams();
  const [question, setQuestion] = useState(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/home/question/${questionId}`
        );
        setQuestion(response.data);
      } catch (error) {
        console.error("Error fetching question:", error);
      }
    };

    fetchQuestion();
  }, [questionId]);

  if (!question) return <div>Loading...</div>;

  return (
    <>
      <NavBar />
      <div className={`post-container ${isDarkMode ? "dark-mode" : ""}`}>
        <h1 className="post-title">{question.question}</h1>
        <div className="post-meta">
          <img
            src={question.profile_pic || "/img/profile_pic.png"}
            alt="Profile"
            className="profile-pic"
          />
          <div className="post-info">
            <p className="username">{question.username}</p>
            <p className="date">
              {new Date(question.created_at).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="post-content">
          <p>{question.answer}</p>
        </div>
        <div className="post-tags">
          {question.tags.map((tag, index) => (
            <span key={index} className="tag">
              #{tag.toLowerCase()}
            </span>
          ))}
        </div>
        <div className="post-details">
          <p className="company">
            Company: <span>{question.company_name || "Not specified"}</span>
          </p>
          <p className="category">
            Category: <span>{question.category || "Not specified"}</span>
          </p>
        </div>
        <div className="post-actions">
          <button className="upvote">
            <i className="fa-solid fa-thumbs-up"></i> Upvote
          </button>
          <button className="downvote">
            <i className="fa-solid fa-thumbs-down"></i> Downvote
          </button>
          <button className="comment">
            <i className="fa-solid fa-comment"></i> Comment
          </button>
        </div>
      </div>
    </>
  );
};

export default Post;
