
import {Link,useNavigate} from 'react-router-dom'
import {useState} from 'react'
import { userAtom } from '../Recoil/userSlice'
import {useRecoilState} from 'recoil'
export default function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const[user,setUser]=useRecoilState(userAtom);
  const navigate=useNavigate();
  const handleChange=(e)=>{
    if(e.target.id=='email'){
      setEmail(e.target.value);
    }
    else if(e.target.id=='password'){
      setPassword(e.target.value);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:8787/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error('Failed to sign in');
      }

      const data = await res.json();
      localStorage.setItem("token",data.jwt)
      setUser(data.user)
      console.log( "user ",user);
      navigate('/')
    }catch(e){
      console.log(e);
    }
  }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-centre font-semibold 
      my-7">Sign In</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input onChange={handleChange} type="text" placeholder="email" className='
        border p-3 rounded-lg' id='email'/>
        <input onChange={handleChange} type="password" placeholder="password" className='
        border p-3 rounded-lg' id='password' />
        <button  type="submit"className="bg-slate-700 text-white p-3 rounded-lg uppacase hover:opacity-95">Sign-in</button>
        
      </form>
      <div className="flex gap-2 mt-5">
        <p> Dont Have an account?</p>
        <Link to={"/signin"}>
          <span className='text-blue-700'>Sign in</span>
        </Link>
      </div>
    </div>
  )
}

