const fs = require("fs-extra")

const listFolderCopy = [
  {
    sourceDirectory: "views",
    destinationDirectory: "dist/views"
  },
  {
    sourceDirectory: "public",
    destinationDirectory: "dist/public"
  }
]

listFolderCopy.forEach(item =>{
  fs.copy(item.sourceDirectory, item.destinationDirectory, (err)=>{
    if(err){
      console.error(`Copy ${item.sourceDirectory} to ${item.destinationDirectory} failed`)
    }
    else{
      console.log(`Copy ${item.sourceDirectory} to ${item.destinationDirectory} success `)
    }
  })
})