"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processImage = void 0;
var sharp = require('sharp');
var fs = require('fs');
var upperLimit = 1024 * 100;
var inputFile = [];
var fileCompressed = false;
function readFileOperation() {
    var output = false;
    try {
        fs.readdir('./uploads', function (err, files) {
            if (err) {
                console.log("error occured while reading file");
                output = false;
            }
            console.log('The list of files is', files);
            inputFile = files;
            console.log("pushed in the  inputFile array is", inputFile);
            output = useSharp();
        });
    }
    catch (err) {
        console.log("Error occured  while reading  file  from the directory", err);
    }
    return output;
}
var processImage = function () {
    return fileCompressed = readFileOperation();
};
exports.processImage = processImage;
var useSharp = function () {
    var result = false;
    if (inputFile !== undefined || inputFile !== null) {
        console.log("List of files present in upload folder is ", inputFile);
        console.log("The length of the array is", inputFile.length - 1);
        sharp("./uploads/" + inputFile[inputFile.length - 1]).toBuffer().then(function (buffer) {
            var imageSize = buffer.length;
            var image = sharp(buffer);
            if (imageSize < upperLimit) {
                image.toFile("ProcessedPhoto/" + inputFile[inputFile.length - 1]);
            }
            else {
                var quality = Math.max(1, Math.floor((upperLimit / imageSize) * 100));
                var outputFormat = "./uploads/".concat(inputFile[inputFile.length - 1]).toLowerCase().
                    endsWith('.png') ? 'png' : 'jpeg';
                result = adjustQuality(image, quality, buffer, outputFormat);
                if (result) {
                    console.log("File  created in the output folder successfully !!");
                }
            }
        });
    }
    return result;
};
var adjustQuality = function (image, quality, buffer, outputFormat) {
    return (image[outputFormat]({ quality: quality })
        .toBuffer().then(function (newbuffer) {
        if (newbuffer.length < upperLimit) {
            image.toFile("ProcessedPhoto/".concat(inputFile[inputFile.length - 1]));
            return true;
        }
        else {
            var currentQuality = image.options.quality || 80;
            var newQuality = Math.max(1, Math.floor((upperLimit / newbuffer.length) * currentQuality));
            return adjustQuality(image, newQuality, newbuffer, outputFormat);
        }
    }).catch(function (err) { return console.log("Error occured while compressing image", err); }));
};
