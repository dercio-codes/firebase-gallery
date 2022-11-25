import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
} from "react-router-dom";
import Auth from "./components/auth"
import Upload from "./components/upload"
import DisplayImages from "./components/display-images"
import Folder from "./components/folder"
import React from "react";
import { signOut } from 'firebase/auth';
import { auth } from "./config/firebaseConfig";
import { Avatar } from '@mui/material';
import FileUploadIcon from "@mui/icons-material/FileUpload"
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import { Fragment } from 'react';

export const User = React.createContext({})


function App() {
    const [ user ,setUser] = React.useState({
        uid:"",
        displayName:"",
        email:""
    });

        React.useEffect(()=>{
        const localStorageUser = localStorage.getItem('authUser') ? JSON.parse(localStorage.getItem('authUser')) : { ...user };
        setUser({...localStorageUser})
        console.log(localStorageUser)
    },[])

    const history = useHistory()

const Layout = (props) => {
  return (
    <Fragment>
      <div style={{ height:'10vh' , background:'' , width:'100%' , display:'flex' , alignItems:'center' , justifyContent:'space-between' , padding:'0 2.5rem' }}>
          
          <Avatar src={user.photoURL} alt={user.displayName} sx={{ scale:'1.5' , opacity:user.displayName === "" ? "0" : "1" }} />

          <div style={{ display:'flex' , alignItems:'center' , justifyContent:'space-evenly' , width:'50%'}}>

          <h4><Link onClick={async(e)=>{
            e.preventDefault()
            if(user.uid !== ""){
              history.push("/all-images")
            }else{
              alert("user is not authenticated")
            }
          }} to={"/all-images"} style={{ display:'flex' , alignItems:'center' }} >Home <HomeIcon sx={{ margin:'0 8px' }} /></Link></h4>
          <h4><Link onClick={async(e)=>{
            e.preventDefault()
            if(user.uid !== ""){
              history.push("/upload")
            }else{
              alert("user is not authenticated")
            }
          }}to={"/upload"} style={{ display:'flex' , alignItems:'center' }}>Upload<FileUploadIcon sx={{ scale:'1' , margin:'0 8px' }} /></Link></h4>
          {
            user.email === "" ? (
          <h4><Link to={"/"} style={{   display:'flex' , alignItems:'center' , }}>{"Sign In"} <LoginIcon sx={{ margin:'0 8px' }} /> </Link></h4>
              ) : (

          <h4 style={{ cursor:'pointer' , display:'flex' , alignItems:'center' , }} onClick={async(e)=>{
            e.preventDefault()
             signOut(auth)
            .then(() => {
                console.log('logged out');
                localStorage.removeItem('authUser')
                setUser({
                  uid:"",
                  displayName:"",
                  email:""
                })
                  history.push("/")
                })
            .catch((error) => {
                console.log(error);
            });
          }}>{"Sign Out"}

<LogoutIcon sx={{ margin:'0 8px' }} />
          </h4>
              )
           
          }

        </div>
      </div>
      <main>{props.children}</main>
    </Fragment>
  );
};
  return (
    <User.Provider value={{ user ,setUser }}>
    <div className="App">
     


      <Layout>
      <Switch>

        <Route path='/' exact>
          <Auth />
        </Route>
        <Route path='/upload' >
          <Upload />
        </Route>
        <Route path='/all-images' >
          <DisplayImages />
        </Route>
        <Route path='/folder:folderName' >
          <Folder />
        </Route>
        <Route path='/folder' >
          <Folder />
        </Route>
        </Switch>
    </Layout>
    </div>
    </User.Provider>
  );
}

export default App;