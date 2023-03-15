import React, { useState, useEffect } from "react";
import "./UserProfile.css";
import ContentEditable from "react-contenteditable";
import cloneDeep from 'lodash/cloneDeep';
import ProfilePic from './ProfilePic'

const UserProfile = () => {

  const [user, setUser] = useState();
  const [oldUser, setOldUser] = useState();
  const [isEditDisabled, setIsEditDisabled] = useState(true);
  const [profilePic, setProfilePic] = useState(null);
  const [resetPic, setResetPic] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("https://randomuser.me/api/?results=1")
    .then(response => response.json())
    .then(data => {
      setUser(data.results[0]);
      setOldUser(cloneDeep(data.results[0])); // separating original and modified values
      setProfilePic(data.results[0].picture.medium);
    });
  },[]);

  const handleBlur = (e) => {
    let newUser = user; //let newUser = {...user} and cloneDeep(oldUser) did not work for this - old and new values got mixed
    const val = e.target.innerHTML; // e.target.value returns undefined, innerHTML works
    const aFld = e.target.id.split('.'); // can be 2-part id like name.first
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
    console.log('TODO: Submit user data to server: ', user)
    setIsEditDisabled(true);
    setOldUser(oldUser => user); // set the "restore point"
    setSaved(true);
  };

  const cancelEdit = () => {
    // restore original user data
    const tempUser = cloneDeep(oldUser);
    setUser(tempUser);
    setResetPic(!resetPic); // needed another var to trigger useEffect in ProfilePic, because profilePic is unhanged
    setIsEditDisabled(true);
  };

  const setCustomPic = (pic) => {
    let tempUser = cloneDeep(user);
    tempUser['picture']['custom'] = pic;
    setUser(tempUser); 
  };

  return (
    <>
    {user ?
      <div className="col full-size">
        <div className="row">
          <div className="row col1">
            <ProfilePic username={user.name} pic={profilePic} resetPic={resetPic}
              setCustomPic={setCustomPic} disabled={isEditDisabled} />
          </div>
          <div className="row col2">
            <h1><ContentEditable
                html={user.name.first}
                disabled={isEditDisabled}
                id="name.first" 
                onBlur={handleBlur}
                className={isEditDisabled ? 'input-disabled' : 'input-enabled'}
              />
              <ContentEditable
                html={user.name.last}
                disabled={isEditDisabled}
                id="name.last" 
                onBlur={handleBlur}
                className={isEditDisabled ? 'input-disabled' : 'input-enabled'}
              /></h1>
          </div>
        </div>
        <div className="row">
          <div className="col1 hdl">
            Phone
          </div>
          <div className="col2">
            <ContentEditable
              html={user.phone.toString()}
              disabled={isEditDisabled}
              id="phone" 
              onBlur={handleBlur}
              className={isEditDisabled ? 'input-disabled' : 'input-enabled'}
              />
          </div>
        </div>
        <div className="row">
          <div className="col1 hdl">
            Email
          </div>
          <div className="col2">
            <ContentEditable
              html={user.email}
              disabled={isEditDisabled}
              id="email" 
              onBlur={handleBlur}
              className={isEditDisabled ? 'input-disabled' : 'input-enabled'}
              />
          </div>
        </div>
        <div className="row">
          <div className="col1 hdl">
            Location
          </div>
          <div className="col2">
            <ContentEditable
              html={user.location.city}
              disabled={isEditDisabled}
              id="location.city" 
              onBlur={handleBlur}
              className={isEditDisabled ? 'input-disabled' : 'input-enabled'}
              />
            <div className="comma">,</div>
            <ContentEditable
              html={user.location.country}
              disabled={isEditDisabled}
              id="location.country" 
              onBlur={handleBlur}
              className={isEditDisabled ? 'input-disabled' : 'input-enabled'}
              />              
          </div>
        </div>
        <div className="row">
          <div className="col1"></div>
          <div className="col2">
            <button style={isEditDisabled ? {display: 'block'} : {display: 'none'}}
              onClick={() => {setIsEditDisabled(!isEditDisabled); setSaved(false);}}>Edit</button>
            <div style={saved ? {display: 'block', color: 'green'} : {display: 'none'}}>Saved!</div>
            <button style={isEditDisabled ? {display: 'none'} : {display: 'block', marginRight: '1vw'}}
              onClick={() => {saveEdit()}}>Save</button>
            <button style={isEditDisabled ? {display: 'none'} : {display: 'block', marginRight: '1vw'}}
              onClick={() => {cancelEdit()}}>Cancel</button>
          </div>
        </div>
      </div>
    : <div>Loading...</div>}
    </>
  );

}

export default UserProfile;