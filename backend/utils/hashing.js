
import { hash } from 'bcryptjs';

const doHash = (value, saltValue) => {
    const result = hash(value, saltValue)
    return result;
}

export default doHash;