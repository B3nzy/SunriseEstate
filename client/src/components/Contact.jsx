/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact(props) {
  const { listing } = props;
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");
  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/user/${listing.userRef}`);
      const data = await res.json();
      if (data.success == false) {
        console.log(data);
        return;
      }
      console.log(data);
      setLandlord(data);
    })();
  }, [listing.userRef]);

  return (
    <div>
      {landlord && (
        <div className="flex flex-col gap-3 my-3">
          <p>
            Contact <span className="font-semibold"> {landlord.username} </span>{" "}
            for <span className="font-semibold"> {listing.name} </span>
          </p>
          <textarea
            className="w-full border p-3 rounded-lg"
            name="message"
            id="message"
            rows="3"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message here..."
          ></textarea>
          <Link
            className="bg-slate-700 text-white p-3 text-center rounded-lg uppercase hover:opacity-90"
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
          >
            Send Message
          </Link>
        </div>
      )}
    </div>
  );
}
