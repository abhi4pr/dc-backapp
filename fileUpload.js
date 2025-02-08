const ImageKit = require("imagekit");
const multer = require('multer')

const imagekit = new ImageKit({
    publicKey: 'public_CjgzM0q1BFn6o5gOVSxw3CJFke4=',
    privateKey: 'private_EQhKcvatje0axi3xWLpoXL6s2+0=',
    urlEndpoint: 'https://ik.imagekit.io/cun839umq',
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const fileUpload = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).send("No file uploaded");
        }

        const fileBuffer = req.file.buffer;

        const result = await imagekit.upload({
            file: fileBuffer,
            fileName: `${Date.now()}-${req.file.originalname}`,
            folder: "/",
        });

        req.fileUrl = result.url;
        next();
    } catch (error) {
        console.error("Failed to upload image to ImageKit:", error);
        return res.status(500).send("Failed to upload image");
    }
};

module.exports = { upload, fileUpload };