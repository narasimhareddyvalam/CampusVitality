import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm, ValidationError } from "@formspree/react";

const ContactUs = () => {
  const [state, handleSubmit] = useForm("xrbgvbgl"); // Replace "xrbgvbgl" with your actual Formspree endpoint

  // Show success toast after form submission
  if (state.succeeded) {
    toast.success("Message sent successfully!");
  }

  return (
    <div className="min-h-screen p-6 font-lato flex justify-center mt-[100px]">
      <div className="w-4/5 mx-auto">
        {/* Page Header */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1D3557] mb-6 tracking-wide">
            Get in Touch
          </h1>
          <p className="text-lg text-[#3B8CC4] max-w-3xl mx-auto leading-relaxed">
            Reach out to us for any questions or support regarding our insurance
            plans. Our team is here to help you every step of the way.
          </p>
        </section>

        {/* Contact Form */}
        <section className="mb-20">
          <div className="bg-white p-10 rounded-xl shadow-2xl">
            <h2 className="text-3xl font-semibold text-[#1D3557] mb-8 text-center">
              Send Us a Message
            </h2>
            <form
              className="space-y-6"
              onSubmit={handleSubmit}
              action="https://formspree.io/f/xrbgvbgl" // Formspree endpoint
            >
              <div className="flex flex-col md:flex-row gap-6">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  required
                  className="flex-1 border border-[#1D3557] rounded-lg p-4 focus:ring-2 focus:ring-[#1D3557] transition-all duration-300"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  required
                  className="flex-1 border border-[#1D3557] rounded-lg p-4 focus:ring-2 focus:ring-[#1D3557] transition-all duration-300"
                />
                <ValidationError
                  prefix="Email"
                  field="email"
                  errors={state.errors}
                />
              </div>
              <textarea
                name="message"
                placeholder="Your Message"
                rows="6"
                required
                className="w-full border border-[#1D3557] rounded-lg p-4 focus:ring-2 focus:ring-[#1D3557] transition-all duration-300"
              ></textarea>
              <ValidationError
                prefix="Message"
                field="message"
                errors={state.errors}
              />
              <button
                type="submit"
                className="bg-[#1D3557] text-white py-4 px-10 rounded-full hover:bg-[#3B8CC4] transition-all transform hover:scale-110 shadow-xl mx-auto block"
                disabled={state.submitting}
              >
                Send Message
              </button>
            </form>
          </div>
        </section>

        {/* Contact Details */}
        <section>
          <h2 className="text-3xl md:text-4xl font-semibold text-[#1D3557] mb-12 text-center">
            Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "Call Us",
                content: "+1 (857) 456-7890",
                icon: "📞",
              },
              {
                title: "Email Us",
                content: "support@campusvitality.com",
                icon: "📧",
              },
              {
                title: "Visit Us",
                content: "360 Huntington Avenue, Boston, MA",
                icon: "📍",
              },
            ].map((detail, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out hover:shadow-2xl text-center"
                style={{ border: "2px solid #1D3557" }}
              >
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#A8C9E8] text-[#1D3557] text-3xl mb-6 mx-auto">
                  {detail.icon}
                </div>
                <h3 className="text-2xl font-semibold text-[#1D3557] mb-4">
                  {detail.title}
                </h3>
                <p className="text-gray-600">{detail.content}</p>
              </div>
            ))}
          </div>
        </section>
        <ToastContainer position="top-center" autoClose={5000} />
      </div>
    </div>
  );
};

export default ContactUs;
