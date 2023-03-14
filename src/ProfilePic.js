/* Credits: https://blog.logrocket.com/using-filereader-api-preview-images-react/ */

import { useEffect, useState, useRef } from 'react';

const ProfilePic = (props) => {

  const imageMimeType = /image\/(png|jpg|jpeg)/i;

  const [file, setFile] = useState(null);
  const [fileDataURL, setFileDataURL] = useState(props.fileDataUrl);

  const changeHandler = (e) => {
    const file = e.target.files[0];
    if (!file.type.match(imageMimeType)) {
      alert("Image mime type is not valid");
      return;
    }
    setFile(file);
  }

  useEffect(() => {
    let fileReader, isCancel = false;
    if (file) {
      fileReader = new FileReader();
      fileReader.onload = (e) => {
        const { result } = e.target;
        if (result && !isCancel) {
          setFileDataURL(result)
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

  const fileBtn = useRef(null);

  return (
    <div style={{flexDirection: 'column'}}>
      {fileDataURL ? <img src={fileDataURL} alt={props.alt} style={{width: '128px', height: '128px'}} /> : null}
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