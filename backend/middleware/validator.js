import joi from 'joi';

export const userSchema = joi.object({
    username: joi.string().min(3).max(50).required(),
    email: joi.string().email({ tlds: { allow: ['com', 'net'] }, }).required(),
    password: joi.string().min(5).max(15).required().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{5,15}$')),
    role: joi.string().valid('user', 'admin', 'nutritionist').default('user'),
});

export const signinSchema = joi.object({

    email: joi.string().email({ tlds: { allow: ['com', 'net'] }, }).required(),
    password: joi.string().min(5).max(15).required().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{5,15}$')),

});


