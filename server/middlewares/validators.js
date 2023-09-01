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

// for Job
const jobInputValidator = [
  ...myRequestHeaders,
  check('company', 'Please enter a Company with atleast 2 characters')
    .not()
    .isEmpty()
    .isLength({ min: 2 }),
  check('job_title', 'Please enter a Job Title with atleast 5 characters')
    .not()
    .isEmpty()
    .isLength({ min: 5 }),
  check('location', 'Please enter a Location with atleast 5 characters')
    .not()
    .isEmpty()
    .isLength({ min: 5 })
];

const boardInputValidator = [
  ...myRequestHeaders,
  check('title', 'Please enter a Board Title with atleast 4 characters')
    .not()
    .isEmpty()
    .isLength({ min: 4 })
];

const addColumnInputValidator = [
  ...myRequestHeaders,
  check(
    'columnStatus',
    'Please enter a Column Status Name with atleast 3 characters'
  )
    .not()
    .isEmpty()
    .isLength({ min: 3 })
];

const noteInputValidator = [
  ...myRequestHeaders,
  check('text', 'Note is too short').not().isEmpty().isLength({ min: 13 })
];

const taskInputValidator = [
  ...myRequestHeaders,
  check('title', 'Please enter atleast 4 characters for title')
    .not()
    .isEmpty()
    .isLength({ min: 4 }),
  check('category', 'Please choose a category').not().isEmpty(),
  check('start_date', 'Please choose a date').not().isEmpty(),
  check('title', 'Please enter atleast 5 characters for note')
    .not()
    .isEmpty()
    .isLength({ min: 5 })
];
// @TODO:
// 1. Validate JobInfo (job update) in SelectedJobModal.JobInfo
// 3. Tasks: update
// 4. Interview: Create and Update

// export const myRequestHeaders1 = [
//   header('authorization')
//     .exists({ checkFalsy: true })
//     .withMessage('Missing Authorization Header') // you can specify the message to show if a validation has failed
//     .bail() // not necessary, but it stops execution if previous validation failed
//     //you can chain different validation rules
//     .contains('Bearer')
//     .withMessage('Authorization Token is not Bearer')
// ];

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
  myRequestHeaders,
  validateRequest,
  jobInputValidator,
  boardInputValidator,
  addColumnInputValidator,
  noteInputValidator,
  taskInputValidator
};
