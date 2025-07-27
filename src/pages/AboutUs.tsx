import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const AboutUs: React.FC = () => {
  return (
    <>
      <Header />
      <div className="relative flex flex-col overflow-hidden bg-[#0D0D0D] min-h-screen w-full">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/9de6021644f9415b8e6ba1d1ef4607ce/d527bd6bc2f45786143bfd81a1bf4f624e00cbfb?placeholderIfAbsent=true"
          className="aspect-[1.07] object-contain w-full max-w-[1440px] absolute z-0 h-auto right-0 top-0 max-md:max-w-full"
          alt="Background"
        />
        <main className="relative z-10 text-white px-4 py-16 header-spacing-large max-w-6xl mx-auto" id="main-content">
          <h1 className="text-4xl font-bold mb-8">About Us</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
              <div className="space-y-4">
                <p>
                  <strong>Email:</strong>{' '}
                  <a href="mailto:contact@promptix.com" className="hover:text-gray-300">
                    contact@promptix.com
                  </a>
                </p>
                <p>
                  <strong>Phone:</strong>{' '}
                  <a href="tel:+1234567890" className="hover:text-gray-300">
                    +1 (234) 567-890
                  </a>
                </p>
                <p>
                  <strong>Address:</strong>
                  <br />
                  123 AI Street
                  <br />
                  Tech Valley, CA 94025
                  <br />
                  United States
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="mb-4">
                At Promptix, we're dedicated to revolutionizing the way people interact with AI technology. 
                Our mission is to make AI prompting more accessible, efficient, and powerful for everyone.
              </p>
              <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Innovation in AI Technology</li>
                <li>User-Centric Design</li>
                <li>Reliability & Security</li>
                <li>Continuous Improvement</li>
              </ul>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default AboutUs;
