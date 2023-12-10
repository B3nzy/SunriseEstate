/* eslint-disable no-unused-vars */
import React from "react";

export default function About() {
  return (
    <div className="max-w-5xl p-3 flex flex-col mx-auto gap-10 my-10">
      <h1 className="text-3xl text-slate-500 text-center">
        About SunriseEstate
      </h1>
      <h1 className="">
        Welcome to{" "}
        <span className="text-slate-500 font-semibold">SunriseEstate</span>,
        where your dream home awaits! We&apos;re dedicated to simplifying your
        real estate journey with expertise, transparency, and personalized
        service.
      </h1>
      <div className="flex flex-col gap-3">
        <h2 className="font-semibold text-xl text-slate-500">Why Choose Us:</h2>
        <p>
          1. <span className="font-medium text-slate-500">Expertise:</span> Our
          experienced team offers strategic advice and stays ahead of market
          trends.
        </p>
        <p>
          2.{" "}
          <span className="font-medium text-slate-500">Diverse Listings:</span>{" "}
          Explore a range of properties, from urban apartments to suburban homes
          and luxurious estates.
        </p>
        <p>
          3. <span className="font-medium text-slate-500">Transparency: </span>
          Detailed listings, including comprehensive information and virtual
          tours, ensure informed decisions.
        </p>
        <p>
          4.{" "}
          <span className="font-medium text-slate-500">
            Personalized Service:
          </span>{" "}
          We understand your unique goals and provide tailored support to make
          your journey enjoyable.
        </p>
        <p>
          5.{" "}
          <span className="font-medium text-slate-500">
            Cutting-Edge Technology:
          </span>{" "}
          Our website features intuitive search options and real-time updates
          for a seamless experience.
        </p>
      </div>
      <p>
        Join us at SunriseEstate and let&apos;s turn your real estate dreams
        into reality. Your perfect property is just a click away!
      </p>
    </div>
  );
}
