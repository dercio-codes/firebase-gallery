import { useState , useEffect } from "react";
import { storage , googleProvider , facebookProvider , auth , db } from "./../config/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Box , LinearProgress , Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Button , CircularProgress ,Select ,Drawer ,OutlinedInput ,MenuItem,TextField } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import { query, doc , deleteDoc , collection, addDoc , setDoc, getDocs, where } from "firebase/firestore";
import { User } from "./../App"
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
import { useParams } from 'react-router-dom';

function Folder(props) {
    const { user ,setUser} = React.useContext(User);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const history = useHistory()
    let folderImages = []

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
   const searchParams = useParams();
  console.log(searchParams.folderName.slice(1).toLowerCase());

    if(searchParams.folderName.slice(1).toLowerCase() === "all"){

      folderImages = [...images]
    }else{
    images.map((item)=>{
      if(item.folder.toLowerCase() === searchParams.folderName.slice(1).toLowerCase()){
        folderImages.push(item)
      }
    });
    }

     React.useEffect(()=>{
    if(user.uid === ""){
      history.push("/")
    }
  },[]);

    
    return (
        <Box sx={{ padding:'2.5rem' , color:'#eee' }}>
		

      {
        loading ? (
          <Box sx={{ height:'50vh' , background:'' , display:'flex' , justifyContent:'center' , alignItems
          :'center' }}>
          <CircularProgress size={"12.5rem"} sx={{ margin:"25vh auto" }} />
          </Box>
          ) : (
    <Grid container spacing={3}>
        
  
            {
              folderImages.length === 0 ? (
                  <Grid item xs={12} sx={{ height:'50vh' }}>

          <Box sx={{ height:'50vh' , color:"#111", background:'' , display:'flex' , justifyContent:'center' , flexDirection:'column' , alignItems
          :'center' }}>
          <img src="https://cdn-icons-png.flaticon.com/512/3875/3875172.png" style={{ width:'100%' , height:'200px' , objectFit:'contain' }} alt="" />
          <Typography sx={{ fontSize:'54px', fontWeight:600 }}>
            Nothing under the folder {searchParams.folderName}
            </Typography>
            <Typography sx={{ fontSize:'32px', fontWeight:600 }}>
            Upload your first image here 
            </Typography>
                    </Box>
                  </Grid>
                  
                ) : (
                  folderImages.map((item)=>{
                      return(

                                  <Grid item key={item.imageSource} xs={3} sx={{ margin:'12px 0' }}>
                    <Box sx={{ height:'250px' , width:'100%' , backgroundImage:`url(${item.imageSource})` , backgroundSize:"cover" , backgroundPosition:'center' , backgroundRepeat:'no-repeat'}}  />
                  <Box sx={{ width:'100%' , display:'flex' , background:'', minHeight:'50px' , marginTop:'12px'  }}>
                    <Box onClick={()=> deleteItem(item)} sx={{ flex:1 , background:'' , display:'flex' , alignItems:'center' , justifyContent:'center' }}>
<DeleteForeverIcon sx={{ color:'#111' , fontSize:'24px' , margin:'12px auto' }} />
                    </Box>
                    <Box sx={{ flex:1 , background:'' }}>
                      <TextField label={"Move To?"} select fullWidth >
                      <MenuItem onClick={() => addToFolder(item , "Favourites")} value="Favourites">Favourites</MenuItem>
                      <MenuItem onClick={() => addToFolder(item , "Hidden")} value="Hidden">Hidden</MenuItem>
                      <MenuItem onClick={() => addToFolder(item , "Camera")} value="Camera">Camera</MenuItem>
                      <MenuItem onClick={() => addToFolder(item , "Cloud")} value="Cloud">Cloud</MenuItem>
                      <MenuItem onClick={() => addToFolder(item , "Drip")} value="Drip">Drip</MenuItem>
                      </TextField>
                    </Box>
                  </Box>
                </Grid>)
                  })

                )
            }
        </Grid>

          )
      }

        </Box>
    );
}
 
export default Folder;

