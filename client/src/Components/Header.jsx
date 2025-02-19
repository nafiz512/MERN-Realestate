//Header 
import {FaSearch} from 'react-icons/fa';
import { useSelector,useDispatch } from 'react-redux';

import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';


import { 
    deleteUserFailure,
    deleteUserSuccess,
    signOutUserStart,
   } from "../redux/user/userSlice";

export default function Header() {
    const {currentUser}=useSelector(state=>state.user);
    const [searchTerm, setSearchTerm] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

    const handleSignOut = async () => {
        try {
          dispatch(signOutUserStart());
          const res = await fetch('/api/auth/signout');
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
    
      useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if (searchTermFromUrl) {
          setSearchTerm(searchTermFromUrl);
        }
      }, [location.search]);
    
return (
    <header className='bg-slate-200 shadow-md'>
        <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
            <Link to='/'>
            <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span className='text-slate-500'>Car</span>
            <span className='text-slate-700'>Market</span>
            </h1>
            </Link>
            <form
          onSubmit={handleSubmit}
          className='bg-slate-100 p-3 rounded-lg flex items-center'
        >
          <input
            type='text'
            placeholder='Search...'
            className='bg-transparent focus:outline-none w-24 sm:w-64'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className='text-slate-600' />
          </button>
        </form>
            <ul className='flex gap-4 '>
                <Link to='/'><li className=' sm:inline text-slate-700 hover:underline'>Home</li></Link>
                <Link to='/about'><li className='sm:inline text-slate-700 hover:underline'>About</li></Link>

                <Link to='/profile'>
                {currentUser?(<img className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt='profile'/>):(<li className=' text-slate-700 hover:underline'>Sign in</li>)
                }
                </Link>
                {currentUser?(<li onClick={handleSignOut} className=' sm:inline text-slate-700 hover:underline cursor-pointer'>Sign out</li>):(<li></li>)}
            </ul>
        </div>
        
    </header>
)
}
