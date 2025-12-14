import React from 'react';
import Header from './Header';
import Hero from './Hero';
import HowItWorks from './HowItWorks';
import Advantages from './Advantages';
import FeatureGraphs from './FeatureGraphs';
import Team from './Team';
import FAQ from './FAQ';
import Footer from './Footer';
import RevealOnScroll from './RevealOnScroll';

const LandingPage = () => {
  return (
    <div className="font-sans antialiased text-gray-900 bg-white">
      <Header />
      <Hero /> {/* Hero usually has its own animations, keeping it outside or inside depends on preference. Let's keep it out to execute immediately on load? Or wrap it. Let's wrap it for consistency but maybe Hero needs to show up immediately. The user said "unveiling every section". Let's wrap subsequent sections mostly. Hero usually loads instantly. Let's wrap everything BUT Header/Footer? actually user said "unveiling every section". Let's wrap standard content sections. */}

      <RevealOnScroll width="100%">
        <HowItWorks />
      </RevealOnScroll>

      <RevealOnScroll width="100%">
        <Advantages />
      </RevealOnScroll>

      <RevealOnScroll width="100%">
        <FeatureGraphs />
      </RevealOnScroll>

      <RevealOnScroll width="100%">
        <Team />
      </RevealOnScroll>

      <RevealOnScroll width="100%">
        <FAQ />
      </RevealOnScroll>

      <Footer />
    </div>
  );
};

export default LandingPage;