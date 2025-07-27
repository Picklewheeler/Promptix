import React from 'react';
import { Header } from '@/components/Header';
import { FeaturesSection } from '@/components/FeaturesSection';
import { SpecialFeatures } from '@/components/SpecialFeatures';
import { Footer } from '@/components/Footer';

const Features: React.FC = () => {
  return (
    <div className="relative flex flex-col overflow-hidden bg-[#0D0D0D] min-h-screen w-full">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/9de6021644f9415b8e6ba1d1ef4607ce/d527bd6bc2f45786143bfd81a1bf4f624e00cbfb?placeholderIfAbsent=true"
        className="aspect-[1.07] object-contain w-full max-w-[1440px] absolute z-0 h-auto right-0 top-0 max-md:max-w-full"
        alt="Background"
      />
      <Header />
      <main className="relative z-10">
        <FeaturesSection />
        <SpecialFeatures />
      </main>
      <Footer />
    </div>
  );
};

export default Features;
