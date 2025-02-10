import { Alert, Badge  } from "flowbite-react";
import { useEffect, useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import {app} from '../firebase'
import {CircularProgressbar} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css'
import { useNavigate } from "react-router-dom";
import imageCompression from 'browser-image-compression';

export default function CreatePost() {

  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);

  const [hashtags, setHashtags] = useState([]);
  const [hashtagInput, setHashtagInput] = useState("");


  const handleAddHashtag = () => {
    if (hashtagInput.trim() && !hashtags.includes(hashtagInput.trim())) {
      setHashtags([...hashtags, hashtagInput.trim()]);
      setFormData({...formData, category:[...hashtags, hashtagInput.trim()]})
      setHashtagInput("");
    }
  };

  const handleRemoveHashtag = (tag) => {
    setHashtags(hashtags.filter((ht) => ht !== tag));
  };


  
  var modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "code-block"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
        { align: [] }
      ],
      [{ "color": ["#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff", "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff", "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff", "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2", "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466", 'custom-color'] }],
    ]
  };

  var formats = [
    "header", "height", "bold", "italic",
    "underline", "strike", "blockquote",
    "list", "color", "bullet", "indent",
    "link", "image", "align", "size","code-block"
  ];

  const handleButtonClick = () => {
     document.getElementById("fileInput").click();
  };

  const handleChangeImage = () => {
    setFile(null);
    document.getElementById("fileInput2").click();
  };

  useEffect(() => {
    if (file) {
      handleUploadImage();
    }
  }, [file]);

  const handleUploadImage = async () =>{
    try {
      if(!file){
        setImageUploadError('Please select an image')
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
     const fileName = new Date().getTime() + '_' + compressedFile.name;
     const storageRef = ref(storage, fileName);
     const uploadTask = uploadBytesResumable(storageRef, compressedFile) 
    uploadTask.on(
      'state_changed',
      (snapshot)=>{
        const progress = (snapshot.bytesTransferred /snapshot.totalBytes) * 100;
        setImageUploadProgress(progress.toFixed(0));
      },(error)=>{
        setImageUploadError('Image Upload Failed' + error);
        setImageUploadProgress(null);
      },()=>{
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
          setImageUploadError(null);
          setImageUploadProgress(null);
         setFormData({...formData, postImage:downloadURL});
        })
      }
     )


    } catch (error) {
      setImageUploadError('Image Upload Failed');
      setImageUploadProgress(null);
      console.log(error);
    }

  }

  const handleSubmit = async(e)=>{
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/post/create`,{
      method:'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body:JSON.stringify(formData),
      });
      const data = await res.json();

      if(!res.ok){
        setPublishError(data.message)
        return
      }
      if(res.ok){
       setPublishError(null); 
       navigate(`/post/${data.slug}`);
      }

    } catch (error) {
      setPublishError('Something went wrong');
    }

  }


  return (
    <div className="flex md:flex-row flex-col px-3 w-full justify-center items-center gap-2">

      {/* leftsection create post */}

      <div className="flex w-full md:w-[800px] flex-col md:min-h-screen justify-center items-center my-16">
        <div className="flex bg-white w-full m-4 rounded-lg ">


      <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmit}>

        <div className="flex flex-row gap-4 justify-center items-center w-full pt-4 px-4">
        
       {formData.postImage ? (
        <div className="relative group w-full h-28 rounded-lg overflow-hidden">
        <img src={formData.postImage}
          alt="upload"
          className="w-full h-28 object-cover rounded-lg"
          />

         <input
            id="fileInput2"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button
           onClick={handleChangeImage}
           disabled={imageUploadProgress}
           className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
           >
          {imageUploadProgress ? (
            <div className="w-5 h-5">
               <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`}/>
            </div>         
          ):(
            'Change Image'
          )}
          </button>
        </div>
        
         ):(
         <>
                     {/* Hidden File Input */}
                     <input
            id="fileInput"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => setFile(e.target.files[0])}
          />

          {/* Custom Button to Trigger File Input */}
          <button
           onClick={handleButtonClick}
           disabled={imageUploadProgress}
            className="w-full bg-gray-200 hover:bg-gray-300 text-black py-2 px-4 rounded-lg flex items-center justify-center gap-2 font-semibold text-sm"
          >
          {imageUploadProgress ? (
            <div className="w-5 h-5">
               <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`}/>
            </div>         
          ):(
            'Add Post Image'
          )}
          </button>

          {imageUploadError && (
          <Alert color='failure'>{imageUploadError}</Alert>
         )}

         </>
         )}

        </div>

          <div className="flex flex-col w-full gap-4 items-start justify-start px-5">

          <input
        placeholder="Write Post Title Here"
        type="text"
        required
        id='title'
        className="flex font-bold text-4xl text-gray-950 border-0 postinput p-0 w-full leading-1.5"
        onChange={(e)=>setFormData({...formData, title:e.target.value})}
        />


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
      

        <ReactQuill
          className="contentbox"
          theme="snow"
          formats={formats}
          placeholder="Write your content..."
          modules={modules}
          onChange={(value)=>setFormData({...formData, content:value})}
          style={{ height: "480px" }}
        >
        </ReactQuill>
      </form>
      </div>
      <div className="flex flex-row justify-start items-center w-full gap-4 mt-4">
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg" onClick={handleSubmit}>
       Publish Post
       </button>

       <button type="submit" className="text-gray-500 font-semibold" disabled>
       Save Draft
       </button>

       {publishError && (
        <Alert color='failure' className="mt-5">
          {publishError}
        </Alert>
       )}
      </div>

      </div>


      {/* rightsection tip */}

      <div className="flex flex-col md:min-h-screen md:w-auto w-full justify-center items-center">
        <div className="flex flex-col gap-4 md:w-[300px] w-full p-4 rounded-lg">
          <h1 className="text-left text-lg font-semibold">Tips for writing good Article</h1>
          <p className="text-sm font-medium text-gray-500">1. Use high quality images for your blog post</p>
          <p className="text-sm font-medium text-gray-500">2. Use at least 3-4 hashtags for your post</p>
          <p className="text-sm font-medium text-gray-500">3. Write a detailed content for your post</p>
          <p className="text-sm font-medium text-gray-500">4. Use the right category for your post</p>
        </div>
      </div>


    </div>
  );
}
