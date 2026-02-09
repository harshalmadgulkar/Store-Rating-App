import { body } from 'express-validator';

export const validateUser = [
    body('name').trim().isLength({ min: 20, max: 60 }).withMessage('Name must be 20-60 characters'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 8, max: 16 }).matches(/^(?=.*[A-Z])(?=.*[!@#$&*]).*$/).withMessage('Password must be 8-16 chars with uppercase and special char'),
    body('address').optional().isLength({ max: 400 }).withMessage('Address max 400 chars'),
];

// Use in routes: router.post('/signup', validateUser, signup);