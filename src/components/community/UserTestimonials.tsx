
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Star, Quote } from "lucide-react";

const UserTestimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      location: "Mumbai, Maharashtra",
      role: "Teacher",
      rating: 5,
      testimonial: "Thanks to this platform, I was able to identify and report a fake job scam that could have cost me ₹50,000. The community warnings saved me from falling victim to fraud.",
      savedAmount: "₹50,000",
      image: "/placeholder.svg"
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      location: "Delhi NCR",
      role: "IT Professional",
      rating: 5,
      testimonial: "The fraud awareness articles helped me educate my elderly parents about common scams. They successfully avoided a tech support scam last month.",
      savedAmount: "₹25,000",
      image: "/placeholder.svg"
    },
    {
      id: 3,
      name: "Anjali Patel",
      location: "Ahmedabad, Gujarat",
      role: "Small Business Owner",
      rating: 5,
      testimonial: "Being part of this community has made me more vigilant. I've helped report 15+ fraud cases and feel proud to contribute to public safety.",
      savedAmount: "Community Impact",
      image: "/placeholder.svg"
    },
    {
      id: 4,
      name: "Vikram Singh",
      location: "Jaipur, Rajasthan",
      role: "Student",
      rating: 5,
      testimonial: "The interactive quiz helped me learn about new fraud patterns. I was able to spot and avoid a cryptocurrency investment scam targeting students.",
      savedAmount: "₹15,000",
      image: "/placeholder.svg"
    },
    {
      id: 5,
      name: "Meera Reddy",
      location: "Hyderabad, Telangana",
      role: "Homemaker",
      rating: 5,
      testimonial: "This platform's real-time alerts warned me about a UPI reversal scam happening in my area. I'm grateful for this community protection.",
      savedAmount: "₹8,000",
      image: "/placeholder.svg"
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <section>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Community Stories
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Real experiences from citizens who have been protected by our community-driven fraud prevention efforts.
        </p>
      </div>

      <Carousel className="w-full max-w-6xl mx-auto">
        <CarouselContent>
          {testimonials.map((testimonial) => (
            <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3">
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <Quote className="h-8 w-8 text-india-saffron opacity-60" />
                  
                  <p className="text-gray-700 leading-relaxed italic">
                    "{testimonial.testimonial}"
                  </p>
                  
                  <div className="flex items-center space-x-1">
                    {renderStars(testimonial.rating)}
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {testimonial.role}
                      </div>
                      <div className="text-xs text-gray-500">
                        {testimonial.location}
                      </div>
                    </div>
                  </div>
                  
                  <Badge className="bg-green-100 text-green-800">
                    Saved: {testimonial.savedAmount}
                  </Badge>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
};

export default UserTestimonials;
