// //<reference types="node" />
// //<reference types="sharp" />



import * as fs from 'fs'
import * as sharp from 'sharp'
//const sharp = require  ('sharp');


 const upperLimit:number = 1024*100;

// let  getMetadata = async(inputFile:string[])=>{

//     try{
//         console.log(`input file received inside getMetadata and the file name is ${inputFile}`)
//         const metadata =  await sharp(`../public/${inputFile[0]}`).
//         toFormat("jpeg",{mozjpeg:true}).toFile(`../public/${inputFile[0]}`,(err:Error,info:string)=>{

//             if(err)
//             {
//                 console.log(`error occured while changing file format`,err);
//             }
//             else{
//                 console.log(`the file has been converted successfully`,info)
//             }

//         });
//         if((metadata.size%1024)>=100)
//         {
//             console.log(`size is more that threshold, hence trying to delete the preexisting file.`)

//             fs.unlinkSync(`../public/${inputFile[0]}`)
//             console.log(`size is more that threshold, hence trying to delete the preexisting file. and calling getMetadata again`)
//            return getMetadata(metadata)
//         }
//         else{
//             console.log(`the value of the metadata file is`,metadata)

//             return  
//         }
//     }
//     catch(error)
//     {
//         console.log(`error occured while reading metadata - ${error}`)
//     }
  
// }

let inputFile:string[]=[]

let readingOperation=()=>{


    fs.readdir('../public',(err,files)=>{

        console.log(files)
    
                if(err)
    
                {
                    console.log(`error occured while reading file`,err)
                }
                files.forEach(file=>{
                    console.log(`reading  the file from the public folder`)
                    inputFile.push(file)
                })
                    // getMetadata(inputFile)
                })

}

// readingOperation();

let inputImagePath = `../public/${inputFile[0]}.jpeg`
let outputImagePath = '../public/output.jpg'



sharp(inputImagePath).toBuffer().then((buffer:Buffer)=>{
    const imageSize:number =  buffer.length;
    let image:sharp.Sharp = sharp(buffer);

    if(imageSize <= upperLimit)
    {
        return image.toFile('../public/');
    }
    else{
        const quality = Math.max(1,Math.floor((upperLimit/imageSize)*100));

        const outputFormat : string  = inputImagePath.toLowerCase().endsWith('/png') ? 'png':'jpeg'

        if(outputFormat == 'jpeg')
        {
        image = image['jpeg']({quality:quality});
    }
    else{
        image = image['png']({quality:quality})
    }

    return image.toBuffer().then(((compressedBuffer:Buffer)=>{
        if(compressedBuffer.length <= upperLimit)
        {
            return  fs.promises.writeFile('outputImagepath',compressedBuffer)
        }
        else{

            return adjustQuality(image, compressedBuffer,upperLimit,outputImagePath)
        }
    }))
    }
}).then((res:Response)=>{
    console.log(`image compressed successfully`,res)
}).catch((err:Error)=>{
    console.log(`error occured while compressing`,err)
})
   

function adjustQuality(image:sharp.Sharp, buffer:Buffer, upperLimit:number, outputPath:string) :Promise<void>{

    
    const currentQuality: number = image.options.quality || 80; // default quality
    const newQuality: number = Math.max(1, Math.floor((upperLimit / buffer.length) * currentQuality));
  
    return image.jpeg({ quality: newQuality })
      .toBuffer()
      .then((newBuffer: Buffer) => {
        if (newBuffer.length <= upperLimit) {
          // If the new compressed image size meets the lower limit, save the image
          return fs.promises.writeFile(outputPath, newBuffer);
        } else {
          // If the new compressed image size is still above the lower limit, recursively adjust quality
          return adjustQuality(image, newBuffer, upperLimit, outputPath);
        }
      });
  }

  (
    ()=>{
        readingOperation();
    }
  )();