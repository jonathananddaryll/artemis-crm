const { header, validationResult, check } = require('express-validator');

// MAKE SURE TO MODULARIZE THIS LATER ON WITH HEADER and then wahtever the input validator that we need
const myRequestHeaders = [
  header('authorization')
    .exists({ checkFalsy: true })
    .withMessage('Missing Authorization Header')
    .bail()
    .contains('Bearer')
    .withMessage('Authorization Token is not Bearer')
];

// for Job
const jobInputValidator = [
  ...myRequestHeaders,
  check('company', 'Please enter a Company with atleast 2 characters')
    .not()
    .isEmpty()
    .trim()
    .isLength({ min: 2 }),
  check('job_title', 'Please enter a Job Title with atleast 5 characters')
    .not()
    .isEmpty()
    .trim()
    .isLength({ min: 5 }),
  check('location', 'Please enter a Location with atleast 2 characters')
    .not()
    .isEmpty()
    .trim()
    .isLength({ min: 2 })
];

const boardInputValidator = [
  ...myRequestHeaders,
  check('title', 'Please enter a Board Title with atleast 4 characters')
    .not()
    .isEmpty()
    .trim()
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
    .trim()
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
    .trim()
    .isLength({ min: 5 })
];

const updateContactValidator = [
  ...myRequestHeaders,
  check('first_name', 'First name: Please enter at least one letter')
    .optional()
    .isLength({ min: 1 }),
  check('last_name', 'Last name: Please enter at least one letter')
    .optional()
    .isLength({ min: 1 }),
  check('company', 'Company: Please use letters or numbers only, "-" allowed')
    .optional()
    .isAlphanumeric('en-US', {'ignore': ' -'})
    .isLength({ min: 1 }),
  check('current_job_title', 'Current Job Title: Please use letters or numbers only, "-" allowed')
    .optional()
    .isAlphanumeric('en-US', {'ignore': ' -'})
    .isLength({ min: 1 }),
  check('city', 'Location: Please use letters or numbers only, "-" allowed')
    .optional()
    .isAlphanumeric('en-US', {'ignore': ' ,-'})
    .isLength({ min: 1 }),
  check('is_priority', 'Make a priority: This is only designed for true/false values')
    .optional()
    .isBoolean(),
  check('phone', 'Phone number: Please use numbers, ( ) - + characters only')
    .optional()
    .not()
    .isAlpha(),
  check('email', 'Email: Please enter a valid address')
    .optional({ nullable: true, checkFalsy: true })
    .isEmail(),
  check('linkedin', 'LinkedIn: Please enter a valid URL')
    .optional({ nullable: true, checkFalsy: true })
    .isURL(),
  check('twitter', 'Twitter: Please enter a valid URL')
    .optional({ nullable: true, checkFalsy: true })
    .isURL(),
  check('instagram', 'Instagram: Please enter a valid URL')
    .optional({ nullable: true, checkFalsy: true })
    .isURL(),
  check('other_social', 'Other social: Please enter a valid URL')
    .optional({ nullable: true, checkFalsy: true })
    .isURL(),
  check('personal_site', 'Personal site: Please enter a valid URL')
    .optional({ nullable: true, checkFalsy: true })
    .isURL(),
  check('linked_job_opening', 'Linked Job: Please provide a valid job ID number')
    .optional({ nullable: true, checkFalsy: true })
    .isNumeric()
];

const newContactValidator = [
  ...myRequestHeaders,
  check('first_name', 'Please enter at least one letter for the first name')
    .not()
    .isEmpty()
    .isLength({ min: 1 }),
  check('last_name', 'Please enter at least one letter for the last name')
    .not()
    .isEmpty()
    .isLength({ min: 1 }),
  check('company', 'Please use letters or numbers only')
    .optional({ nullable: true, checkFalsy: true })
    .isAlphanumeric()
    .isLength(),
  check('current_job_title', 'Please use letters or numbers only')
    .optional({ nullable: true, checkFalsy: true })
    .isAlphanumeric()
    .isLength(),
  check('city', 'Please use letters or numbers only')
    .optional({ nullable: true, checkFalsy: true })
    .isAlphanumeric()
    .isLength(),
  check('is_priority', 'This is only designed for true/false values')
    .optional({ nullable: true, checkFalsy: true })
    .isBoolean(),
  check('phone', 'Please use numbers and ( ) - + characters only')
    .optional({ nullable: true, checkFalsy: true })
    .escape()
    .not()
    .isAlpha(),
  // .isLength({ min: 10, max: 10 })
  // .withMessage('Phone number is a 10 digits'),
  check('email', 'Please enter a valid email address')
    .optional({ nullable: true, checkFalsy: true })
    .isEmail(),
  check('linkedin', 'Please enter a valid URL')
    .optional({ nullable: true, checkFalsy: true })
    .isURL(),
  check('twitter', 'Please enter a valid URL')
    .optional({ nullable: true, checkFalsy: true })
    .isURL(),
  check('instagram', 'Please enter a valid URL')
    .optional({ nullable: true, checkFalsy: true })
    .isURL(),
  check('other_social', 'Please enter a valid URL')
    .optional({ nullable: true, checkFalsy: true })
    .isURL(),
  check('personal_site', 'Please enter a valid URL')
    .optional({ nullable: true, checkFalsy: true })
    .isURL(),
  check('linked_job_opening', 'Please provide a valid job ID number')
    .optional({ nullable: true, checkFalsy: true })
    .isNumeric()
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
  myRequestHeaders,
  validateRequest,
  jobInputValidator,
  boardInputValidator,
  addColumnInputValidator,
  noteInputValidator,
  taskInputValidator,
  newContactValidator,
  updateContactValidator
};
