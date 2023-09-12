import React, { useState } from "react";
import PerksLabels from "../components/PerksLabels";
import axios from "axios";
import PhotosUploader from "../components/PhotosUploader";
import AccountNav from "../components/AccountNav";

const PlacesForm = () => {
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [price, setPrice] = useState(100);
  const [redirect, setRedirect] = useState(false);

  function inputHeader(text) {
    return <h2 className="text-2xl mt-4">{text}</h2>;
  }

  function inputDescription(text) {
    return <p className="text-gray-500 text-sm">{text}</p>;
  }

  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }

  async function addNewPlace(e) {
    e.preventDefault();
    await axios.post("/api/places", {
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
    });
  }

  return (
    <>
      <div>
        <AccountNav />
        <form onSubmit={addNewPlace}>
          {preInput("Title", "")}
          <input
            type="text"
            placeholder="title, for example: My Lovely Appartment"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {preInput("Address", "")}
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          {preInput("Photos", "")}
          <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />

          {preInput("Description", "")}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {preInput("Perks", "select all the perks of your place")}
          <div className="grid gap-2 mt-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            <PerksLabels selected={perks} onChange={setPerks} />
          </div>

          {preInput("Extra Info", "House rules, etc")}
          <textarea
            value={extraInfo}
            onChange={(e) => setExtraInfo(e.target.value)}
          />

          {preInput("Check in&out times", "Add check in and out time")}
          <div className="grid gap-2 sm:grid-cols-3">
            <div>
              <h3 className="mt-2 -mb-2">Check in time</h3>
              <input
                type="text"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                placeholder="14:00"
              />
            </div>
            <div>
              <h3 className="mt-2 -mb-2">Check out time</h3>
              <input
                type="text"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                placeholder="20:00"
              />
            </div>
            <div>
              <h3 className="mt-2 -mb-2">Max number of guests</h3>
              <input
                type="number"
                value={maxGuests}
                onChange={(e) => setMaxGuests(e.target.value)}
                placeholder="4"
              />
            </div>
          </div>
          <button className="primary my-4">save</button>
        </form>
      </div>
    </>
  );
};

export default PlacesForm;
