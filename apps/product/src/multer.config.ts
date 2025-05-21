
// Import the diskStorage function from the 'multer' package for configuring file storage settings
import { diskStorage } from 'multer';

// Import the extname function from the 'path' module to extract file extensions
import { extname } from 'path';

// Export a configuration object named 'multerConfig' to be used with Multer middleware
export const multerConfig = {

  // Define the storage settings using Multer's diskStorage method
  storage: diskStorage({


    // Set the destination folder where uploaded files will be saved
    destination: './src/product/prodimgs', // Image upload folder

    // Define how the uploaded file's name will be stored
    filename: (req, file, callback) => {


       // Create a unique suffix using the current timestamp and a random number
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname); // gets .jpg, .png, etc.

      // Generate the new filename in the format: fieldname-uniquesuffix.extension
      callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  }),
};