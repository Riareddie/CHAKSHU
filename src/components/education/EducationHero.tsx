
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const EducationHero = () => {
  return (
    <section className="bg-gradient-to-r from-india-saffron to-saffron-600 text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Fraud Prevention Education Center
        </h1>
        <p className="text-xl mb-8 max-w-3xl mx-auto">
          Empower yourself with knowledge to identify, prevent, and report fraud. 
          Access comprehensive guides, video tutorials, and resources designed for all age groups.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button variant="outline" className="bg-white text-india-saffron hover:bg-gray-100">
              Report Fraud Now
            </Button>
          </Link>
          <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-india-saffron">
            Download Quick Guide
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EducationHero;
