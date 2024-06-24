import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const getPlaceId = async (apiKey: string, placeName: string) => {
  const response = await axios.get('https://maps.googleapis.com/maps/api/place/findplacefromtext/json', {
    params: {
      input: placeName,
      inputtype: 'textquery',
      fields: 'place_id',
      key: apiKey,
    },
  });
  return response.data.candidates[0]?.place_id;
};

const getBusinessDetails = async (placeId: string, apiKey: string) => {
  const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
    params: {
      place_id: placeId,
      fields: 'name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,opening_hours',
      key: apiKey,
    },
  });
  return response.data.result;
};

const getReviews = async (placeId: string, apiKey: string) => {
  const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
    params: {
      place_id: placeId,
      fields: 'review',
      key: apiKey,
    },
  });
  return response.data.result.reviews;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { api_key, place_name } = req.body;

  if (!api_key || !place_name) {
    return res.status(400).json({ error: 'API key and place name are required' });
  }

  try {
    const placeId = await getPlaceId(api_key, place_name);
    if (!placeId) {
      return res.status(400).json({ error: 'Place not found' });
    }

    const businessDetails = await getBusinessDetails(placeId, api_key);
    const reviews = await getReviews(placeId, api_key);

    const businessInfo = {
      details: businessDetails,
      reviews,
    };

    return res.status(200).json(businessInfo);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};