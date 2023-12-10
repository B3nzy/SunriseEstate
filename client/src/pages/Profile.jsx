/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { useRef } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import {
  deleteUserFalure,
  deleteUserStart,
  deleteUserSuccess,
  signOutFalure,
  signOutStart,
  signOutSuccess,
  updateUserFalure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";
import ReactLoading from "react-loading";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [zeroListing, setZeroListing] = useState(false);
  const [listingLoading, setListingLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const dispatch = useDispatch();

  // Firebase Storage

  // allow read;
  // allow write: if
  // request.resource.size<2*1024*1024 &&
  // request.resource.contentType.matches("image/.*")

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercentage(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({
            ...formData,
            avatar: downloadURL,
          });
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      setUpdateSuccess(false);
      console.log(formData);
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success == false) {
        dispatch(updateUserFalure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      console.log(data);
    } catch (err) {
      dispatch(updateUserFalure(err.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success == false) {
        dispatch(deleteUserFalure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (err) {
      dispatch(deleteUserFalure(err.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutStart());
      const res = await fetch(`/api/auth/signout`);
      const data = await res.json();
      if (data.success == false) {
        dispatch(signOutFalure(data.message));
        return;
      }
      dispatch(signOutSuccess(data));
    } catch (err) {
      dispatch(signOutFalure(err.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setListingLoading(true);
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(data.message);
        return;
      }
      setUserListings(data.listings);
      setListingLoading(false);
      if (data.listings.length === 0) {
        setZeroListing(true);
      } else {
        setZeroListing(false);
      }
    } catch (err) {
      setListingLoading(false);
      setShowListingsError(err.message);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      setDeleteLoading(listingId);
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success == false) {
        console.log(data);
        return;
      }
      // Getting updated data from the server.
      setDeleteLoading(false);
      handleShowListings();
      // we can filter the UserListings as well.
    } catch (err) {
      setDeleteLoading(false);
      console.log(err);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto flex flex-col sm:flex-row gap-4">
      <div className="md:max-w-md flex-1 ">
        <h1 className="text-3xl text-center font-semibold">Profile</h1>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <input
            onChange={(e) => setFile(e.target.files[0])}
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
          />
          <img
            onClick={() => fileRef.current.click()}
            className="rounded-full h-32 w-32 object-cover cursor-pointer self-center mt-5 hover:drop-shadow-lg transition ease-in-out hover:scale-105 duration-300"
            src={formData.avatar || currentUser.avatar}
            referrerPolicy="no-referrer"
          />
          <p className="text-sm self-center">
            {fileUploadError ? (
              <span className="text-red-700">
                Error image upload : Image must be less than 2 Mb
              </span>
            ) : filePercentage > 0 && filePercentage < 100 ? (
              <span className="text-slate-700-600">{`Uploading image ${filePercentage}% done`}</span>
            ) : filePercentage == 100 ? (
              <span className="text-green-600">
                Image successfully uploaded!
              </span>
            ) : (
              ""
            )}
          </p>
          <input
            type="text"
            placeholder="username"
            className="border p-3 rounded-lg"
            id="username"
            defaultValue={currentUser.username}
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="email"
            className="border p-3 rounded-lg"
            id="email"
            defaultValue={currentUser.email}
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="password"
            className="border p-3 rounded-lg"
            id="password"
            onChange={handleChange}
          />
          <button
            disabled={loading}
            className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-90 disabled:opacity-70"
          >
            {loading ? "Loading..." : "Update"}
          </button>
        </form>
        <div className="flex justify-between mt-4 ">
          <span
            onClick={handleDeleteUser}
            className="text-red-700 cursor-pointer hover:underline"
          >
            Delete Account
          </span>
          <span
            onClick={handleSignOut}
            className="text-red-700 cursor-pointer hover:underline"
          >
            Sign out
          </span>
        </div>
        <p className="text-red-700 mt-5">{error ? error : ""}</p>
        <p className="text-green-600 mt-5">
          {updateSuccess ? "User is updated successfully!" : ""}
        </p>
      </div>
      <div className="max-w-2l flex-1">
        <Link className="" to={"/create-listing"}>
          <div className="w-full my-5 border p-3 rounded-lg text-center text-lime-600 border-lime-600 hover:bg-lime-600 hover:text-white hover:shadow-lg uppercase">
            Create Listing
          </div>
        </Link>
        <button
          onClick={() => {
            handleShowListings();
          }}
          className="w-full bg-green-600 text-white p-3 rounded-lg uppercase text-center hover:opacity-90 hover:shadow-lg disabled:opacity-70"
          disabled={listingLoading}
        >
          {listingLoading ? "Loading listings..." : "Show listings"}
        </button>
        <p className="text-red-600 text-sm my-2">
          {showListingsError && showListingsError}
        </p>

        <div className="flex flex-col gap-3 ">
          {userListings && userListings.length > 0 && (
            <h1 className="text-2xl font-semibold p-8 text-center">
              Your Listings
            </h1>
          )}
          {zeroListing && (
            <h1 className="text-xl font-semibold p-3 text-center text-amber-600">
              You dont have any listings yet!
            </h1>
          )}
          {listingLoading && (
            <ReactLoading
              type={"spinningBubbles"}
              color={"#2B2A4C"}
              height={120}
              width={120}
              className="mx-auto my-16"
            />
          )}
          {userListings &&
            userListings.length > 0 &&
            listingLoading === false &&
            userListings.map((listing) => (
              <div
                key={listing._id}
                className="p-3 border flex justify-between items-center gap-4 shadow-md"
              >
                <Link to={`/listing/${listing._id}`}>
                  <img
                    className="h-20 object-contain rounded"
                    src={listing.imageUrls[0]}
                    alt="listing image"
                  />
                </Link>
                <Link
                  className="text-slate-600 font-semibold flex-1 hover:underline truncate"
                  to={`/listing/${listing._id}`}
                >
                  <p>{listing.name}</p>
                </Link>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => handleListingDelete(listing._id)}
                    className="bg-red-600 p-1 rounded text-white hover:opacity-80 disabled:opacity-70"
                    disabled={deleteLoading === listing._id}
                  >
                    Delete
                  </button>
                  <Link
                    className="bg-yellow-600 p-1 rounded text-white hover:opacity-80 text-center"
                    to={`/update-listing/${listing._id}`}
                  >
                    <button>Edit</button>
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
