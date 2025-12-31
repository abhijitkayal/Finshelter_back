import React from "react";

const StarRating = ({ rating }) => {
  // Ensure rating is a number between 1 and 5
  const normalizedRating = Math.min(Math.max(parseInt(rating) || 0, 0), 5);
  
  return (
    <div style={{ color: "gold", display: "inline-block" }}>
      {/* Show filled stars for the rating */}
      {[...Array(normalizedRating)].map((_, i) => (
        <span key={`star-filled-${i}`} style={{ fontSize: '1.2rem' }}>★</span>
      ))}
      
      {/* Show empty stars for the remainder */}
      {[...Array(5 - normalizedRating)].map((_, i) => (
        <span key={`star-empty-${i}`} style={{ fontSize: '1.2rem' }}>☆</span>
      ))}
    </div>
  );
};

export default StarRating; 