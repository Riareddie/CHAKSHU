
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

const UserReviews = () => {
  const reviews = [
    {
      name: "Priya Sharma",
      location: "Mumbai",
      rating: 5,
      review: "This app saved me from a major fraud attempt. The one-tap reporting is incredibly fast and the call recording feature provided crucial evidence.",
      date: "2 days ago"
    },
    {
      name: "Rajesh Kumar",
      location: "Delhi",
      rating: 5,
      review: "Love the offline drafting feature! I can report fraud even when my internet is slow. Push notifications keep me updated about new scams.",
      date: "1 week ago"
    },
    {
      name: "Anjali Patel",
      location: "Bangalore",
      rating: 4,
      review: "GPS location sharing helped authorities track down a fraud network in my area. Great app for community safety!",
      date: "2 weeks ago"
    },
    {
      name: "Vikram Singh",
      location: "Chennai",
      rating: 5,
      review: "The real-time caller identification feature is amazing. It warned me about a known fraud number before I even answered.",
      date: "3 weeks ago"
    }
  ];

  const averageRating = 4.8;
  const totalReviews = "25,847";

  return (
    <section>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          What Users Are Saying
        </h2>
        <div className="flex justify-center items-center gap-4 mb-4">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className={`w-6 h-6 ${star <= averageRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
              />
            ))}
          </div>
          <span className="text-2xl font-bold text-gray-900">{averageRating}</span>
          <span className="text-gray-600">({totalReviews} reviews)</span>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        {reviews.map((review, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-lg">{review.name}</h4>
                  <p className="text-gray-600 text-sm">{review.location}</p>
                </div>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-4">"{review.review}"</p>
              <p className="text-gray-500 text-sm">{review.date}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default UserReviews;
