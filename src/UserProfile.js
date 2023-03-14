import React, { useState, useEffect } from "react";
import "./UserProfile.css";
import ContentEditable from "react-contenteditable";
import cloneDeep from 'lodash/cloneDeep';
import ProfilePic from './ProfilePic'

const UserProfile = () => {

  const [user, setUser] = useState();
  const [oldUser, setOldUser] = useState();
  const [isEditDisabled, setIsEditDisabled] = useState(true);
 
  useEffect(() => {
    fetch("https://randomuser.me/api/?results=1")
    .then(response => response.json())
    .then(data => {
      setUser(data.results[0]);
      setOldUser(cloneDeep(data.results[0])); // clone to prevent mixing values
    });
  },[]);

  const handleBlur = (e) => {
    let newUser = user;
    //let newUser = {...user}; // did not work - old and new values got mixed?
    //let newUser = cloneDeep(oldUser); // did not work - old and new values got mixed?
    const val = e.target.innerHTML; // e.target.value returns undefined
    const aFld = e.target.id.split('.'); // can be 2-part id like user.name
    const fld1 = aFld[0];
    if (aFld.length === 1) {
      newUser[fld1] = val;
    } else if (aFld.length === 2) {
      const fld2 = aFld[1];
      newUser[fld1][fld2] = val;
    }
    setUser(newUser)
  };

  const saveEdit = () => {
    setOldUser(oldUser => user); // update old user data
    setIsEditDisabled(true);
    console.log('TODO: Submit user data to server: ', user)
  };

  const cancelEdit = () => {
    const tempUser = cloneDeep(oldUser);
    setUser(tempUser); // restore old user data
    setIsEditDisabled(true);
  };

  return (
    <div style={{width: '100%', height: '100%'}}>
    {user ?
      <div style={{flexDirection: 'column', width: '100%'}}>
        <div style={{flexDirection: 'row'}}>
          <div style={{flex: 1, justifyContent: 'flex-end'}}>
            <ProfilePic fileDataUrl={user.picture.large}  alt={user.name.first + ' ' +  user.name.last} disabled={isEditDisabled} />
          </div>
          <div style={{flex: 1, alignItems: 'center'}}>
            <h1><ContentEditable
                html={user.name.first}
                disabled={isEditDisabled}
                id="name.first" 
                onBlur={handleBlur}
                style={isEditDisabled ? {backgroundColor: 'white'} : {backgroundColor: 'lightgray'}}
              />
              <ContentEditable
                html={user.name.last}
                disabled={isEditDisabled}
                id="name.last" 
                onBlur={handleBlur}
                style={isEditDisabled ? {backgroundColor: 'white'} : {backgroundColor: 'lightgray'}}
              /></h1>
          </div>
        </div>
        <div style={{flexDirection: 'row'}}>
          <div style={{flex: 1, justifyContent: 'flex-end', fontWeight: 'bold'}}>
            Phone
          </div>
          <div style={{flex: 1}}>
            <ContentEditable
              html={user.phone.toString()}
              disabled={isEditDisabled}
              id="phone" 
              onBlur={handleBlur}
              style={isEditDisabled ? {backgroundColor: 'white'} : {backgroundColor: 'lightgray'}}
            />
          </div>
        </div>
        <div style={{flexDirection: 'row'}}>
          <div style={{flex: 1, justifyContent: 'flex-end', fontWeight: 'bold'}}>
            Email
          </div>
          <div style={{flex: 1}}>
            <ContentEditable
              html={user.email}
              disabled={isEditDisabled}
              id="email" 
              onBlur={handleBlur}
              style={isEditDisabled ? {backgroundColor: 'white'} : {backgroundColor: 'lightgray'}}
            />
          </div>
        </div>
        <div style={{flexDirection: 'row'}}>
          <div style={{flex: 1, justifyContent: 'flex-end', fontWeight: 'bold'}}>
            Location
          </div>
          <div style={{flex: 1}}>
            <ContentEditable
              html={user.location.city}
              disabled={isEditDisabled}
              id="location.city" 
              onBlur={handleBlur}
              style={isEditDisabled ? {backgroundColor: 'white'} : {backgroundColor: 'lightgray'}}
            />,
            <ContentEditable
              html={user.location.country}
              disabled={isEditDisabled}
              id="location.country" 
              onBlur={handleBlur}
              style={isEditDisabled ? {backgroundColor: 'white'} : {backgroundColor: 'lightgray'}}
            />              
          </div>
        </div>
        <div style={{flexDirection: 'row'}}>
          <div style={{flex: 1}}></div>
          <div style={{flex: 1}}>
            <button style={isEditDisabled ? {display: 'block'} : {display: 'none'}}
              onClick={() => {setIsEditDisabled(!isEditDisabled)}}>Edit</button>
            <button style={isEditDisabled ? {display: 'none'} : {display: 'block', marginRight: '1vw'}}
              onClick={() => {saveEdit()}}>Save</button>
            <button style={isEditDisabled ? {display: 'none'} : {display: 'block', marginRight: '1vw'}}
              onClick={() => {cancelEdit()}}>Cancel</button>
          </div>
        </div>
      </div>
    : <div>Loading...</div>}
    </div>
  );

}

export default UserProfile;