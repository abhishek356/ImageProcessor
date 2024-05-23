"use strict";
// //<reference types="node" />
// //<reference types="sharp" />
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const sharp = __importStar(require("sharp"));
//const sharp = require  ('sharp');
const upperLimit = 1024 * 100;
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
let inputFile = [];
let readingOperation = () => {
    fs.readdir('../public', (err, files) => {
        console.log(files);
        if (err) {
            console.log(`error occured while reading file`, err);
        }
        files.forEach(file => {
            console.log(`reading  the file from the public folder`);
            inputFile.push(file);
        });
        // getMetadata(inputFile)
    });
};
// readingOperation();
let inputImagePath = `../public/${inputFile[0]}.jpeg`;
let outputImagePath = '../public/output.jpg';
sharp(inputImagePath).toBuffer().then((buffer) => {
    const imageSize = buffer.length;
    let image = sharp(buffer);
    if (imageSize <= upperLimit) {
        return image.toFile('../public/');
    }
    else {
        const quality = Math.max(1, Math.floor((upperLimit / imageSize) * 100));
        const outputFormat = inputImagePath.toLowerCase().endsWith('/png') ? 'png' : 'jpeg';
        if (outputFormat == 'jpeg') {
            image = image['jpeg']({ quality: quality });
        }
        else {
            image = image['png']({ quality: quality });
        }
        return image.toBuffer().then(((compressedBuffer) => {
            if (compressedBuffer.length <= upperLimit) {
                return fs.promises.writeFile('outputImagepath', compressedBuffer);
            }
            else {
                return adjustQuality(image, compressedBuffer, upperLimit, outputImagePath);
            }
        }));
    }
}).then((res) => {
    console.log(`image compressed successfully`, res);
}).catch((err) => {
    console.log(`error occured while compressing`, err);
});
function adjustQuality(image, buffer, upperLimit, outputPath) {
    const currentQuality = image.options.quality || 80; // default quality
    const newQuality = Math.max(1, Math.floor((upperLimit / buffer.length) * currentQuality));
    return image.jpeg({ quality: newQuality })
        .toBuffer()
        .then((newBuffer) => {
        if (newBuffer.length <= upperLimit) {
            // If the new compressed image size meets the lower limit, save the image
            return fs.promises.writeFile(outputPath, newBuffer);
        }
        else {
            // If the new compressed image size is still above the lower limit, recursively adjust quality
            return adjustQuality(image, newBuffer, upperLimit, outputPath);
        }
    });
}
(() => {
    readingOperation();
})();
