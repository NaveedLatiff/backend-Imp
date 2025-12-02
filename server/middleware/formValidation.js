import { body, validationResult } from 'express-validator';

export const validationRegistration = [
    body('name')
        .notEmpty().withMessage("Name is required")
        .trim(),
    body('email')
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Please provide a valid email address")
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
];

export const validationLogin = [
    body('email')
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Please provide a valid email address")
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage("Password is required")
];