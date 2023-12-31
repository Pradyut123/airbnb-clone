import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PhotoGallary from "../components/PhotoGallary";
import BookingWidget from "../components/BookingWidget";

const SinglePlace = () => {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`/api/places/${id}`).then((response) => {
      setPlace(response.data);
    });
  }, [id]);

  if (!place) return "";
  return (
    <div className="mt-4 bg-gray-100 -mx-8 px-6 pt-8 ">
      <div className="px-18 md:w-3/5 mx-auto">
        <h1 className="text-3xl">{place.title}</h1>
        <a
          className="my-2 block font-semibold underline"
          target="_blank"
          href={"http://maps.google.com/?q=" + place.address}
        >
          {place.address}
        </a>
        <PhotoGallary place={place} />
        <div className="mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
          <div>
            <div className="my-4">
              <h2 className="font-semibold text-2xl">Description</h2>
              {place.description}
            </div>
            Check-in: {place.checkIn}
            <br />
            Check-out: {place.checkOut}
            <br />
            Max number of guests: {place.maxGuests}
          </div>
          <div>
            <BookingWidget place={place} />
          </div>
        </div>
        <div className="bg-white -mx-8 px-8 py-8 border-t">
          <div>
            <h2 className="font-semibold text-2xl">Extra info</h2>
          </div>
          <div className="mb-4 mt-2 text-md text-gray-700 leading-5">
            <ul className="list-disc list-inside space-y-2">
              {place.extraInfo
                .split("\n")
                .map(
                  (point, index) =>
                    point.trim() !== "" && <li key={index} className="mb-2">{point}</li>
                )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePlace;
