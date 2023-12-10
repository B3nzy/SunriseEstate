/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";
import ListingItem from "../components/ListingItem";

export default function Search() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  console.log(showMore);
  console.log(listings);
  const [sideBarData, setSideBarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "createdAt",
    order: "desc",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSideBarData({
        ...sideBarData,
        type: e.target.id,
      });
    } else if (e.target.id === "searchTerm") {
      setSideBarData({
        ...sideBarData,
        searchTerm: e.target.value,
      });
    } else if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSideBarData({
        ...sideBarData,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    } else if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "createdAt";
      const order = e.target.value.split("_")[1] || "desc";
      setSideBarData({
        ...sideBarData,
        sort,
        order,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sideBarData.searchTerm);
    urlParams.set("type", sideBarData.type);
    urlParams.set("parking", sideBarData.parking);
    urlParams.set("furnished", sideBarData.furnished);
    urlParams.set("offer", sideBarData.offer);
    urlParams.set("sort", sideBarData.sort);
    urlParams.set("order", sideBarData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      orderFromUrl ||
      sortFromUrl
    ) {
      setSideBarData({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "createdAt",
        order: orderFromUrl || "desc",
      });
    }

    (async () => {
      try {
        setLoading(true);
        setShowMore(false);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        if (data.success == false) {
          setLoading(false);
          console.log(data.message);
          return;
        }
        setLoading(false);
        setListings(data.listings);
        if (data.listings.length > 8) {
          setShowMore(true);
        } else if (data.listings.length < 9) {
          setShowMore(false);
        }
      } catch (err) {
        setLoading(false);
      }
    })();
  }, [location.search]);

  const onShowMoreclick = async () => {
    const numberOfListings = listings.length;
    const urlParams = new URLSearchParams(location.search);
    const startIndex = numberOfListings;
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();

    try {
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.success == false) {
        console.log(data.message);
        return;
      }
      setListings([...listings, ...data.listings]);
      if (data.listings.length < 9) {
        setShowMore(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:min-h-screen md:sticky md:top-20 md:h-screen">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <label className="flex flex-row whitespace-nowrap items-center gap-2">
            {" "}
            <span className="font-semibold">Search Term :</span>
            <input
              type="text"
              id="searchTerm"
              placeholder="Serch..."
              className="border p-3 w-full"
              value={sideBarData.searchTerm}
              onChange={handleChange}
            />
          </label>
          <div className="flex gap-5 flex-wrap">
            <span className="font-semibold">Type :</span>
            <label className="flex gap-1">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                checked={sideBarData.type === "all"}
                onChange={handleChange}
              />
              <span>Rent & Sale</span>
            </label>
            <label className="flex gap-1">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                checked={sideBarData.type === "rent"}
                onChange={handleChange}
              />
              <span>Rent</span>
            </label>
            <label className="flex gap-1">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                checked={sideBarData.type === "sale"}
                onChange={handleChange}
              />
              <span>Sale</span>
            </label>
            <label className="flex gap-1">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                checked={sideBarData.offer}
                onChange={handleChange}
              />
              <span>Offer</span>
            </label>
          </div>
          <div className="flex gap-5 flex-wrap">
            <span className="font-semibold">Amenities :</span>
            <label className="flex gap-1">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                checked={sideBarData.parking}
                onChange={handleChange}
              />
              <span>Parking</span>
            </label>
            <label className="flex gap-1">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                checked={sideBarData.furnished}
                onChange={handleChange}
              />
              <span>Furnished</span>
            </label>
          </div>
          <label className="flex items-center gap-5">
            <span className="font-semibold">Sort :</span>
            <select
              id="sort_order"
              className="border rounded-lg p-2"
              onChange={handleChange}
              defaultValue="created_at_desc"
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </label>
          <button className="text-white p-3 border bg-slate-600 rounded-lg uppercase hover:shadow-xl">
            Search
          </button>
        </form>
      </div>
      <div className="w-full md:border-l-2">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Listing results :{" "}
        </h1>
        <div className="p-7">
          {loading && (
            <ReactLoading
              type={"spinningBubbles"}
              color={"#2B2A4C"}
              height={120}
              width={120}
              className="mx-auto my-16"
            />
          )}
          {!loading && listings.length === 0 && (
            <p className="text-xl text-slate-600 text-center">
              No listing found!
            </p>
          )}
          <div className="flex flex-row flex-wrap gap-4">
            {!loading &&
              listings &&
              listings.map((listing, index) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
          </div>
        </div>

        {showMore && (
          <button
            onClick={onShowMoreclick}
            className="w-full text-center text-green-600 hover:underline p-7"
          >
            Show more
          </button>
        )}
      </div>
    </div>
  );
}
