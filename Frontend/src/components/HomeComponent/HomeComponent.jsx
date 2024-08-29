import  { useState, useEffect, useRef } from 'react';
import NavBar from '../Navbar/Navbar';
import './HomeComponent.css';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaChartLine, FaHandshake } from 'react-icons/fa';
import { FaQuestionCircle, FaClipboardCheck,FaChevronLeft,FaChevronRight, FaUserGraduate, FaBuilding } from 'react-icons/fa';

const HomeComponent = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselImages = [
    '/img/banner1.png',
    '/img/banner2.png',
    '/img/carousel-3.jpg',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % carouselImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);


  const carouselContent = [
    {
      tagline: "Ace Your Next Interview",
      description: "Get access to expert-curated questions and answers. Start your journey to success today!",
      image: "/img/banner1.png",
      ctaPrimary: "Start Practicing",
      ctaSecondary: "View Plans",
    },
    {
      tagline: "Master Your Skills",
      description: "Learn from industry experts and boost your confidence. Your dream job is within reach!",
      image: "/img/banner2.png",
      ctaPrimary: "Explore Courses",
      ctaSecondary: "Free Trial",
    },
    {
      tagline: "Land Your Dream Job",
      description: "Join thousands of successful candidates who prepared with us. Your future starts here!",
      image: "/img/carousel-3.jpg",
      ctaPrimary: "Sign Up Now",
      ctaSecondary: "Learn More",
    },
  ];
  const features = [
    { 
      title: "Comprehensive Question Bank", 
      description: "Access thousands of curated interview questions covering various topics and difficulty levels. Our extensive database is regularly updated to reflect the latest industry trends.",
      icon: <FaQuestionCircle />,
      color: "#FF6B6B"
    },
    { 
      title: "Expert-Verified Answers", 
      description: "Get detailed, expert-verified answers to every question. Our team of industry professionals ensures that you receive accurate and up-to-date information to boost your confidence.",
      icon: <FaClipboardCheck />,
      color: "#4ECDC4"
    },
    { 
      title: "Real Interview Experiences", 
      description: "Learn from the firsthand experiences of successful candidates. Our platform features a collection of authentic interview stories, tips, and insights from various companies and positions.",
      icon: <FaUserGraduate />,
      color: "#45B7D1"
    },
    { 
      title: "Company-Specific Preparation", 
      description: "Tailor your preparation with our company-specific filters. Get access to questions, interview processes, and culture insights for top companies in your industry.",
      icon: <FaBuilding />,
      color: "#F7B731"
    },
    {
      title: "Performance Analytics",
      description: "Track your progress with detailed performance analytics. Identify your strengths and weaknesses to focus your preparation efforts effectively.",
      icon: <FaChartLine />,
      color: "#FF9FF3"
    },
    {
      title: "Career Guidance",
      description: "Get personalized career advice from industry experts. Our mentorship program connects you with professionals who can guide you towards your dream job.",
      icon: <FaHandshake />,
      color: "#5CD85A"
    },
  ];


  const testimonials = [
    {
      name: "Priya Sharma",
      company: "Google",
      logo: "/img/google.png",
      testimonial: "During my time at the university, there wasn't a well-organized platform for interview preparation. After securing my position at Google, I realized the importance of guidance. That's why I'm committed to helping my juniors navigate the same process. I want to share my experiences and insights, so they are better prepared to face the challenges ahead."
    },
    {
      name: "Rahul Gupta",
      company: "Microsoft",
      logo: "/img/company-logos/microsoft.png",
      testimonial: "When I was preparing for campus placements, I had to piece together resources and advice from various places. Now, as a part of One University, I'm excited to help create a more structured path for those following in my footsteps. My journey to Microsoft wasn't easy, but with the right support, I believe our juniors can achieve even more."
    },
    {
      name: "Aisha Patel",
      company: "Amazon",
      logo: "/img/company-logos/amazon.png",
      testimonial: "Back in my day, we didn't have a platform like One University to streamline our preparation. Now that I'm with Amazon, I want to give back to the community by mentoring and guiding students through the same interview process I faced. It's all about making sure they don't make the same mistakes and are fully prepared to succeed."
    },
    {
      name: "Vikram Singh",
      company: "Adobe",
      logo: "/img/company-logos/adobe.png",
      testimonial: "I remember the struggle of preparing for interviews with limited resources. Joining Adobe was a dream come true, and now I want to ensure that my juniors have a smoother journey. Through One University, I’m eager to share practical tips and provide the support system I wish I had."
    },
    {
      name: "Neha Reddy",
      company: "Uber",
      logo: "/img/company-logos/uber.png",
      testimonial: "The lack of a dedicated platform made my preparation for Uber's interviews challenging. Now, as part of One University, I'm excited to contribute to a community where students can find all the guidance they need. I want to help them develop the skills and confidence required to excel in their placements."
    },
    // Add more testimonials as needed
  ];
  
  
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const testimonialRef = useRef(null);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % carouselContent.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + carouselContent.length) % carouselContent.length);
  };

  return (
    <div className="homepage">
      <NavBar />
      <main>
        <section className="hero">
          <div className="hero-carousel">
            {carouselContent.map((slide, index) => (
              <motion.div
                key={index}
                className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: index === currentSlide ? 1 : 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="hero-image">
                  <img src={slide.image} alt={slide.tagline} />
                </div>
                <div className="hero-content">
                  <h1>{slide.tagline}</h1>
                  <p>{slide.description}</p>
                  <div className="cta-buttons">
                    <Link to="/questions" className="cta-button primary">{slide.ctaPrimary}</Link>
                    <Link to="/about" className="cta-button secondary">{slide.ctaSecondary}</Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <button className="carousel-control prev" onClick={prevSlide}>
            <FaChevronLeft />
          </button>
          <button className="carousel-control next" onClick={nextSlide}>
            <FaChevronRight />
          </button>
        </section>

        <section className="features">
          <h2>Why Us? We’ve Been There, Done That</h2>
          <div className="feature-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="feature-icon" style={{ color: feature.color }}>{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>


        <section className="testimonials">
  <h2>Take help from the Experienced Ones</h2>
  <div className="testimonial-carousel">
    <div className="testimonial-track" ref={testimonialRef} style={{ transform: `translateX(-${activeTestimonial * 50}%)` }}>
      {testimonials.map((testimonial, index) => (
        <div key={index} className="testimonial-card">
          <div className="testimonial-background" style={{ backgroundImage: `url(${testimonial.logo})` }}></div>
          <div className="testimonial-content">
            <h3>{testimonial.name}</h3>
            <h4>{testimonial.company}</h4>
            <p>{testimonial.testimonial}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
    <div className="testimonial-indicators">
      {testimonials.map((_, index) => (
        <button
          key={index}
          className={`indicator ${index === activeTestimonial ? 'active' : ''}`}
          onClick={() => setActiveTestimonial(index)}
        />
      ))}
    </div>
  </section>
      </main>
    </div>
  );
};

export default HomeComponent;
