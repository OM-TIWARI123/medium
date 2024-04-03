import { userAtom } from '../Recoil/userSlice';
import {useRecoilValue} from 'recoil'
import { Navigate, Outlet } from 'react-router-dom';

export default function PrivateRoute() {
    const currentUser=useRecoilValue(userAtom);
    if(currentUser){
        return <Outlet/>
    }
    else{
        return <Navigate to='/signin'/>
    }
}
