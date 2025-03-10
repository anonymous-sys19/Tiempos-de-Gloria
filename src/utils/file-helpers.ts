import { ALLOWED_IMAGE_TYPES, ALLOWED_VIDEO_TYPES, MAX_FILE_SIZE } from '@/lib/constants';
export const validateFile = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
        return { isValid: false, message: 'El archivo excede el límite de 150MB' };
    }
    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);
    if (!isImage && !isVideo) {
        return { isValid: false, message: 'Formato de archivo no soportado' };
    }
    return { isValid: true, isVideo };
};
export const getInitials = (name: string): string => {
    return name
        .split(' ')
        .map((word: string) => word[0])
        .join('')
        .toUpperCase();
};