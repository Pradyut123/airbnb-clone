import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import PerksLabels from "../components/PerksLabels";
import axios from "axios";

const Places = () => {
  const { action } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [photoLink, setPhotoLink] = useState([]);
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [price, setPrice] = useState(100);

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

  async function addPhotosByLink(e) {
    e.preventDefault();
    try {
      const { data: filename } = await axios.post("/api/upload-by-link", {
        link: photoLink,
      });
      setAddedPhotos((prev) => {
        return [...prev, filename];
      });
      setPhotoLink("");
    } catch (error) {
      console.error("Axios request failed:", error);
    }
  }

  // async function uploadPhoto(e) {
  //   const files = e.target.files;
  //   const data = new FormData();
  //   for (let i = 0; i < files.length; i++) {
  //     data.append("photos", files[i]);
  //   }
  //   data.set("photos", files);
  //   await axios.post("/upload", data, {
  //     headers: {
  //       "Content-Type": "multipart/form-data",
  //     },
  //   });
  // }

  function uploadPhoto(ev) {
    const files = ev.target.files;
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
    }
    axios
      .post("/api/upload", data, {
        headers: { "Content-type": "multipart/form-data" },
      })
      .then((response) => {
        const { data: filenames } = response;
        onChange((prev) => {
          return [...prev, ...filenames];
        });
      });
  }

  return (
    <div className="">
      {action !== "new" && (
        <div className="text-center">
          <Link
            className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full"
            to={"/account/places/new"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
                clipRule="evenodd"
              />
            </svg>
            Add new Place
          </Link>
        </div>
      )}
      {action === "new" && (
        <div>
          <form>
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
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={"Add using a link.....jpg"}
                value={photoLink}
                onChange={(e) => setPhotoLink(e.target.value)}
              />
              <button
                onClick={addPhotosByLink}
                className="bg-gray-200 px-4 rounded-2xl"
              >
                Add&nbsp;Photo
              </button>
            </div>

            <div className="mt-2 grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {addedPhotos.length > 0 &&
                addedPhotos.map((link) => (
                  <div className="h-32 flex">
                    <img
                      className="rounded-2xl w-full"
                      src={"http://localhost:5000/uploads/" + link}
                      alt=""
                    />
                  </div>
                ))}
              <label className="h-32 flex items-center cursor-pointer gap-1 justify-center border bg-transparent rounded-2xl p-2 text-2xl text-gray-600">
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={uploadPhoto}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                  />
                </svg>
                Upload
              </label>
            </div>

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
      )}
    </div>
  );
};

export default Places;
