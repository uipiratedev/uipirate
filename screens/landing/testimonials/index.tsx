"use client";
import React from "react";

import TestimonialCards from "./testimonialCards";
import GlassBadge from "@/components/GlassBadge";
import testimonialData from "@/data/testimonials.json";

// Build Review + AggregateRating JSON-LD from real testimonial data
const reviewSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://uipirate.com/#organization",
  name: "UI Pirate by Vishal Anand",
  alternateName: ["UI Pirate", "uipirate", "uipirates"],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5.0",
    bestRating: "5",
    worstRating: "1",
    reviewCount: String(testimonialData.length),
  },
  review: testimonialData.slice(0, 8).map((t) => ({
    "@type": "Review",
    author: {
      "@type": "Person",
      name: t.name,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: "5",
      bestRating: "5",
    },
    reviewBody: t.review,
    name: t.occupation || "Client Review",
  })),
};

function LandingTestimonials() {
  return (
    <div className=" pt-20 max-md:pt-12 ">
      {/* Review schema for Google rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />

      <div className="autoShow">
        <div className=" flex flex-col items-center justify-center pb-4 max-md:pb-4">
          <GlassBadge variant="gradient">
            testimonials
          </GlassBadge>
        </div>

        <h2 className="heading-center">
          <span className="text-gray-900">Loved by SaaS Founders &</span>
          <br className="max-md:hidden" />{" "}
          <span className="text-brand-orange">Product Teams</span>
        </h2>
      </div>
      <div className="autoShowBottom">
        <TestimonialCards />
      </div>
    </div>
  );
}

export default LandingTestimonials;
