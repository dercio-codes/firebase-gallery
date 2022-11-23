import Auth from "./components/auth"
import Upload from "./components/upload"
import DisplayImages from "./components/display-images"
import React from "react";

export const User = React.createContext({})

function App() {
    const [ user ,setUser] = React.useState({
        uid:"",
        displayName:"",
        email:""
    });

  return (
    <User.Provider value={{ user ,setUser }}>
    <div className="App">
     
      { user.uid === "" ? <Auth /> : <Upload /> }

      {user.uid !== "" && <DisplayImages /> }
    </div>
    </User.Provider>
  );
}

export default App;
