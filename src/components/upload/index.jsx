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

import * as React from 'react';

function Upload() {
    const { user ,setUser} = React.useContext(User);

    // State to store uploaded file
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
                       	setUser(user)
                    } catch (err) {
                      console.error(err);
                      alert(err.message);
                    }

                });
            }
        );
    // }else{
    //     alert("Please login with the Admin Account to make such changes.")
    // }


    };

    
    return (
        <Box sx={{ padding:'2.5rem' , color:'#eee' }}>
        <Box sx={{ width:`${percent}%` , background:'red' , height:'16px' , position:'fixed' , top:0 , left:'0' }} />
            <input type="file" onChange={handleFileChange} accept="/image/*" />
            <button onClick={handleFileUpload}>Upload Image</button>
            <p>{percent} "% done"</p>

        </Box>
    );
}
 
export default Upload;
            // <Box sx={{ backgroundImage:`url("${preview}"")` , backgroundSize:'contain' , backgroundPosition:'center' , width:'100%' , height:'350px' }} />