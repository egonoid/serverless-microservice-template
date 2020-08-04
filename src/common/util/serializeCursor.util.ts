export const serializeCursor = (cursor: string): string => {
  return Buffer.from(cursor.split('\\').join()).toString('base64');
};
