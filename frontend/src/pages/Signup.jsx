import React from 'react'
import { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom';
export default function Signup() {
  const[username,setUsername] = useState('');
  const[email,setEmail]=useState('');
  const[password,setPassword] = useState('');
  const navigate = useNavigate();

  const handleChange = (e)=>{
    if(e.target.id=='username'){
      setUsername(e.target.value);
    }
    else if(e.target.id=='password'){
      setPassword(e.target.value);
    }
    else if(e.target.id=='email'){
      setEmail(e.target.value);
    }
  }
  const handleSubmit = async (e)=>{
    e.preventDefault();
    try{
      const res=await fetch(' http://127.0.0.1:8787/api/auth/signup',{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username,email,password})
    })
    const data=await res.json();
    console.log(data);
    navigate('/')

    }catch(e){
      console.log(e)
    }
    
  }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-centre font-semibold 
      my-7">Sign Up</h1>
      <form onSubmit={handleSubmit}className="flex flex-col gap-4">
        <input type="text" placeholder="username" className='
        border p-3 rounded-lg' id='username' onChange={handleChange}/>
        <input type="text" placeholder="email" className='
        border p-3 rounded-lg' id='email' onChange={handleChange}/>
        <input type="password" placeholder="password" className='
        border p-3 rounded-lg' id='password' onChange={handleChange}/>
        <button className="bg-slate-700 text-white p-3 rounded-lg uppacase hover:opacity-95">Sign-up</button>
        
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to={"/signin"}>
          <span className='text-blue-700'>Sign in</span>
        </Link>
      </div>
    </div>
  )
}
