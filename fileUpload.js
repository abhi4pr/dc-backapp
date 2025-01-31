const firebaseAdmin = require('firebase-admin');
const multer = require('multer');

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.applicationDefault(),
    storageBucket: "your-bucket-name.appspot.com",
});

const bucket = firebaseAdmin.storage().bucket();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const fileUpload = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }

        const fileName = `${Date.now()}-${req.file.originalname}`;
        const firebaseFile = bucket.file(fileName);

        await firebaseFile.save(req.file.buffer, {
            contentType: req.file.mimetype,
            public: true,
        });

        req.fileUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        next();
    } catch (error) {
        console.error('Failed to upload image to Firebase Storage:', error);
        return res.status(500).send('Failed to upload image');
    }
};

module.exports = { upload, fileUpload };