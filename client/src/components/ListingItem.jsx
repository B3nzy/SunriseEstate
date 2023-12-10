/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { Link } from "react-router-dom";
import { IoLocationSharp } from "react-icons/io5";
import { GiBed } from "react-icons/gi";
import { GiBathtub } from "react-icons/gi";
import { FaDollarSign } from "react-icons/fa6";

export default function ListingItem(props) {
  const { listing } = props;
  return (
    <div className="bg-white gap-4 shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-80">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.imageUrls[0]}
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition ease-in-out duration-300"
        />

        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="text-xl font-semibold text-slate-600 truncate">
            {listing.name}
          </p>
          <div className="flex flex-row items-center gap-1">
            <IoLocationSharp className="text-green-600" />
            <p className="text-gray-600 truncate text-sm w-full">
              {listing.address}
            </p>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {listing.description}
          </p>
          <p className="flex flex-row items-center text-slate-500 font-semibold mt-2">
            <FaDollarSign />
            {listing.offer
              ? (listing.regularPrice - listing.discountPrice).toLocaleString(
                  "en-US"
                )
              : listing.regularPrice.toLocaleString("en-US")}
            {listing.type === "rent" && <span>/Month</span>}
          </p>
          <div className="text-emerald-700 flex flex-row gap-5 items-center">
            <div className=" flex flex-row items-center gap-1">
              <GiBed />
              {listing.bedrooms} Beds
            </div>
            <div className=" flex flex-row items-center gap-1">
              <GiBathtub />
              {listing.bathrooms} Baths
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
