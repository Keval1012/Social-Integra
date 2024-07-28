import jwt from 'jsonwebtoken';
import { expressjwt } from 'express-jwt';
// import Role from './models/Role.js';
import fs from 'fs';
import request from 'request';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import pdf from 'pdf-creator-node';
// import AccessPermission from './models/accessPermission.js';

export const createAdminJwtToken = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.ADMIN_TOKEN_EXPIRY_TIME });
  return token;
};

export const createAccessToken = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY_TIME });
  return token;
};

export const createRefreshToken = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY_TIME });
  return token;
};

export const verifyJwtToken = (req, res, next) => {
  try {
    const { userId } = jwt.verify(req.headers?.token, process.env.JWT_SECRET);
    next();
    // return;
  } catch (err) {
    // next(err);
    return res.status(401).send({ success: false, isAuth: false, message: 'TOKEN_VALIDATION_FAILED', error: err });
  }
};

export const authorize = (roles = [], permission = '') => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  const secret = process.env.JWT_SECRET;

  return [
    // authenticate JWT token and attach user to request object (req.user)
    expressjwt({
      secret: 'MARKETINGAUTOMATIONSECRETKEY',
      algorithms: ['HS256'],
      credentialsRequired: false,
      getToken: function fromHeaderOrQuerystring(req) {
        if (req.headers.token) {
          return req.headers.token;
        } else if (req.query && req.query.token) {
          return req.query.token;
        }
        return null;
      }
    }),

    // expressjwt({ secret, algorithms: ['HS256'] }),
    // authorize based on user role
    async (req, res, next) => {
      if (roles.length && !roles.includes(req.auth.role)) {
        // user's role is not authorized
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      if (permission) {
        let role = req.auth.role;

        // const findRole = await Role.findOne({ name: role });

      } else {
        // authentication and authorization successful
        next();
      }
    }
  ];
};

export const fileToBlobUrl = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const blob = new Blob([reader.result], { type: file.type });
      const blobUrl = URL.createObjectURL(blob);
      resolve({ blobUrl, blob });
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsArrayBuffer(file);
  });
};

export const downloadImage = (uri, filename, callback) => {
  request.head(uri, function (err, res, body) {
    request(uri).pipe(fs.createWriteStream(filename)).on("close", callback);
  });
};

// export const downloadPDF = async (data, htmlFile) => {
//   const __dirname = path.dirname(fileURLToPath(import.meta.url));

//   const html = fs.readFileSync(path.join(__dirname, `./templates/${htmlFile}.html`), 'utf-8');
//   const filename = Math.random() + '_doc' + '.pdf';
//   let array = [];

//   data?.items.forEach((d, i) => {
//     const prod = {
//       no: i + 1,
//       description: d?.description,
//       quantity: d.quantity,
//       quantity: d.hours,
//       materialAmount: d.materialAmount,
//       laborAmount: d.laborAmount,
//     }
//     array.push(prod);
//   });

//   const obj = {
//     prodlist: array,
//     ...data
//   }
//   const document = {
//     html: html,
//     data: {
//       products: obj
//     },
//     path: './docs/' + filename
//   }

//   await pdf.create(document, options);

//   return filename;

// };
