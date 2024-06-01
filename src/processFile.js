"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var processImage = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, fileCompressed = readFileOperation()];
    });
}); };
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
