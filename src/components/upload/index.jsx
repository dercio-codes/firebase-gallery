import { useState , useEffect } from "react";
import { storage , googleProvider , facebookProvider , auth , db } from "./../../config/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Box , LinearProgress , Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Button , CircularProgress ,Select ,Drawer ,OutlinedInput ,MenuItem,TextField } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import { query, doc ,  collection, addDoc , setDoc, getDocs, where } from "firebase/firestore";
import { User } from "./../../App"

import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import { useHistory } from 'react-router-dom';

import * as React from 'react';

function Upload() {
    const { user ,setUser} = React.useContext(User);

    // State to store uploaded file
    const history = useHistory()
    const [file, setFile] = useState("");
    const [newImage, SetNewImage] = useState("");
    const [newImageItem, SetNewImageItem] = useState({
    	folder:"",
    	imageSource:"",
    	userID:user.uid
    });
    const [loading, setLoading] = useState(false);
 
    // progress
    const [percent, setPercent] = useState(0);
 

    // Handle file upload event and update state
    function handleFileChange(event) {
        setFile(event.target.files[0]);
    }

	const [preview, setPreview] = useState()


 useEffect(() => {
        if (!file) {
            setPreview(undefined)
            return
        }

        const objectUrl = URL.createObjectURL(file)
        setPreview(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [file])


    const handleFileUpload =  async() => {
       // if(user.email === "12derciomaduna@gmail.com"){
         if (!file) {
            alert("Please upload an image first!");
        }
 
        const storageRef = ref(storage, `/products/${file.name}`);
 
        // progress can be paused and resumed. It also exposes progress updates.
        // Receives the storage reference and the file to upload.
        const uploadTask = uploadBytesResumable(storageRef, file);
 
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const percent = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
 
                // update progress
                setPercent(percent);
            },
            (err) => console.log(err),
            () => {
                // download url
                getDownloadURL(uploadTask.snapshot.ref).then( async (url) => {
                    console.log(url);
                    try {
                       await setDoc(doc(db, "images", `${new Date().getTime()} `), {
                                ...newImageItem,
                                imageSource:url,
                        });
                       	history.push("/all-images")
                    } catch (err) {
                      console.error(err);
                      alert(err.message);
                    }

                });
            }
        );
    };

   React.useEffect(()=>{
    setLoading(true)
    if(user.uid === ""){
      history.push("/")
    }
    setLoading(false)
  },[]);

    
    return (
        <Box sx={{ padding:'2.5rem' , color:'#eee' }}>
        {
        loading ? (
          <Box sx={{ height:'50vh' , background:'' , display:'flex' , justifyContent:'center' , alignItems
          :'center' , margin:'21px 0' }}>
          <CircularProgress size={"12.5rem"} sx={{ margin:"25vh auto" }} />
          </Box>
          ) : (
          <>
        <Box sx={{ width:`${percent}%` , background:'rgba(1,1,1,.7)' , height:'8px' , position:'fixed' , top:0 , left:'0' }} />
            <Grid container>
            <Grid item xs={12} lg={6}>
            <input className="custom-file-input" placeholder="Select Image Here" style={{ height:'80vh' , width:'100%' , background:'rgba(1,1,1,.3)' }} type="file" onChange={handleFileChange} accept="/image/*" />
            <Button sx={{ width:'100%' , padding:'21px' , background:'rgba(1,1,1,.9)' }} onClick={handleFileUpload}>Upload Image</Button>
            <p>{percent} "% done"</p>
            </Grid>
                        <Grid item xs={12} lg={6}>
                        <img src={preview} alt="" style={{ width:"100%" , objectFit:'contain' }} />
            
            </Grid>
            </Grid>
            </>
            )
      }
        </Box>
    );
}
 
export default Upload;
            // <Box sx={{ backgroundImage:`url("${preview}"")` , backgroundSize:'contain' , backgroundPosition:'center' , width:'100%' , height:'350px' }} />