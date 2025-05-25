
import { hash, compare } from 'bcryptjs';

export const doHash = (value, saltValue) => {
    const result = hash(value, saltValue)
    return result;
}

export const doHashValidation = (value, hasheValue) => {
    const result = compare(value, hasheValue);
    return result;
}

