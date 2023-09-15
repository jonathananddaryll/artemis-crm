const { header, validationResult, check } = require('express-validator');

// MAKE SURE TO MODULARIZE THIS LATER ON WITH HEADER and then wahtever the input validator that we need
const myRequestHeaders = [
  header('authorization')
    .exists({ checkFalsy: true })
    .withMessage('Missing Authorization Header') // you can specify the message to show if a validation has failed
    .bail() // not necessary, but it stops execution if previous validation failed
    //you can chain different validation rules
    .contains('Bearer')
    .withMessage('Authorization Token is not Bearer')
];

// const myRequestHeadersWithChecks= [
//   header('authorization')
//     .exists({ checkFalsy: true })
//     .withMessage('Missing Authorization Header') // you can specify the message to show if a validation has failed
//     .bail() // not necessary, but it stops execution if previous validation failed
//     //you can chain different validation rules
//     .contains('Bearer')
//     .withMessage('Authorization Token is not Bearer'),
//   check('title', 'Title of the board is required').not().isEmpty()
// ];

// export const myRequestHeaders1 = [
//   header('authorization')
//     .exists({ checkFalsy: true })
//     .withMessage('Missing Authorization Header') // you can specify the message to show if a validation has failed
//     .bail() // not necessary, but it stops execution if previous validation failed
//     //you can chain different validation rules
//     .contains('Bearer')
//     .withMessage('Authorization Token is not Bearer')
// ];


const contactInputValidator = [
  ...myRequestHeaders,
  check('first_name', 'Please enter at least one letter for the first name')
    .not()
    .isEmpty()
    .isLength({ min: 1 })
    .escape(),
  check('last_name', 'Please enter at least one letter for the last name')
    .not()
    .isEmpty()
    .isLength({ min: 1 }),
  check('company', 'Please use letters or numbers only')
    .optional()
    .isAlphanumeric()
    .isLength({ min: 1 }),
  check('current_job_title', 'Please use letters or numbers only')
    .optional()
    .isAlphanumeric()
    .isLength({ min: 1 }),
  check('city', 'Please use letters or numbers only')
    .optional()
    .isAlphanumeric()
    .isLength({ min: 1 }),
  check('is_priority', 'This is only designed for true/false values')
    .optional()
    .isBoolean(),
  check('phone', 'Please use numbers and ( ) - + characters only')
    .optional()
    .escape()
    .not()
    .isAlpha(),
  check('email', 'Please enter a valid email address')
    .optional()
    .isEmail(),
  check('linkedin', 'Please enter a valid URL')
    .optional()
    .isURL(),
  check('twitter', 'Please enter a valid URL')
    .optional()
    .isURL(),
  check('instagram', 'Please enter a valid URL')
    .optional()
    .isURL(),
  check('other_social', 'Please enter a valid URL')
    .optional()
    .isURL(),
  check('personal_site', 'Please enter a valid URL')
    .optional()
    .isURL(),
  check('linked_job_opening', 'Please provide a valid job ID number')
    .optional()
    .isNumeric(),
];

function validateRequest(req, res, next) {
  const validationErrors = validationResult(req);
  const errorMessages = [];

  for (const e of validationErrors.array()) {
    errorMessages.push(e.msg);
  }

  if (!validationErrors.isEmpty()) {
    return res.status(403).json({ errors: errorMessages });
  }
  next();
}

module.exports = {
  myRequestHeaders: myRequestHeaders,
  validateRequest: validateRequest
};
