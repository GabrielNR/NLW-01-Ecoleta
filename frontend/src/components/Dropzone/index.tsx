//Imports
import React, {useCallback, useState} from 'react';
import { useDropzone } from 'react-dropzone';

import { FiUpload } from 'react-icons/fi'
import './styles.css'

//Interface
interface Props {
  onFileUploaded: (file: File) => void
}

//Aplicação
const DropZone: React.FC<Props> = ({ onFileUploaded }) => {
  //estado 
  const [selectedFileUrl, setSelectedFileUrl] = useState("");

  //Callback
  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    const fileurl = URL.createObjectURL(file);

    setSelectedFileUrl(fileurl);
    onFileUploaded(file)
  }, [onFileUploaded])

  const {getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
     },
  })

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} accept="image/*"/>
      {selectedFileUrl ? (
        <img src={selectedFileUrl} alt="Point thumbnail" />
      ) : (
        <p>
          <FiUpload />
          Imagem do estabelecimento
        </p>
      )}
    </div>
  )
}

export default DropZone