import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#2c5676] text-white py-8">
      <div className="container mx-auto text-center space-y-6">
        {/* Logo/Brand Name */}
        <h3
          className="text-xl font-bold"
          style={{ fontFamily: "Sour Gummy, sans-serif" }}
        >
          CAMPUS VITALITY
        </h3>
        <p className="text-sm">
          Your trusted partner for student health insurance, offering affordable
          and comprehensive plans tailored for campus life.
        </p>

        {/* Navigation Links */}
        <div className="flex justify-center space-x-6">
          <a
            href="/about-us"
            className="hover:text-[#FF6B35] transition duration-300"
          >
            About Us
          </a>
          <a
            href="/contact-us"
            className="hover:text-[#FF6B35] transition duration-300"
          >
            Contact Us
          </a>
          <a
            href="/browse-plans"
            className="hover:text-[#FF6B35] transition duration-300"
          >
            Browse Plans
          </a>
          <a
            href="/my-plans"
            className="hover:text-[#FF6B35] transition duration-300"
          >
            My Plans
          </a>
        </div>

        {/* Social Media Links */}
        <div className="flex justify-center space-x-6 text-2xl">
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#FF6B35] transition duration-300"
          >
            <FaFacebook />
          </a>
          <a
            href="https://www.twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#FF6B35] transition duration-300"
          >
            <FaTwitter />
          </a>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#FF6B35] transition duration-300"
          >
            <FaInstagram />
          </a>
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#FF6B35] transition duration-300"
          >
            <FaLinkedin />
          </a>
        </div>

        {/* Copyright */}
        <p className="text-sm">
          © {new Date().getFullYear()} Campus Vitality. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
