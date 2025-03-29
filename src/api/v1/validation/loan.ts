import Joi, { ObjectSchema } from "joi";

export const userSchema: ObjectSchema = Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
        "string.empty": "Name cannot be empty",
        "string.min": "Name must be at least 2 characters",
        "string.max": "Name cannot exceed 100 characters",
        "any.required": "Name is required",
    }),
    description: Joi.string().email().required(),
    price: Joi.number().optional(),
    is_approved: Joi.boolean(),
    is_reviewed: Joi.boolean(),
    
    created_at: Joi.date(),
    updated_at: Joi.date(),
});
