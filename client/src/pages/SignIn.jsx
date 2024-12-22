import {Alert, Button, Label, Spinner, TextInput} from 'flowbite-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import OAuth from '../components/OAuth';

export default function SignIn() {

const navigate = useNavigate();
const dispatch = useDispatch();


const [formData, setFormData] = useState({});

const {loading, error: errorMessage} = useSelector(state => state.user);

const API_URL = import.meta.env.VITE_API_URL;

const handleChange = (e) =>{
  setFormData({...formData,[e.target.id]: e.target.value.trim()});
// console.log(e.target.value);
}

const handleSubmit = async(e) =>{
  e.preventDefault();
  if(!formData.email || !formData.password){
    return dispatch(signInFailure('Please fill all the fields'));
  }
  try{
   dispatch(signInStart());
  const res = await fetch(`${API_URL}/api/auth/signin`, {
    method: 'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify(formData),
   });
  const data = await res.json();
  if(data.success === false){
    dispatch(signInFailure(data.message))
  }
  if(res.ok){
    dispatch(signInSuccess(data));
    navigate('/')
  }
  }
  catch(error){
   dispatch(signInFailure(error.message));
  }
}

// console.log(formData)

  return (
    <div className="pt-32 mb-28 w-full">
      
      <div className="flex p-3 mx-auto flex-col md:items-center gap-5">
      {/*top*/}
      <div className="text-center flex-1">
      <p className="text-4xl font-bold">Welcome to the Coder XYZ</p>
      <p className="text-md my-3 font-semibold">Connect, Create and Explore on Coder XYZ</p>

      </div>

        {/*bottom*/}
      <div className="flex-1 w-full md:w-1/4">
       <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className="">
          <Label value='Your Email Address' />
          <TextInput 
          type='email'
          placeholder='name@company.com'
          id='email'
          onChange={handleChange}
          />
          <Label value='New Password' />
          <TextInput 
          type='password'
          placeholder='Password'
          id='password'
          onChange={handleChange}
          />
        </div>

        <Button gradientDuoTone='purpleToBlue' type='submit' disabled={loading}>
        {
        loading? (
          <>
          <Spinner size='sm' />
          <span className='pl-3'>Loading...</span>
          </>

        ) : 'Sign In'
        }
        </Button>
        <p className='text-md font-semibold text-center'>OR</p>
        <OAuth/>
        </form>
        <div className='flex gap-2 text-sm mt-2'>
          <span>Dont Have an account?</span>
          <Link to='/signup' className='text-blue-600 font-semibold'>
          Sign Up
          </Link>
        </div>
        {
          errorMessage && (
            <Alert className='mt-5' color='failure'>
              {errorMessage}
            </Alert>
          )
        }
      </div>
      </div>

    </div>
  )
}
