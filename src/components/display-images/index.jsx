



import { useState , useEffect } from "react";
import { storage , googleProvider , facebookProvider , auth , db } from "./../../config/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Box , LinearProgress , Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Button , CircularProgress ,Select ,Drawer ,OutlinedInput ,MenuItem,TextField } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import { query, doc , deleteDoc , collection, addDoc , setDoc, getDocs, where } from "firebase/firestore";
import { User } from "./../../App"
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import ShareIcon from '@mui/icons-material/Share';
import * as React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
} from "react-router-dom";

function DisplayImages() {
    const { user ,setUser} = React.useContext(User);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const history = useHistory()
    const [selectedFolder, setSelectedFolder] = useState("");
    let folderImages = []

    images.map((item)=>{
    	if(item.folder === selectedFolder){
    		folderImages.push(item)
    	}
    });

	const getContent = async () => {
		const local = []
		const querySnapshot = await getDocs(collection(db, "images"));

		querySnapshot.forEach((item)=>{
			if(item.data().userID === user.uid){
				local.push(item.data())
			}
		})
		console.log(local)
		setImages(local)
    setLoading(false)
	}


	const addToFolder = async (image , folder) => {
  setLoading(true)

		const querySnapshot = await getDocs(collection(db, "images"));

    querySnapshot.forEach(async (item) => {
      if (item.data().imageSource === image.imageSource) {
      	await setDoc(doc(db, "images", item.id), {
          ...image,
          folder,
        });

        console.log("Done updating")
        getContent()
      }
    });
    setLoading(false)
	}

		const deleteItem = async (image , folder) => {
setLoading(true)

		const querySnapshot = await getDocs(collection(db, "images"));

    querySnapshot.forEach(async (item) => {
      if (item.data().imageSource === image.imageSource) {
      	await deleteDoc(doc(db, "images", item.id), {
          ...image,
          folder,
        });

        console.log("Done updating")
        getContent()
      }
    });
	}

	React.useEffect(()=>{
		getContent()
	},[user.uid])

  React.useEffect(()=>{
    if(user.uid === ""){
      history.push("/")
    }
  },[]);

  const openImage = (item) => {
    history.push(`/folder:${item.toLowerCase()}`)
  }

  const folders = [
  {
    title:"All",
    image:'https://images.pexels.com/photos/4066761/pexels-photo-4066761.jpeg?auto=compress&cs=tinysrgb&w=1600'
  } ,
  {
    title:"Favourites",
    image:'https://media.istockphoto.com/id/1403773415/photo/hand-changing-with-smile-emoticon-icons-face-on-wooden-cube-costumer-service-concept.jpg?b=1&s=612x612&w=0&k=20&c=S-YE-chHzM-a3v6Ky2XeKBRERkBBg-faZXzXJOv5s0Y='
  } ,
  {
    title:"Camera",
    image:'https://images.pexels.com/photos/414781/pexels-photo-414781.jpeg?auto=compress&cs=tinysrgb&w=1600'
  } ,
  {
    title:"Cloud",
    image:'https://images.pexels.com/photos/531756/pexels-photo-531756.jpeg?auto=compress&cs=tinysrgb&w=1600'
  } ,
  {
    title:"Drip",
    image:'https://images.pexels.com/photos/1212407/pexels-photo-1212407.jpeg?auto=compress&cs=tinysrgb&w=1600'
  } ,
    {
    title:"Nature",
    image:'https://images.pexels.com/photos/11380322/pexels-photo-11380322.jpeg?auto=compress&cs=tinysrgb&w=1600'
  } ,
  ]


    
    return (
        <Box sx={{ padding:'2.5rem' , color:'#eee' }}>
      {
        loading ? (
          <Box sx={{ height:'50vh' , background:'' , display:'flex' , justifyContent:'center' , alignItems
          :'center' , margin:'21px 0' }}>
          <CircularProgress size={"12.5rem"} sx={{ margin:"25vh auto" }} />
          </Box>
          ) : (
          <Grid container spacing={0}>
            {
              folders.map((item)=>{
                return(
                  <Grid key={item.title} item xs={2.4} sx={{ cursor: "pointer" , border:'5px solid white' , height:'250px' , backgroundImage:`url("${item.image}")` , backgroundSize:'cover' , opacity:"0.9", "&:hover":{opacity:"1"} , display:'flex' , alignItems:'center' , justifyContent:'center' }}> 
                  
                  <Typography onClick={ ()=> openImage(item.title) } sx={{ width:'100%' , height:'100%' , fontSize:'32px' , fontWeight:600 , display:'flex' , alignItems:'center' , justifyContent:'center' , background:"rgba(1,1,1,.3)"  , "&:hover":{background:"rgba(1,1,1,.9)"} }} >{item.title}</Typography> 
                  </Grid>
                )
              })
            }
          </Grid>
          )
      }

        </Box>
    );
}
 
export default DisplayImages;

