export const deserializeCursor = (cursor: string): string => {
  return Buffer.from(cursor, 'base64').toString();
};
