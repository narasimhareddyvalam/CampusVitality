import React, { useState, useEffect } from "react";
import { Link as ScrollLink } from "react-scroll";
import "animate.css";

// Image Imports
import heroImage from "../../homepage.jpeg"; // Update path as needed
import featuresImage1 from "../../cmp.jpg"; // Replace with actual images
import featuresImage2 from "../../2nd.webp";
import featuresImage3 from "../../3rd.jpg";

// Custom Styles
const customStyles = `
  .perspective-1000 { perspective: 1000px; }
  .transform-style-3d { transform-style: preserve-3d; }
  .backface-hidden { backface-visibility: hidden; }
  .rotate-y-180 { transform: rotateY(180deg); }
`;

// Add style tag to document
const StyleComponent = () => (
  <style dangerouslySetInnerHTML={{ __html: customStyles }} />
);

// Animated Text Component
const AnimatedText = ({ text }) => {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let currentText = "";
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < text.length) {
        currentText += text[index];
        setDisplayText(currentText);
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, [text]);

  return <span>{displayText}</span>;
};

// Hero Component
const Hero = () => {
  return (
    <section
      className="relative bg-[#F4F7F5] text-[#2c5676] py-16 md:py-24 lg:py-32 overflow-hidden"
      style={{ fontFamily: "Maven Pro, sans-serif" }}
    >
      <div className="container mx-auto flex flex-col md:flex-row items-center relative md:px-12">
        <div className="text-left z-10 w-full md:w-1/2 space-y-6">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 relative"
            style={{ fontFamily: "Maven Pro, sans-serif" }}
          >
            <AnimatedText text="Your Trusted Student Health Insurance Mediator" />
            <span
              className="absolute -top-2 -right-8 text-3xl"
              style={{ color: "#FF6B35" }}
            >
              ✦
            </span>
          </h1>
          <p
            className="text-base sm:text-lg md:text-xl max-w-3xl mb-8 opacity-80 animate__animated animate__fadeIn"
            style={{
              fontFamily: "Maven Pro, sans-serif",
              animationDelay: "1s",
            }}
          >
            We provide the best prices for students, all in one place. Choose
            the plan that fits your unique needs, budget, and lifestyle with
            ease — all without the confusion!
          </p>
          <div
            className="animate__animated animate__fadeInUp"
            style={{ animationDelay: "0.5s" }}
          >
            <ScrollLink
              to="HowItWorks"
              smooth={true}
              duration={500}
              className="inline-block bg-[#FF6B35] text-white py-3 px-6 md:px-8 rounded-lg font-semibold text-base md:text-lg hover:bg-[#3B8CC4] transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl cursor-pointer"
            >
              Get Started Now
            </ScrollLink>
          </div>
        </div>
        <div
          className="relative w-full md:w-1/2 h-64 md:h-auto mt-12 md:mt-0 animate__animated animate__fadeIn"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "16px",
            height: "500px",
            animationDelay: "2s",
          }}
        >
          <div
            className="absolute top-4 right-4 bg-[#FF6B35] text-white px-3 py-1 rounded-full text-sm font-semibold"
            style={{ fontFamily: "Maven Pro, sans-serif" }}
          >
            New
          </div>
        </div>
      </div>
    </section>
  );
};

// HowItWorks Component (remains the same as in original code)
const HowItWorks = () => {
  const steps = [
    {
      title: "Sign Up",
      description: "Create an account by providing your basic information.",
      icon: "📝",
      color: "#3B8CC4",
    },
    {
      title: "Choose Plan",
      description: "Browse through various insurance plans.",
      icon: "📋",
      color: "#3B8CC4",
    },
    {
      title: "Apply",
      description: "Fill out the application form with necessary details.",
      icon: "🖊️",
      color: "#3B8CC4",
    },
    {
      title: "Get Covered",
      description: "Receive confirmation and get health insurance.",
      icon: "✅",
      color: "#3B8CC4",
    },
  ];

  return (
    <section
      id="HowItWorks"
      className="py-16 bg-[#F4F7F5]"
      style={{ fontFamily: "Maven Pro, sans-serif" }}
    >
      <div
        className="text-center mx-auto px-4 sm:px-8 lg:px-16"
        style={{ maxWidth: "1200px" }}
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-[#2c5676] mb-12 relative">
          How It Works
          <span
            className="absolute -top-2 -right-8 text-2xl"
            style={{ color: "#FF6B35" }}
          >
            ✦
          </span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white p-6 md:p-8 rounded-lg shadow-xl hover:scale-105 transition-all duration-300 ease-in-out"
              style={{
                border: `2px solid ${step.color}`,
                borderTopColor: "#FF6B35",
              }}
            >
              <div
                className="text-3xl sm:text-4xl mb-4"
                style={{ color: step.color }}
              >
                {step.icon}
              </div>
              <h3
                className="text-lg md:text-xl font-extrabold"
                style={{
                  fontFamily: "Maven Pro, sans-serif",
                  color: step.color,
                }}
              >
                {step.title}
              </h3>
              <p
                className="text-sm md:text-base font-normal mt-4"
                style={{
                  fontFamily: "Maven Pro, sans-serif",
                  color: step.color,
                }}
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// FlipCard Component
const FlipCard = ({ feature }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="relative w-full h-96 perspective-1000 transform-style-3d"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`absolute w-full h-full transition-transform duration-700 
        ${isFlipped ? "rotate-y-180" : ""} 
        preserve-3d cursor-pointer`}
      >
        {/* Front of Card */}
        <div
          className={`absolute w-full h-full backface-hidden bg-[#F4F7F5] 
          rounded-xl shadow-lg p-6 flex flex-col 
          ${isFlipped ? "rotate-y-180 hidden" : ""}`}
        >
          <div className="w-full h-48 mb-5 overflow-hidden rounded-t-xl">
            <img
              src={feature.image}
              alt={feature.title}
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-xl font-bold text-[#3B8CC4] mb-2">
            {feature.title}
          </h3>
          <p className="text-[#2c5676] mb-4 flex-grow">{feature.description}</p>
          <div className="text-center">
            <span className="text-[#FF6B35] font-semibold">
              Tap to Explore ↻
            </span>
          </div>
        </div>

        {/* Back of Card */}
        <div
          className={`absolute w-full h-full backface-hidden bg-[#3B8CC4] 
          text-white p-6 rotate-y-180 flex flex-col 
          ${isFlipped ? "" : "hidden"}`}
        >
          <h3 className="text-xl font-bold mb-4">Detailed Benefits</h3>
          <ul className="space-y-3 flex-grow">
            {feature.detailedBenefits.map((benefit, i) => (
              <li key={i} className="flex items-center">
                <span className="mr-2 text-[#FF6B35]">✓</span>
                {benefit}
              </li>
            ))}
          </ul>
          <button
            className="bg-[#FF6B35] text-white px-4 py-2 rounded-lg 
            hover:bg-opacity-90 transition-colors self-center"
            onClick={(e) => {
              e.stopPropagation();
              setIsFlipped(false);
            }}
          >
            Back to Overview
          </button>
        </div>
      </div>
    </div>
  );
};

// Features Component
const Features = () => {
  const featuresList = [
    {
      title: "Comprehensive Coverage",
      description:
        "Tailored health insurance plans that cover everything from routine check-ups to emergency services.",
      image: featuresImage1,
      detailedBenefits: [
        "Routine Medical Check-ups",
        "Emergency Room Coverage",
        "Specialized Treatment Options",
        "Preventive Care Services",
        "Nationwide Hospital Network",
      ],
    },
    {
      title: "Affordable Options",
      description:
        "Budget-friendly plans designed specifically for students' financial constraints.",
      image: featuresImage2,
      detailedBenefits: [
        "Flexible Monthly Payments",
        "Student-Specific Discounts",
        "No Hidden Fees Guarantee",
        "Low-Cost Preventive Services",
        "Customizable Coverage Levels",
      ],
    },
    {
      title: "Easy Management",
      description:
        "Digital-first approach to manage your health insurance seamlessly from your dashboard.",
      image: featuresImage3,
      detailedBenefits: [
        "Mobile App Integration",
        "24/7 Online Claims Processing",
        "Virtual Consultation Options",
        "Digital Insurance Card",
        "Real-Time Support Chat",
      ],
    },
  ];

  return (
    <section
      className="py-16 bg-white"
      style={{ fontFamily: "Maven Pro, sans-serif" }}
    >
      <div className="container mx-auto px-4" style={{ maxWidth: "1200px" }}>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-[#2c5676] mb-12 relative">
          Why Choose Our Student Health Insurance
          <span
            className="absolute -top-2 -right-8 text-2xl"
            style={{ color: "#FF6B35" }}
          >
            ✦
          </span>
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {featuresList.map((feature, index) => (
            <FlipCard key={index} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Service Providers Component
const ServiceProviders = () => {
  const providers = [
    {
      name: "Blue Cross Blue Shield",
      logo: "https://www.bcbs.com/dA/9bd399dc-3e59-4c49-a392-23672d31f143",
      color: "#0060A9",
    },
    {
      name: "UnitedHealthcare",
      logo: "https://pbs.twimg.com/profile_images/1288477544967286789/JNo-FTym_400x400.png",
      color: "#4F2C8E",
    },
    {
      name: "Aetna",
      logo: "https://cdn.prod.website-files.com/5cd06573f0a28dce76ef883f/5cd49484b2931a5124a60deb_logo-aetna.png",
      color: "#D13F3F",
    },
    {
      name: "Cigna",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4l3joj2Wl5mTSIXfIAvA5ZV-6tWcfKxj8Iw&s",
      color: "#E21E32",
    },
    {
      name: "Humana",
      logo: "https://i0.wp.com/claimlinx.com/wp-content/uploads/2022/03/humana_logo.png?fit=690%2C400&ssl=1",
      color: "#0038A8",
    },
    {
      name: "Kaiser Permanente",
      logo: "https://yt3.googleusercontent.com/rj8-xuOQXuBDlkTUGPetlCRHIUo-c-tPHsM4zHW6wi55K3ogBH1kPQDHbG3XF_aAPs08scZj=s900-c-k-c0x00ffffff-no-rj",
      color: "#083C7B",
    },
  ];

  return (
    <section
      className="py-16 bg-[#F4F7F5]"
      style={{ fontFamily: "Maven Pro, sans-serif" }}
    >
      <div className="container mx-auto px-4" style={{ maxWidth: "1200px" }}>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-[#2c5676] mb-12 relative">
          Our Trusted Insurance Providers
          <span
            className="absolute -top-2 -right-8 text-2xl"
            style={{ color: "#FF6B35" }}
          >
            ✦
          </span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {providers.map((provider, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="w-full h-24 flex items-center justify-center mb-4">
                <img
                  src={provider.logo}
                  alt={`${provider.name} Logo`}
                  className="max-h-16 max-w-full object-contain"
                />
              </div>
              <h3
                className="text-lg font-semibold text-[#2c5676]"
                style={{ color: provider.color }}
              >
                {provider.name}
              </h3>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-[#2c5676] max-w-2xl mx-auto text-base sm:text-lg">
            We partner with top-tier insurance providers to offer you
            comprehensive and affordable health coverage tailored to student
            needs.
          </p>
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      name: "Emily Rodriguez",
      major: "International Business",
      university: "NYU",
      quote:
        "As an international student, navigating health insurance was overwhelming until I found this service. They made the process so simple and affordable!",
      image:
        "https://www.rd.com/wp-content/uploads/2017/09/01-shutterstock_476340928-Irina-Bg.jpg?fit=640%2C427",
    },
    {
      name: "Michael Chen",
      major: "Computer Science",
      university: "UC Berkeley",
      quote:
        "The coverage is comprehensive, and the digital management is incredibly user-friendly. I can access my insurance details anytime, anywhere.",
      image:
        "https://knowledgeenthusiast.com/wp-content/uploads/2022/04/pexels-photo-6694422.jpeg",
    },
    {
      name: "Sarah Johnson",
      major: "Medical Sciences",
      university: "Johns Hopkins",
      quote:
        "Having experienced the healthcare system from both patient and future medical professional perspectives, I'm impressed by the quality and range of plans offered.",
      image: "https://buffer.com/library/content/images/2022/03/amina.png",
    },
  ];

  return (
    <section
      className="py-16 bg-[#ffffff]"
      style={{ fontFamily: "Maven Pro, sans-serif" }}
    >
      <div className="container mx-auto px-4" style={{ maxWidth: "1200px" }}>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-[#2c5676] mb-12 relative">
          What Students Are Saying
          <span
            className="absolute -top-2 -right-8 text-2xl"
            style={{ color: "#FF6B35" }}
          >
            ✦
          </span>
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full mr-4 object-cover"
                />
                <div>
                  <h3 className="text-lg font-bold text-[#3B8CC4]">
                    {testimonial.name}
                  </h3>
                  <p className="text-sm text-[#2c5676]">
                    {testimonial.major}, {testimonial.university}
                  </p>
                </div>
              </div>
              <blockquote className="italic text-[#2c5676] mb-4">
                "{testimonial.quote}"
              </blockquote>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-[#FF6B35] text-xl">
                    ★
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Main HomePage Component

const HomePage = () => {
  return (
    <div className="font-['Maven_Pro', sans-serif]">
      <Hero />
      <HowItWorks />
      <Features />
      <ServiceProviders />
      <Testimonials />
      {/* <Footer /> */}
    </div>
  );
};

export default HomePage;
