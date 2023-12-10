/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactLoading from "react-loading";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { IoLocationSharp } from "react-icons/io5";
import { GiBed } from "react-icons/gi";
import { GiBathtub } from "react-icons/gi";
import { LuParkingCircle } from "react-icons/lu";
import { FaCouch } from "react-icons/fa";
import { useSelector } from "react-redux";
import Contact from "../components/Contact";
import { FaDollarSign } from "react-icons/fa6";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const { currentUser } = useSelector((state) => state.user);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [contact, setContact] = useState(false);

  const params = useParams();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(false);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setLoading(false);
          setError(data.message);
          return;
        }
        console.log(data);
        setLoading(false);
        setListing(data.listing);
      } catch (err) {
        setLoading(false);
        setError(err.message);
      }
    })();
  }, [params.listingId]);

  return (
    <div>
      {loading && (
        <ReactLoading
          type={"spinningBubbles"}
          color={"#2B2A4C"}
          height={120}
          width={120}
          className="mx-auto my-16"
        />
      )}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {listing && !loading && !error && (
        <div className="">
          <Swiper className="shadow-lg" navigation>
            {listing.imageUrls.map((url, index) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${url}) center no-repeat fixed`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="max-w-5xl mx-auto p-3 gap-4 my-10">
            <div className="flex flex-row justify-between flex-wrap">
              <h1 className="text-3xl font-semibold my-2">{listing.name}</h1>
              <div className="flex flex-row items-center text-xl text-slate-600 border border-slate-400 p-3 shadow-md">
                <span className="mx-2">Price :</span>
                <FaDollarSign />
                {listing.regularPrice.toLocaleString("en-US")}{" "}
                {listing.type === "rent" ? "/ Month" : ""}
              </div>
            </div>
            <div className="flex flex-row items-center gap-1 text-lg my-5">
              <p className="text-green-600">
                <IoLocationSharp />
              </p>
              <p className="text-slate-700">{listing.address}</p>
            </div>

            <div className="flex flex-row flex-wrap text-center gap-5">
              <div className="bg-yellow-600 w-40 rounded p-2 font-semibold shadow-lg">
                For {listing.type === "rent" ? "Rent" : "Sell"}
              </div>
              {listing.discountPrice > 0 && listing.offer && (
                <div className="bg-lime-600 w-40 rounded p-2 font-semibold shadow-lg">
                  Discount : ${listing.discountPrice.toLocaleString("en-US")}
                </div>
              )}
            </div>
            <p className="my-4">
              <span className="font-semibold">Description : </span>
              {listing.description}
            </p>
            <div className="flex flex-row flex-wrap text-center gap-x-8 gap-y-1 font-semibold">
              <div className="text-emerald-700 flex flex-row items-center gap-1">
                <GiBed />
                {listing.bedrooms} Beds
              </div>
              <div className="text-emerald-700 flex flex-row items-center gap-1">
                <GiBathtub />
                {listing.bathrooms} Baths
              </div>
              {listing.parking && (
                <div className="text-emerald-700 flex flex-row items-center gap-1">
                  <LuParkingCircle />
                  Parking
                </div>
              )}
              {listing.furnished && (
                <div className="text-emerald-700 flex flex-row items-center gap-1">
                  <FaCouch />
                  Furnished
                </div>
              )}
            </div>
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                className="bg-slate-600 text-white rounded-lg uppercase hover:opacity-90 p-3 w-full my-6 hover:shadow-lg"
                onClick={() => setContact(true)}
              >
                Contact landlord
              </button>
            )}
            {contact && <Contact listing={listing} />}
          </div>
        </div>
      )}
    </div>
  );
}
