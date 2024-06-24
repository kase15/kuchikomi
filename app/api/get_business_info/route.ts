import { NextRequest, NextResponse } from 'next/server';
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

export async function POST(req: NextRequest) {
  const { api_key, place_name } = await req.json();

  if (!api_key || !place_name) {
    return NextResponse.json({ error: 'API key and place name are required' }, { status: 400 });
  }

  try {
    const placeId = await getPlaceId(api_key, place_name);
    if (!placeId) {
      return NextResponse.json({ error: 'Place not found' }, { status: 400 });
    }

    const businessDetails = await getBusinessDetails(placeId, api_key);
    const reviews = await getReviews(placeId, api_key);

    const businessInfo = {
      details: businessDetails,
      reviews,
    };

    return NextResponse.json(businessInfo, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
