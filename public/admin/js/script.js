// Upload Image 
const uploadImage = document.querySelector("[upload-image]")
if(uploadImage){
  const uploadImageInput = document.querySelector("[upload-image-input]")
  const uploadImagePreview = document.querySelector("[upload-image-preview]")

  uploadImageInput.addEventListener("change",(e)=>{
    const file = e.target.files[0];
    // console.log(file)
    if(file){
      
      uploadImagePreview.src=URL.createObjectURL(file);
    }
  })
  const closePreview = document.querySelector("[close-preview]")
  if(closePreview){
    closePreview.addEventListener("click",(e)=>{
      uploadImageInput.value=""
      uploadImagePreview.src=""
    })
  }
}
// End upload image

// Upload Audio
const uploadAudio = document.querySelector("[upload-audio]")
if(uploadAudio){
  const uploadAudioInput = document.querySelector("[upload-audio-input]")
  const uploadAudioPlay = document.querySelector("[upload-audio-play]")
  const source = uploadAudio.querySelector("source")

  uploadAudioInput.addEventListener("change",(e)=>{
    
    // console.log(file)
    if(e.target.files.length){
      
      const audio = URL.createObjectURL(e.target.files[0]);
      source.src = audio
      uploadAudioPlay.load();
    }
  })
  
}
// End upload audio
