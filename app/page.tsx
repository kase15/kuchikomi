'use client';

import React, { useState } from 'react';
import axios from 'axios';

interface Review {
  author_name: string;
  author_url: string;
  language: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
}

interface BusinessDetails {
  name: string;
  formatted_phone_number: string;
  website: string;
  rating: number;
  user_ratings_total: number;
  formatted_address: string;
  opening_hours?: {
    weekday_text: string[];
  };
}

interface BusinessInfo {
  details: BusinessDetails;
  reviews: Review[];
}

const Home: React.FC = () => {
  const [apiKey, setApiKey] = useState('AIzaSyBycZxuEp1knHfB7iKhe8Z8tq5CAhG1TBU'); // 初期値としてAPIキーを設定
  const [placeName, setPlaceName] = useState('');
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage('');
    setBusinessInfo(null);

    try {
      const response = await axios.post('/api/get_business_info', {
        api_key: apiKey,
        place_name: placeName,
      });

      setBusinessInfo(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response ? error.response.data.error : 'Error occurred');
      } else {
        setErrorMessage('An unexpected error occurred');
      }
    }
  };

  return (
    <div>
      <h1>Google Business Info Fetcher</h1>
      <form onSubmit={handleSubmit}>
        <label>
          API Key:
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Place Name:
          <input
            type="text"
            value={placeName}
            onChange={(e) => setPlaceName(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Fetch Info</button>
      </form>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {businessInfo && (
        <div>
          <h2>Business Details</h2>
          <p><strong>Name:</strong> {businessInfo.details.name}</p>
          <p><strong>Address:</strong> {businessInfo.details.formatted_address}</p>
          <p><strong>Phone:</strong> {businessInfo.details.formatted_phone_number}</p>
          <p><strong>Website:</strong> <a href={businessInfo.details.website} target="_blank" rel="noopener noreferrer">{businessInfo.details.website}</a></p>
          <p><strong>Rating:</strong> {businessInfo.details.rating} ({businessInfo.details.user_ratings_total} reviews)</p>
          {businessInfo.details.opening_hours && (
            <div>
              <h3>Opening Hours</h3>
              <ul>
                {businessInfo.details.opening_hours.weekday_text.map((text, index) => (
                  <li key={index}>{text}</li>
                ))}
              </ul>
            </div>
          )}
          <h2>Reviews</h2>
          <ul>
            {businessInfo.reviews.map((review, index) => (
              <li key={index}>
                <p><strong>Author:</strong> <a href={review.author_url} target="_blank" rel="noopener noreferrer">{review.author_name}</a></p>
                <p><strong>Rating:</strong> {review.rating}</p>
                <p><strong>Time:</strong> {review.relative_time_description}</p>
                <p>{review.text}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Home;
