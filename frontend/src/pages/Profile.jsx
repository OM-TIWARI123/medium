import React from 'react'
import { userAtom } from '../Recoil/userSlice'
import { useRecoilValue,useRecoilState} from 'recoil'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import {useState,useEffect,useRef} from 'react'
import { app } from '../firebase';
import { Link } from 'react-router-dom';
export default function Profile() {
  const currentUser=useRecoilValue(userAtom)
  const fileRef=useRef(null);
  
  console.log( "id",currentUser.id);
  const[file,setFile]=useState(undefined);
  const[filePerc,setFilePerc]=useState(0);
  const[fileUploadError,setFileUploadError]=useState(false);
  const[formData,setFormData]=useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  
  useEffect(()=>{
    if(file){
      handleFileUpload(file);
    }
  }, [file])
  const handleFileUpload=(file)=>{
    const storage=getStorage(app);
    const fileName=new Date().getTime()+file.name;
    const storageRef =ref(storage,fileName);
    const uploadTask=uploadBytesResumable(storageRef,file);
    uploadTask.on('state_changed',
      (snapshot)=>{
        const progress=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
        setFilePerc(Math.round(progress));
      },
      (error)=>{
        console.log(error);
        setFileUploadError(true);
      },
      ()=>{
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>setFormData({...formData,avatar:downloadURL}));
      }
    );
  }
  const handleChange=(e)=>{
    setFormData({...formData,[e.target.id]:e.target.value})
    console.log(formData);
  }
  const handleSubmit=async (e)=>{
    e.preventDefault();
    try{
      
      const res=await fetch(` http://127.0.0.1:8787/api/user/update/${currentUser.id}`,
     
      {
        method:'POST',
        headers:{
          Authorization: 'Bearer '+localStorage.getItem('token'),
          'Content-type': 'application/json'
        },
        body:JSON.stringify(formData),
      });
      const data=await res.json();
      console.log(data)
    }catch(err){
      console.log(err)
    }
  }
  console.log(currentUser)

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`http://localhost:8787/api/user/listings/${currentUser.id}`,{
        method:'GET',
        headers:{
          Authorization: 'Bearer '+localStorage.getItem('token'),
          'Content-type': 'application/json'
        }
      });
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data.listings);
      console.log(userListings)
    } catch (error) {
      console.log(error)
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`http://localhost:8787/api/listing/delete/${listingId}`, {
        method: 'DELETE',
        headers:{
          Authorization: 'Bearer '+localStorage.getItem('token'),
          'Content-type': 'application/json'
        }
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing.id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };
   return (
    <div className='p-3 max-w-lg mx-auto gap-4'>
    <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
    <form className='flex flex-col' onSubmit={handleSubmit}>
      <input onChange={(e)=>setFile(e.target.files[0])}type="file" ref={fileRef} hidden accept='image/.*' />
      <img onClick={()=>fileRef.current.click()} src={formData.avatar||currentUser.avatar} alt='Profile' className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'/>
      <p className='text-sm self-center'>
       { fileUploadError ?
        (<span className='text-red-700'>Error Image upload
        </span>):
         filePerc > 0 && filePerc < 100 ?(
          <span className='text-slate-700'>
            {'Uploading${filePerc}%'}
          </span> )
        :
        filePerc==100 ?(
          <span className='text-green-700'>Image successfully uploaded</span>
        )
        :
        ("")
        }
      </p>
      <input type="text" placeholder='username' className='border p-3 rounded-lg' defaultValue={currentUser.username} id="username" onChange={handleChange}/>
      <input type="text" placeholder='email' className='border p-3 rounded-lg' defaultValue={currentUser.email} id="email" onChange={handleChange}/>
      <input type="password" placeholder='password' id="password" className='border p-3 rounded-lg'/>
      <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:op80'>update</button>
      <Link
          className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'
          to={'/create-listing'}
        >
          Create Listing
        </Link>
    </form>
    <div className='flex justify-between mt-5'>
      <span  className='text-red-700'>Delete Acccount</span>
      <span  className='text-red-700'>Sign out</span>
    </div>
    
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
              key={listing.id}
              className='border rounded-lg p-3 flex justify-between items-center gap-4'
            >
              <Link to={`/listing/${listing.id}`}>
                <img
                  src={listing.image[0]}
                  alt='listing cover'
                  className='h-16 w-16 object-contain'
                />
              </Link>
              <Link
                className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                to={`/listing/${listing.id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className='flex flex-col item-center'>
                <button
                  onClick={() => handleListingDelete(listing.id)}
                  className='text-red-700 uppercase'
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing.id}`}>
                  <button className='text-green-700 uppercase'>Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
  </div>
   )
}