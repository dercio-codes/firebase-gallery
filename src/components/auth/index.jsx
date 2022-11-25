import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Box , Button , Grid , TextField } from '@mui/material';
import { query, collection, addDoc, setDoc , deleteDoc , doc , getDocs, where } from "firebase/firestore";
import { storage , googleProvider , facebookProvider , auth , db } from "./../../config/firebaseConfig";
import { signInWithPopup, createUserWithEmailAndPassword , signInWithEmailAndPassword ,GoogleAuthProvider , FacebookAuthProvider ,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  inMemoryPersistence } from 'firebase/auth';
import { User } from "./../../App"
import TwitterIcon from '@mui/icons-material/Twitter';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
} from "react-router-dom";

export default function Auth() {
    const [ products ,setProducts] = React.useState([]);
    const [ signIn ,setSignIn] = React.useState(true);
	const [ error ,setError] = React.useState("");
    const { user ,setUser} = React.useContext(User);

    const history = useHistory()
	const [ userLogin ,setUserLogin] = React.useState({
        email:"",
        password:""
    });

    const [ userSignUp ,setUserSignup] = React.useState({
        displayName:"",
        email:"",
        password:""
    });

    const handleChange = (event) => {
        setUserLogin({
      ...userLogin,
      [event.target.name]: event.target.value,
    })
    }

    const handleSignUpChange = (event) => {
          setUserSignup({
      ...userSignUp,
      [event.target.name]: event.target.value,
    })
    }
    console.log(userSignUp)

    const UpdateUser = async (user) => {
         // await setDoc(doc(db, "users" , user.email), {
         //                        uid : user.uid,
         //                        email : user.email,
         //        });
        // toast.success('Succesfully logged in. !', {
        //     position: toast.POSITION.TOP_RIGHT
        // });
    }
    
    const googleHandler = async () => {
        googleProvider.setCustomParameters({ prompt: 'select_account' });
        signInWithPopup(auth, googleProvider)
            .then(async (result) => {
                console.log(result)
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const resultsUser = result.user;
                // auth.onAuthStateChanged((user)=> console.log("changed user here : " , user))
                auth.onAuthStateChanged(authUser => {
                  authUser
                    ? localStorage.setItem('authUser', JSON.stringify(authUser))
                    : localStorage.removeItem('authUser')
                });
                console.log(resultsUser);
                setUser({...resultsUser});

                UpdateUser(resultsUser)
                // redux action? --> dispatch({ type: SET_USER, user });
            })
            .catch((error) => {
                // Handle Errors here.
                console.log(error)
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
            });
    };

    const facebookHandler = async () => {
        facebookProvider.setCustomParameters({ prompt: 'select_account' });
        signInWithPopup(auth, facebookProvider)
            .then(async (result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = FacebookAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const resultsUser = result.user;
                setUser({...resultsUser});
                UpdateUser(resultsUser)
                console.log(resultsUser);
                // redux action? --> dispatch({ type: SET_USER, user });
            })
            .catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.email;
                // The AuthCredential type that was used.
                const credential = FacebookAuthProvider.credentialFromError(error);
                // ...
            });
    };

    const createUser = () => {
        createUserWithEmailAndPassword(auth, userSignUp.email, userSignUp.password)
          .then((userCredential) => {
             const resultsUser = userCredential.user;
                // auth.onAuthStateChanged((user)=> console.log("changed user here : " , user))
                auth.onAuthStateChanged(authUser => {
                  authUser
                    ? localStorage.setItem('authUser', JSON.stringify(authUser))
                    : localStorage.removeItem('authUser')
                });
                console.log(resultsUser);
                setUser({...resultsUser , displayName:userSignUp.displayName});
            // ...
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ..
          });
    }

    const handleSignIn = () => {
        signInWithEmailAndPassword(auth, userLogin.email, userLogin.password)
          .then((userCredential) => {
            // Signed in 
             const resultsUser = userCredential.user;
                // auth.onAuthStateChanged((user)=> console.log("changed user here : " , user))
                auth.onAuthStateChanged(authUser => {
                  authUser
                    ? localStorage.setItem('authUser', JSON.stringify(authUser))
                    : localStorage.removeItem('authUser')
                });
                console.log(resultsUser);
                setUser({...resultsUser});
            // ...
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            setError(errorMessage)
            // ..
          });
    }

    React.useEffect(()=>{
        if(user.uid !== "" && user.email !== ""){
            history.push("/all-images")
        }
    },[])



  return (
    <Box sx={{ 	
    		width: '100%' , 
    		padding:{
    			// xs:'0.5rem',
    			xs:'3.5rem 1.5rem',
    		},
    		marginTop:'2.rem',
    		position:'fixed',
            margin:'auto 0',
            background:'rgba(200,200,200,.3)',
            minHeight:'80vh',
    		display:'flex',
    		flexDirection:'column',
    		justifyContent:'center',
    		zIndex:'9',
    		// borderBottom:'1px solid red'
    		 }}>
    		 <Box  sx={{ display:'flex',
    		flexDirection:'column',
    		justifyContent:'center',
    		alignItems:'center',
    		zIndex:'5 !important',
            // background:'#111',
    		border:'none'
    		 }}>
    		    <Box sx={{ 	
    		width: {
                xs:"80%",
                lg:'50%'} , 
    		padding:{
    			// xs:'0.5rem',
    			xs:'3.5rem 1.5rem',
    		},
    		// marginTop:'2.rem',
            overflowY:{xs:'auto' , lg:"hidden"},
            // height:'80vh',
            minHeight:'50vh',
    		display:'flex',
    		flexDirection:'column',
    		justifyContent:'center',
    		// zIndex:'9',
            background:'rgba(255,255,255,1)',
    		// background:'#222',
    		// borderBottom:'1px solid red'
    		 }}>
             <Typography fontWeight={"600"} fontSize={"38px"} textAlign={"center"}> Please Login or Sign Up to View Your Gallery
             </Typography>
    		 <Grid container>
    		 	<Grid item xs={12} sx={{  background:'' , padding:'12px 21px' }}>
    		{
                    signIn ? (
                            <form onSubmit={handleSignIn}>

            <TextField value={userLogin.email} sx={{ width:'100%' , margin:'12px 0' }} onChange={handleChange}  type="email" label="Email" name="email" />
            <TextField value={userLogin.password} sx={{ width:'100%' , margin:'12px 0' }} onChange={handleChange}  type="password" label="Password" name="password" />
                <Button onClick={handleSignIn} sx={{ width:'100%' , padding:'12px 21px' , background:"red" ,"&:hover":{ color:"red" }, margin:'12px 0' , color:'#eee' , fontWeight:'600' }}>Sign In</Button>

                            </form>
                        ) : (
                            <form onSubmit={createUser}>

            <TextField value={userSignUp.displayName} sx={{ width:'100%' , margin:'12px 0' }} onChange={handleSignUpChange}  type="text" label="Display Name" name="displayName" />
            <TextField value={userSignUp.email} sx={{ width:'100%' , margin:'12px 0' }} onChange={handleSignUpChange}  type="email" label="Email" name="email" />
            <TextField value={userSignUp.password} sx={{ width:'100%' , margin:'12px 0' }} onChange={handleSignUpChange}  type="password" label="Password" name="password" />
                <Button onClick={createUser} sx={{ width:'100%' , padding:'21px 21px' , background:"red" ,"&:hover":{ color:"red" }, margin:'12px 0' , color:'#eee' , fontWeight:'600' }}>Sign Up</Button>

                            </form>
                        )
                }

                {
                    error !== "" && <Typography fontSize={"32px"} textAlign={"center"} >{error}</Typography>
                }

    		
            <Typography sx={{margin:"21px 0" , fontSize:'18px' , textAlign:'center' , color:"red" , padding:'0 0' ,margin:'12px 0' }}>{signIn ? "Don't have an account ?" : "Already have an account ?"}</Typography>
                        <Typography  onClick={()=> setSignIn(!signIn)} sx={{fontWeight:'600',textAlign:'center', cursor:"pointer", "&:hover":{ textDecoration:'underline' } , fontSize:'16px' ,color:"#4267B2" }} > Click Here To Sign { signIn ? "Up" : "In"} </Typography> 
               
               
    		 	</Grid>
    		 	<Grid item xs={12} sx={{ minHeight:"" , background:'' , padding:'12px 21px' , display:'flex' , justifyContent:'' , alignItems:'' , flexDirection:'column' }}>
             <Box sx={{ padding:" 0" }}>

     <Button onClick={googleHandler} sx={{ width:'100%' , padding:'14px 21px' , background:'#F4B400' ,"&:hover":{ color:'#F4B400' }, margin:'12px 0' , color:'#eee' , fontWeight:'600' , display:'flex', }}><img style={{height:'34px', margin:'0 12px' , objectFit:'contain'}} src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-suite-everything-you-need-know-about-google-newest-0.png" alt=""/>Continue with Google</Button>
                <Button onClick={facebookHandler} sx={{ width:'100%' , padding:'14px 21px' , background:'#4267B2' ,"&:hover":{ color:'#4267B2' }, margin:'12px 0' , color:'#eee' , fontWeight:'600' , display:'flex', }}><img style={{height:'34px', margin:'0 12px' , objectFit:'contain'}} src="   https://www.transparentpng.com/download/facebook-logo/facebook-icon-transparent-background-20.png" alt=""/>Continue with Facebook</Button>
                {/*<Button sx={{ width:'100%' , padding:'14px 21px' , background:'#000' ,"&:hover":{ color:'#000' }, margin:'12px 0' , color:'#eee' , fontWeight:'600' , display:'flex',"&:hover":{filter:"invert(1)" } }}><img style={{height:'28px' ,margin:'0 12px' , marginRight:'28px' ,filter:"invert(1)" , objectFit:'contain'}} src="https://www.freepnglogos.com/uploads/apple-logo-png/file-apple-logo-black-svg-wikimedia-commons-1.png" alt=""/>Continue with Apple</Button>
                <Button sx={{ width:'100%' , padding:'14px 21px' , background:'#1DA1F2' ,"&:hover":{ color:'#1DA1F2' }, margin:'12px 0' , color:'#eee' , fontWeight:'600' , display:'flex', }}><TwitterIcon sx={{ margin:'0 12px' , fontSize:'34px' }} />  Continue with Twitter</Button>
                */}
             </Box>
    		 	</Grid>
    		 	</Grid>
    		 </Box>
    		 </Box>

    </Box>
  );
}


const styles = {
	Text:{
		cursor:'pointer',
		fontSize:'14px',
		fontWeight:'600',
		"&:hover":{
			textDecoration:'underline'
		}
	}
}