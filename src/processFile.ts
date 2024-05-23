//import sharp from "sharp";
import { Stream } from "stream"
import { buffer } from "stream/consumers"

let sharp = require('sharp')

let fs = require('fs')

const upperLimit:number = 1024*100;

let inputFile:File[]=[];

let fileCompressed:boolean = false;

function  readFileOperation(): boolean {

    let output:boolean = false;

  try{
         
    fs.readdir('./uploads',(err:Error,files:File[])=>{

        

            if(err)
                {
                    console.log(`error occured while reading file`)
                    output = false
                }
                
                console.log('The list of files is', files)
                inputFile =files;
                console.log(`pushed in the  inputFile array is`,inputFile)
                 
               output =  useSharp();

        })
    }
    catch(err)
    {
        console.log(`Error occured  while reading  file  from the directory`,err)
    }
    return  output
}


export let processImage = ():boolean=>{

  return  fileCompressed =  readFileOperation();

}

let useSharp = () :boolean=>{

    let result:boolean = false;

    if(inputFile !== undefined || inputFile !== null)
        {

            console.log(`List of files present in upload folder is `,inputFile)
            console.log(`The length of the array is`,inputFile.length-1)

            sharp(`./uploads/`+inputFile[inputFile.length-1]).toBuffer().then((buffer:Buffer) =>{

                let imageSize:number =  buffer.length;
                let image:sharp.Sharp = sharp(buffer);
                
                if(imageSize<upperLimit)
                        {
            
                            image.toFile(`ProcessedPhoto/`+inputFile[inputFile.length-1])
            
                        }

                        else{

                            let quality  = Math.max(1,Math.floor((upperLimit/imageSize) * 100))

                            let outputFormat = `./uploads/${inputFile[inputFile.length-1]}`.toLowerCase().
                            endsWith('.png')?'png':'jpeg'

                            

                         result =   adjustQuality(image,quality,buffer,outputFormat);
                        if(result)
                            {
                                console.log(`File  created in the output folder successfully !!`)
                            }
                        }
            
               })

        }

        return result

}


let adjustQuality = (image:sharp.Sharp,quality:number,buffer:Buffer,outputFormat:string) =>{

        return (

            image[outputFormat]({quality:quality})
            .toBuffer().then((newbuffer:Buffer)=>{

                if(newbuffer.length<upperLimit)
                    {
                        image.toFile(`ProcessedPhoto/${inputFile[inputFile.length-1]}`)
                        return true;
                        
                    }
                  else{

                    let currentQuality = image.options.quality|| 80;
                    let newQuality = Math.max(1,Math.floor((upperLimit/newbuffer.length)*currentQuality));

                    return adjustQuality(image,newQuality,newbuffer,outputFormat)

                  }  

            }).catch(err=>console.log(`Error occured while compressing image`,err))
        )

}