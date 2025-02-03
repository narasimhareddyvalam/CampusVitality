import React, { useState } from "react";

const AboutUs = () => {
  const [activeTab, setActiveTab] = useState("history");

  const milestoneData = [
    { month: "May", event: "Company Founded" },
    { month: "June", event: "First 100 Student Customers" },
    { month: "July", event: "Expanded to 10 Universities" },
    { month: "August", event: "Launched Digital Insurance Platform" },
    { month: "Sept", event: "Received Innovation in Healthcare Award" },
    { month: "Oct", event: "Reached 1,000 Active Student Members" },
  ];

  return (
    <div className="font-['Maven_Pro', sans-serif]">
      {/* Hero Section */}
      <section
        className="relative bg-[#F4F7F5] text-[#2c5676] py-16 md:py-24 lg:py-32 overflow-hidden"
        style={{ fontFamily: "Maven Pro, sans-serif" }}
      >
        <div className="container mx-auto px-4" style={{ maxWidth: "1200px" }}>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 text-center"
            style={{ fontFamily: "Maven Pro, sans-serif" }}
          >
            About Our Student Health Insurance Platform
            <span
              className="absolute -top-2 -right-8 text-3xl"
              style={{ color: "#FF6B35" }}
            >
              ✦
            </span>
          </h1>
          <p
            className="text-lg md:text-xl max-w-3xl mx-auto text-center mb-8 opacity-80"
            style={{
              fontFamily: "Maven Pro, sans-serif",
            }}
          >
            We're dedicated to simplifying health insurance for students,
            providing transparent, affordable, and comprehensive coverage.
          </p>
        </div>
      </section>

      {/* Our Mission Section */}
      <section
        className="py-16 bg-white"
        style={{ fontFamily: "Maven Pro, sans-serif" }}
      >
        <div className="container mx-auto px-4" style={{ maxWidth: "1200px" }}>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-[#2c5676] mb-12 relative">
            Our Mission
            <span
              className="absolute -top-2 -right-8 text-2xl"
              style={{ color: "#FF6B35" }}
            >
              ✦
            </span>
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[#2c5676] text-base sm:text-lg mb-4">
                We believe that every student deserves access to quality
                healthcare without financial strain. Our platform was born from
                the understanding that navigating health insurance can be
                overwhelming and expensive.
              </p>
              <p className="text-[#2c5676] text-base sm:text-lg">
                By partnering with top insurance providers and leveraging
                technology, we offer tailored solutions that meet the unique
                needs of students across different universities and backgrounds.
              </p>
            </div>
            <div
              className="bg-[#F4F7F5] p-8 rounded-xl shadow-lg"
              style={{ borderTop: "4px solid #FF6B35" }}
            >
              <h3 className="text-xl font-bold text-[#3B8CC4] mb-4">
                Our Core Values
              </h3>
              <ul className="space-y-3">
                {[
                  "Transparency in Coverage",
                  "Affordability for Students",
                  "Comprehensive Support",
                  "Digital-First Approach",
                  "Student-Centric Design",
                ].map((value, index) => (
                  <li key={index} className="flex items-center text-[#2c5676]">
                    <span className="mr-3 text-[#FF6B35] text-xl">✦</span>
                    {value}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Company History Section */}
      <section
        className="py-16 bg-[#F4F7F5]"
        style={{ fontFamily: "Maven Pro, sans-serif" }}
      >
        <div className="container mx-auto px-4" style={{ maxWidth: "1200px" }}>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-[#2c5676] mb-12 relative">
            Our Journey
            <span
              className="absolute -top-2 -right-8 text-2xl"
              style={{ color: "#FF6B35" }}
            >
              ✦
            </span>
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex mb-6">
                {["history", "impact"].map((tab) => (
                  <button
                    key={tab}
                    className={`px-4 py-2 mr-2 rounded-lg ${
                      activeTab === tab
                        ? "bg-[#3B8CC4] text-white"
                        : "bg-[#F4F7F5] text-[#2c5676]"
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === "history" ? "Our History" : "Our Impact"}
                  </button>
                ))}
              </div>
              {activeTab === "history" ? (
                <p className="text-[#2c5676]">
                  Founded in 2018 by a group of students who experienced the
                  complexities of healthcare, our company started with a simple
                  mission: make health insurance accessible and understandable
                  for students. What began as a small startup in a university
                  dorm room has grown into a nationwide platform serving
                  thousands of students.
                </p>
              ) : (
                <div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <h3 className="text-3xl font-bold text-[#3B8CC4]">
                        10,000+
                      </h3>
                      <p className="text-[#2c5676]">Students Served</p>
                    </div>
                    <div className="text-center">
                      <h3 className="text-3xl font-bold text-[#3B8CC4]">50+</h3>
                      <p className="text-[#2c5676]">Universities Covered</p>
                    </div>
                    <div className="text-center">
                      <h3 className="text-3xl font-bold text-[#3B8CC4]">99%</h3>
                      <p className="text-[#2c5676]">Customer Satisfaction</p>
                    </div>
                    <div className="text-center">
                      <h3 className="text-3xl font-bold text-[#3B8CC4]">
                        24/7
                      </h3>
                      <p className="text-[#2c5676]">Support Availability</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#3B8CC4] mb-6">
                Our Key Milestones
              </h3>
              <div className="space-y-4">
                {milestoneData.map((milestone, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg shadow-md flex items-center"
                  >
                    <div className="w-16 h-16 bg-[#FF6B35] text-white rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      {milestone.month}
                    </div>
                    <p className="text-[#2c5676]">{milestone.event}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section
        className="py-16 bg-white"
        style={{ fontFamily: "Maven Pro, sans-serif" }}
      >
        <div className="container mx-auto px-4" style={{ maxWidth: "1200px" }}>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-[#2c5676] mb-12 relative">
            Meet Our Team
            <span
              className="absolute -top-2 -right-8 text-2xl"
              style={{ color: "#FF6B35" }}
            >
              ✦
            </span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Srinivas Rithik Ghantasala",
                role: "Masters in Information Systems",
                image:
                  "https://media.licdn.com/dms/image/v2/D5603AQEoJCAh1DQsOg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1723187283174?e=1738800000&v=beta&t=zgyOtZ2iu8o5Puvd1ppjha41qg2aMVW1xcGO-w95ELk",
                description:
                  "Handled Backend code, API's and responsiveness of the website",
              },
              {
                name: "Shashank Janke",
                role: "Masters in Information Systems",
                image:
                  "https://media.licdn.com/dms/image/v2/D5603AQGmOdECYkJDbw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1730382873310?e=1738800000&v=beta&t=Gl1PeSJJe9vVK8QuQOJ61wWIKE04XObUJ_7shfSkBPY",
                description:
                  "Handled Sales users related pages and populating data",
              },
              {
                name: "Kallem Harsha Vardhan Reddy",
                role: "Masters in Information Systems",
                image:
                  "https://media.licdn.com/dms/image/v2/D5603AQFf88223qqZhQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1720375094020?e=1738800000&v=beta&t=pV5GZlzoJji0luqQAZOt4dcfzo9n5YBvKDFoz1_zEEY",
                description:
                  "Handled Admin releated services and booking information",
              },
              {
                name: "Narasimha Reddy",
                role: "Masters in Software Engineering Systems",
                image:
                  "https://media.licdn.com/dms/image/v2/D5603AQExrYXX3Q2vaA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1730353093386?e=1738800000&v=beta&t=S2tw_KVAfVBTKyASe5CNZGBCbRyw6k2EiCd4AkEmHsQ",
                description:
                  "Created User Interface and handled student services",
              },
              {
                name: "Sreeja Pulaparty",
                role: "Masters in Software Engineering Systems",
                image:
                  "https://media.licdn.com/dms/image/v2/D5603AQF95u6TWO5FdA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1710506297115?e=1738800000&v=beta&t=oArDWWCtI43-1AhNEbZ369pdxVPX5H1vvA_bpSjEpis",
                description:
                  "Handled Invoice generation and verification services",
              },
            ].map((member, index) => (
              <div
                key={index}
                className="bg-[#F4F7F5] p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-bold text-center text-[#3B8CC4]">
                  {member.name}
                </h3>
                <p className="text-center text-[#2c5676] mb-2">{member.role}</p>
                <p className="text-center text-[#2c5676] opacity-80">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
