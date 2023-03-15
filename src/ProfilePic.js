/* Credits: https://blog.logrocket.com/using-filereader-api-preview-images-react/ */

import { useEffect, useState, useRef } from 'react';

const ProfilePic = (props) => {

  const imageMimeType = /image\/(png|jpg|jpeg)/i;

  const [file, setFile] = useState(null);
  const [fileDataURL, setFileDataURL] = useState(props.pic);
 
  const changeHandler = (e) => {
    // select picture from user's device
    const file = e.target.files[0];
    if (!file.type.match(imageMimeType)) {
      alert("Image mime type is not valid");
      return;
    }
    setFile(file);
  }

  useEffect(() => {
    // set picture from user data
    setFileDataURL(props.pic)
  }, [props.pic]);

  useEffect(() => {
    // reset original picture
    setFileDataURL(props.pic)
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

  const fileBtn = useRef(null); // helper to hide upload control

  return (
    <div style={{flexDirection: 'column'}}>
      {fileDataURL ? <img src={fileDataURL} alt={props.username.first + ' ' +  props.username.last}
        style={{width: '128px', height: '128px'}} /> : null}
      <input
        type="file"
        id='image'
        accept='.png, .jpg, .jpeg'
        onChange={changeHandler}
        style={{display: 'none'}} 
        ref={fileBtn}
      />
      <input
        type="button"
        value="Change..."
        style={props.disabled ? {display: 'none'} : {dislay: 'block'}}
        onClick={() => fileBtn.current.click()}
      />
    </div>
  );
}

export default ProfilePic;