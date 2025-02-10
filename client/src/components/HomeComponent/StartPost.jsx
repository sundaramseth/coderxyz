import { Button, Modal, Alert, Badge } from "flowbite-react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import { FaRegImage } from "react-icons/fa6";
import imageCompression from "browser-image-compression";
import { useEffect } from "react";

import "quill/dist/quill.snow.css";

import { useNavigate } from "react-router-dom";

import { app } from "../../firebase";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

export default function StartPost({ onPostCreated }) {
  const API_URL = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();

  const { currentUser } = useSelector((state) => state.user);

  const [openModal, setOpenModal] = useState(false);

  const [openMediaModal, setMediaOpenModal] = useState(false);

  const [formData, setFormData] = useState({});

  const [publishError, setPublishError] = useState(null);

  const [hashtags, setHashtags] = useState([]);
  const [hashtagInput, setHashtagInput] = useState("");

  const [imageUploadError, setImageUploadError] = useState(null);

  const [file, setFile] = useState(null);

  const [imageUploadProgress, setImageUploadProgress] = useState(null);

  const handleAddHashtag = () => {
    if (hashtagInput.trim() && !hashtags.includes(hashtagInput.trim())) {
      setHashtags([...hashtags, hashtagInput.trim()]);
      setFormData({
        ...formData,
        category: [...hashtags, hashtagInput.trim()],
      });
      setHashtagInput("");
    }
  };

  const handleRemoveHashtag = (tag) => {
    setHashtags(hashtags.filter((ht) => ht !== tag));
  };

  const handleChangeImage = () => {
    setFile(null);
    document.getElementById("fileInput").click();
  };

  useEffect(() => {
    if (file) {
      handleUploadImage();
    }
  }, [file]);

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }
      setImageUploadError(null);

      // Image compression options
      const options = {
        maxSizeMB: 0.1, // Maximum file size in MB
        maxWidthOrHeight: 1024, // Max width or height in pixels
        useWebWorker: true, // Use web worker for performance
      };

      // Compress the image
      const compressedFile = await imageCompression(file, options);

      const storage = getStorage(app);
      const fileName = new Date().getTime() + "_" + compressedFile.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, compressedFile);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Image Upload Failed" + error);
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadError(null);
            setImageUploadProgress(null);
            setFormData({ ...formData, postImage: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image Upload Failed");
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/post/create`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        // alert("Something went wrong");
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        // alert("Post Created Successfully");
        setPublishError(null);
        navigate(`/`);
        setOpenModal(false);
        onPostCreated();
      }
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };

  return (
    <div className="flex flex-col py-5 md:px-5 px-2  w-full border md:rounded-xl bg-white dark:bg-transparent dark:border-gray-600">
      <div className="flex flex-row gap-4">
        <Link to="/dashboard?tab=profile">
          <img
            className="border rounded-full w-12"
            alt="user"
            src={currentUser?.rest.profilePicture}
          />
        </Link>
        <input
          className="w-full rounded-full text-sm font-semibold px-5 border-gray-400 dark:bg-transparent"
          type="text"
          placeholder="Start your post!"
          onClick={() => setOpenModal(true)}
        />
      </div>

      {/* Modal Start New Post */}

      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>
          <div className="flex flex-row gap-2 items-center mb-2">
            <img
              className="border rounded-full w-12"
              alt="user"
              src={currentUser?.rest.profilePicture}
            />
            <p className="text-lg font-semibold">
              {currentUser?.rest.username}
            </p>
          </div>
        </Modal.Header>
        <Modal.Body>
          <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmit}>
            <div className="flex flex-col w-full">
              <input
                type="text"
                placeholder="Your topic title?"
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full text-lg font-semibold border-0 p-0 postinput"
              ></input>
            </div>
            <div className="flex flex-col w-full">
              <textarea
                type="text"
                placeholder="What would you like to talk about?"
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                className="w-full text-lg font-semibold border-0 postinput min-h-60 p-0"
              ></textarea>
            </div>

            {formData.postImage && (
              <div className="flex flex-col w-full justify-center items-center">
                <img
                  src={formData.postImage}
                  alt="post"
                  className="w-full object-cover"
                />
              </div>
            )}

            <div className="flex flex-row gap-2 justify-start items-center py-4">
              <div className="text-lg font-semibold text-gray-600">Add Media</div>
              <div
                className="inline-block"
                onClick={() => setMediaOpenModal(true)}
              >
                <FaRegImage className="w-6 h-6 text-gray-600 hover:text-blue-600" />
              </div>
            </div>

            <div className="flex flex-col">
              <input
                placeholder="Enter at least 3-4 hashtags for your post, Eg: #javascript"
                value={hashtagInput}
                onChange={(e) => setHashtagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault(); // Prevents accidental form submission
                    handleAddHashtag();
                  }
                }}
                className="flex w-full text-sm font-400 border-0 postinput"
              />

              <div className="flex flex-row gap-2 mt-2">
                {hashtags.map((tag, index) => (
                  <Badge
                    size={16}
                    key={index}
                    className="bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full flex flex-row justify-center items-center gap-2"
                  >
                    {tag}&nbsp;&nbsp;
                    <button
                      className="text-red-500 text-xs"
                      onClick={() => handleRemoveHashtag(tag)}
                    >
                      &#10005;
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </form>
        </Modal.Body>
        {publishError && (
          <Alert color="failure" className="mt-5">
            {publishError}
          </Alert>
        )}
        <Modal.Footer className="flex flex-row justify-end items-center">
          <Button color="gray" size="sm" onClick={() => setOpenModal(false)}>
            Cancel
          </Button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
            onClick={handleSubmit}
          >
            Publish Post
          </button>
        </Modal.Footer>
      </Modal>

      {/* Modal Post Media*/}
      <Modal show={openMediaModal} onClose={() => setMediaOpenModal(false)}>
        <Modal.Header>Upload Your Media</Modal.Header>
        <Modal.Body>
          {formData.postImage ? (
            <div className="flex flex-col justify-center items-center">
              <img
                src={formData.postImage}
                alt="post"
                className="w-48 h-48 object-cover"
              />
            </div>
          ) : (
            <>
              <div className="flex flex-col justify-center items-center">
                <div className="text-center font-semibold text-xl my-14">
                  Select files to begin <br />
                  Share images or a single video in your post.
                </div>
                <div className="flex flex-row items-center">
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                  {imageUploadProgress ? (
                    <div className="w-5 h-5">
                      <CircularProgressbar
                        value={imageUploadProgress}
                        text={`${imageUploadProgress || 0}%`}
                      />
                    </div>
                  ) : (
                    <label
                      onClick={handleChangeImage}
                      disabled={imageUploadProgress}
                      htmlFor="actual-btn"
                      className="bg-blue-700 py-2 px-5 text-white font-semibold text-sm rounded-full"
                    >
                      Upload From System
                    </label>
                  )}
                </div>
                {imageUploadError && (
                  <Alert color="failure">{imageUploadError}</Alert>
                )}
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="flex flex-row justify-end items-center">
          <Button
            size="sm"
            color="blue"
            onClick={() => setMediaOpenModal(false) || setOpenModal(true)}
          >
            Next
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

StartPost.propTypes = {
  onPostCreated: PropTypes.func.isRequired,
};
