// imageUpload.js
import ImageKit from "imagekit";
import multer from "multer";

const imagekit = new ImageKit({
  publicKey: "public_CjgzM0q1BFn6o5gOVSxw3CJFke4=",
  privateKey: "private_EQhKcvatje0axi3xWLpoXL6s2+0=",
  urlEndpoint: "https://ik.imagekit.io/cun839umq",
});

const storage = multer.memoryStorage();

const allowedFormats = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "audio/mp3",
  "video/mp4",
];

const fileFilter = (req, file, cb) => {
  if (allowedFormats.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file format"), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter,
});

const fileUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      return next();
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

export { fileUpload };
export default upload;
