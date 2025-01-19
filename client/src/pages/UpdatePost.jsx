// Highlight.js
import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useEffect, useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "highlight.js/styles/monokai-sublime.css";



export default function UpdatePost() {

  
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({ content: "" }); // Ensure a default value
  const [publishError, setPublishError] = useState(null);
  const { postId } = useParams();

    // Function to highlight text based on language detection

    // Function to get a background color based on the language
  const API_URL = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);

    

  const category = [
    "LifeStyle",
    "React",
    "Java",
    "DSA",
    "System",
    "Design",
    "Programming",
    "Science",
    "Technology",
    "News",
    "Jobs",
    "Informative",
    "Entertainment",
    "Products",
    "Maths",
  ];
    
    useEffect(() => {
      const fetchPost = async () => {
        try {
          const res = await fetch(
            `${API_URL}/api/post/getposts?postId=${postId}`
          );
          const data = await res.json();
          if (res.ok) {
            setPublishError(null);
            setFormData({
              ...formData,
              title: data.posts[0]?.title || "",
              category: data.posts[0]?.category || "",
              content: data.posts[0]?.content || "",
              postImage: data.posts[0]?.postImage || "",
            });
          } else {
            setPublishError(data.message);
          }
        } catch (error) {
          console.log(error.message);
        }
      };
      fetchPost();
    }, [postId]);
    
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

  const handleUpdloadImage = async () => {
    try {
      if (!file) {
        setImageUploadError('Please select an image');
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError('Image upload failed');
          setImageUploadProgress(null);
          console.log(error)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, postImage: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError('Image upload failed');
      setImageUploadProgress(null);
      console.log(error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/post/updatepost/${postId}/${currentUser.rest._id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError('Something went wrong');
    }
  };
  return (
    <div className='p-3 pt-20 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Update post</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput
            type='text'
            placeholder='Title'
            required
            id='title'
            className='flex-1'
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            value={formData.title}
          />
        <Select onChange={(e)=>setFormData({...formData, category:e.target.value})}
              id='category'>
            <option value="uncategorized">Select a category</option>
            {category && category.map((value) => (
            <option value={value.toLocaleLowerCase()} key={value}>{value}</option>
            ))}
        </Select>
        </div>

        <div>
        {formData.postImage && (
          <img
            src={formData.postImage}
            alt='upload'
            className='w-full h-72 object-cover'
          />
        )}
        </div>

   
        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          <FileInput
            type='file'
            accept='image/*'
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type='button'
            gradientDuoTone='purpleToBlue'
            size='sm'
            outline
            onClick={handleUpdloadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className='w-16 h-16'>
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              'Upload Image'
            )}
          </Button>
        </div>
        
        {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
  
        <ReactQuill
          theme="snow"
          value={formData.content}
          placeholder="write your content ...."
          modules={modules}
          formats={formats}
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
          style={{ height: "500px" }}
        >
        </ReactQuill>
  
        <Button type='submit' gradientDuoTone='purpleToPink'>
          Update post
        </Button>
        {publishError && (
          <Alert className='mt-5' color='failure'>
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}