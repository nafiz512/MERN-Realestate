import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import {Link} from 'react-router-dom';
import { 
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,

 } from "../redux/user/userSlice";

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
   const [imgLink, setImgLink] = useState(currentUser.avatar);

   const imgRef = useRef(null);
   const [uploaded, setUploaded] = useState(false);
  const dispatch = useDispatch();

  const handleUpload = (e) => {
    try {
      setFile(e.target.files[0]);
    } catch (error) {
      toast.error(error.message);
    }
  };

    useEffect(() => {
    const uploadFile = async () => {
      if(file && !uploaded) 
        {
        try {
          const data = new FormData();
          data.append("my_file", file);
          const res = await axios.post(`http://localhost:3000/upload-profile`, data);
          let url = res.data.fileUrl;
          setImgLink(url); 
          toast.success("Avatar uploaded successfully!");
          setUploaded(true);
        } catch (error) {
          console.error(error);
          toast.error("Failed to upload file");
        }
      }
    };
    uploadFile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ ...formData, avatar: imgLink }),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateUserFailure(data.message || "Update failed"));
        toast.error(data.message || "Update failed");
        return;
      }
      dispatch(updateUserSuccess(data));
      toast.success("Profile updated successfully!");
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      toast.error("Error updating profile");
    }
  };
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };
  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (err) {
      setShowListingsError(true);
    }
  };
  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <Toaster />
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          ref={imgRef}
          hidden
          accept="image/*"
          onChange={handleUpload}
        />
        <img
          onClick={() => imgRef.current.click()}
          src={imgLink}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <input
          type="text"
          placeholder="Username"
          defaultValue={currentUser.username}
          id="username"
          className="mt-3 border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="Email"
          defaultValue={currentUser.email}
          id="email"
          className="mt-3 border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="mt-3 border p-3 rounded-lg"
          onChange={handleChange}
        />
        <button className="bg-slate-700 rounded-lg text-white p-3 uppercase hover:opacity-70">
          Update
        </button>
        <Link to="/create-listing" className="bg-green-700 rounded-lg text-white p-3 uppercase text-center hover:opacity-70">Create Listing</Link>
      </form>
      <div className="flex justify-between mt-5" >
        <span onClick= {handleDeleteUser} className="text-red-700 cursor-pointer">Delete Account</span>
      </div>
      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'>
        {updateSuccess ? 'User is updated successfully!' : ''}
      </p>
      <button onClick={handleShowListings} className='text-green-700 w-full'>
        Show Listings
      </button>
      <p className='text-red-700 mt-5'>
        {showListingsError ? 'Error showing listings' : ''}
      </p>
      {userListings && userListings.length > 0 && (
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className='border rounded-lg p-3 flex justify-between items-center gap-4'
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt='listing cover'
                  className='h-16 w-16 object-contain'
                />
              </Link>
              <Link
                className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className='flex flex-col item-center'>
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className='text-red-700 uppercase'
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className='text-green-700 uppercase'>Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};