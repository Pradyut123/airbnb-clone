import { useState } from "react";

import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Layout from "./Layout";
import Register from "./pages/Register";
import axios from "axios";
import { UserContextProvider } from "./contextApi/UserContext";
import Profile from "./pages/Profile";
import Places from "./pages/Places";
import PlacesForm from "./pages/PlacesForm";
import SinglePlace from "./pages/SinglePlace";
import UserBookings from "./pages/UserBookings";
import SingleBooking from "./pages/SingleBooking";

// axios.defaults.baseURL = "http://localhost:5000";
// axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account/:subpage?" element={<Profile />} />
          {/* <Route path="/account/:subpage/:action" element={<Account />} /> */}
          {/* <Route path="/account/bookings" element={<Account />} /> */}
          <Route path="/account/places" element={<Places />} />
          <Route path="/account/places/new" element={<PlacesForm />} />
          <Route path="/account/places/:id" element={<PlacesForm />} />
          <Route path="place/:id" element={<SinglePlace />} />
          <Route path="/account/bookings" element={<UserBookings />} />
          <Route path="/account/bookings/:id" element={<SingleBooking />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
