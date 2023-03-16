/* Credits: https://blog.logrocket.com/using-filereader-api-preview-images-react/ */

import { useEffect, useState, useRef } from 'react';

const ProfilePic = (props) => {

  const user = props.user;
  const imageMimeType = /image\/(png|jpg|jpeg)/i;
  const [file, setFile] = useState(null);
  const [fileDataURL, setFileDataURL] = useState(null);
 
  useEffect(() => {
    // set picture from user data
    if (user && user.picture && user.picture.custom) {
      setFileDataURL(user.picture.custom);
    } else if (user && user.picture && user.picture.medium) {
      setFileDataURL(user.picture.medium);
    }
  }, [user]);

  useEffect(() => {
    // reset picture
    if (user && user.picture && user.picture.custom) {
      setFileDataURL(user.picture.custom);
    } else if (user && user.picture && user.picture.medium) {
      setFileDataURL(user.picture.medium);
    }
  }, [props.resetPic]);

  useEffect(() => {
    // read picture file from user's device
    let fileReader, isCancel = false;
    if (file) {
      fileReader = new FileReader();
      fileReader.onload = (e) => {
        const { result } = e.target;
        if (result && !isCancel) {
          props.setCustomPic(result);
          setFileDataURL(result);
        }
      }
      fileReader.readAsDataURL(file);
    }
    return () => {
      isCancel = true;
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort();
      }
    }
  }, [file]);

  const changeHandler = (e) => {
    // select picture from user's device
    const file = e.target.files[0];
    if (!file.type.match(imageMimeType)) {
      alert("Image mime type is not valid");
      return;
    }
    setFile(file);
  }
 
  const fileBtn = useRef(null); // helper to hide upload control

  return (
    <div className="col">
      {fileDataURL ? 
        <img src={fileDataURL} alt={user.name.first + ' ' +  user.name.last} className="profile-pic" />
        : null }
      <input
        type="file"
        id='image'
        accept='.png, .jpg, .jpeg'
        onChange={changeHandler}
        className='hide'
        ref={fileBtn}
      />
      <input
        type="button"
        value="Change..."
        className={props.disabled ? 'hide' : 'show'}
        onClick={() => fileBtn.current.click()}
      />
    </div>
  );
}

export default ProfilePic;