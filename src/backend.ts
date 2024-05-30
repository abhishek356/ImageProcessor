let  path =require('path');
let cors = require('cors')
let express  =require('express')
let multer = require ('multer')
let morgan =  require('morgan')
let app = express();
<<<<<<< HEAD
let fs = require('fs')
=======
>>>>>>> origin/master
import {processImage} from './processFile'

//app.use(express.static(__dirname, 'public'));

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

//app.use(express.static(__dirname, 'public'));

let port:number = 5500

let storage  = multer.diskStorage({
    destination:function(req,file,callback)
{
    callback(null,'uploads')
},
filename: function (req, file, callback) {
    callback(null, Date.now()+ path.extname(file.originalname));

}})

const upload = multer({storage:storage})


app.post('/',upload.single('file'),async (req,res)=>{

    console.log(req.body)
     
    let output = await processImage();
    console.log(`the final outcome`,output)

    if(output)
        {
          return  res.json({message : 'failure'});
        }

        else{
            fs.readdir('ProcessedPhoto',(err:Error,files:File[])=>{
                if(err)
                    {
                        return res.json({message:'Error ocurred while compressing file'})
                    }

                   
                            res.sendFile(path.resolve(__dirname, 'ProcessedPhoto', files[0]));

                      
              

                })
        //    return res.status(200).send({message: 'success'})
        }

    // console.log(`Trying to pring the incoming image in the body`,req.body)
    
    // console.log(`this is the home url`)

    // res.json({message:"this is the main body"});


})

// app.get('/testing',(req: Request,res:Response)=>{
// console.log(`Inside testing`)
// res.status(200).json('hello')
// })


app.listen(port,()=>{
    console.log(`The server is running on port 5500`)
})


