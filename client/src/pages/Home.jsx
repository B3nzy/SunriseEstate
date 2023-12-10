/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";
import Footer from "./Footer";

export default function Home() {
  SwiperCore.use([Navigation]);
  const [offerListings, setOfferListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/listing/get?offer=true&limit=4`);
        const data = await res.json();
        if (data.success == false) {
          return;
        }
        setOfferListings(data.listings);
        fetchRentListings();
      } catch (err) {
        console.log(err);
      }
    })();

    const fetchRentListings = async () => {
      try {
        const res = await fetch(`/api/listing/get?type=rent&limit=4`);
        const data = await res.json();
        if (data.success == false) {
          return;
        }
        setRentListings(data.listings);
        fetchSaleListings();
      } catch (err) {
        console.log(err);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch(`/api/listing/get?type=sale&limit=4`);
        const data = await res.json();
        if (data.success == false) {
          return;
        }
        setSaleListings(data.listings);
      } catch (err) {
        console.log(err);
      }
    };
  }, []);

  return (
    <div>
      {/* {Top} */}
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find your next <span className="text-slate-500">perfect</span>
          <br />
          place with ease
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          Sunrise Estate is the best place to find your next perfect place to
          live.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link
          to={`/search`}
          className="text-xs sm:text-sm text-blue-800 font-bold hover:underline"
        >
          Let&apos;s get started...
        </Link>
      </div>
      {/* {Swiper} */}
      <Swiper className="shadow-lg" navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                className="h-[500px]"
                key={listing._id}
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>
      {/* {Listing results for offer and rent} */}
      <div className="max-w-full mx-auto p-8 flex flex-col gap-8 my-10">
        {offerListings && offerListings.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent offers :{" "}
              </h2>
              <Link
                className="text-blue-700 text-sm hover:underline"
                to={`/search?offer=true`}
              >
                Show more offers
              </Link>
            </div>
            <div className="flex flex-row flex-wrap gap-6">
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places for rent :{" "}
              </h2>
              <Link
                className="text-blue-700 text-sm hover:underline"
                to={`/search?type=rent`}
              >
                Show more places for rent
              </Link>
            </div>
            <div className="flex flex-row flex-wrap gap-6">
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places for sale :{" "}
              </h2>
              <Link
                className="text-blue-700 text-sm hover:underline"
                to={`/search?type=sale`}
              >
                Show more places for sale
              </Link>
            </div>
            <div className="flex flex-row flex-wrap gap-6">
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
