export default function(arr, typeName) {
  if (!Array.isArray(arr)) {
    throw new Error('arr needs to be an array');
  }

  if (typeof typeName !== 'string') {
    throw new Error('typeName needs to be string');
  }

  for (var i = 0; i < arr.length; i++) {
    if (arr[i].typeName === typeName) {
      return i;
    }
  }

  return -1;
}
