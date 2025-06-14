import RNFS from 'react-native-fs';

const getUniqueFileName = async (basePath, baseName, extension) => {
  if (typeof basePath !== 'string' || basePath.trim() === '') {
    throw new Error('Invalid basePath. It must be a non-empty string.');
  };

  if (typeof baseName !== 'string' || baseName.trim() === '') {
    throw new Error('Invalid baseName. It must be a non-empty string.');
  };

  if (typeof extension !== 'string' || extension.trim() === '') {
    throw new Error('Invalid extension. It must be a non-empty string.');
  };

  let fileName = `${baseName}.${extension}`;
  let counter = 1;

  try {
    while (await RNFS.exists(`${basePath}/${fileName}`)) {
      fileName = `${baseName}-${counter}.${extension}`;
      counter++;
    };
  } catch (error) {
    throw new Error(`Error while checking file existence: ${error.message}`);
  };

  return fileName;
};

export default getUniqueFileName;
