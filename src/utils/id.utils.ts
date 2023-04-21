import { nanoid } from 'nanoid';

export const genId = () => nanoid().replace(/-|_/g, '');
