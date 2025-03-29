import Joi, { ObjectSchema } from "joi";

export const userSchema: ObjectSchema = Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
        "string.empty": "Name cannot be empty",
        "string.min": "Name must be at least 2 characters",
        "string.max": "Name cannot exceed 100 characters",
        "any.required": "Name is required",
    }),
    email: Joi.string().email().required().messages({   
        "any.required": "Email is required",
        "string.email": "Must be a valid email",
        "string.empty": "Email cannot be empty",
    }),
    password: Joi.string().min(6).max(100).required().messages({
        "string.empty": "Password cannot be empty",
        "string.min": "Password must be at least 6 characters",
        "string.max": "Password cannot exceed 100 characters",
        "any.required": "Password is required",
    }),
    
    created_at: Joi.date(),
    updated_at: Joi.date(),
});
