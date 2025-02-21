export const phoneNumberMask = (value: string) => {
  const cleanedValue = value.replace(/\D/g, '');

  if (!cleanedValue) return '';

  let formattedValue = '(' + cleanedValue.substring(0, 2);

  if (cleanedValue.length > 2) {
    formattedValue += ') ' + cleanedValue.substring(2, 7);
  }

  if (cleanedValue.length > 7) {
    formattedValue += '-' + cleanedValue.substring(7, 11);
  }

  return formattedValue;
};

export const nameMask = (value: string) => {
  return value.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
};

export const cpfMask = (value: string) => {
  const cleanedValue = value.replace(/\D/g, '');

  if (!cleanedValue) return '';

  let formattedValue = cleanedValue;

  if (cleanedValue.length > 3) {
    formattedValue = cleanedValue.slice(0, 3) + '.' + cleanedValue.slice(3);
  }
  if (cleanedValue.length > 6) {
    formattedValue = formattedValue.slice(0, 7) + '.' + formattedValue.slice(7);
  }
  if (cleanedValue.length > 9) {
    formattedValue =
      formattedValue.slice(0, 11) + '-' + formattedValue.slice(11, 13);
  }

  return formattedValue;
};

export const dateMask = (value: string) => {
  const cleanedValue = value.replace(/\D/g, '');

  if (!cleanedValue) return '';

  let formattedValue = cleanedValue;

  if (cleanedValue.length > 2) {
    formattedValue = cleanedValue.slice(0, 2) + '/' + cleanedValue.slice(2);
  }
  if (cleanedValue.length > 4) {
    formattedValue =
      formattedValue.slice(0, 5) + '/' + formattedValue.slice(5, 9);
  }

  return formattedValue;
};

export const postalCodeMask = (value: string) => {
  const cleanedValue = value.replace(/\D/g, '');

  if (!cleanedValue) return '';

  if (cleanedValue.length > 5) {
    return cleanedValue.slice(0, 5) + '-' + cleanedValue.slice(5, 8);
  }

  return cleanedValue;
};

export const raMask = (value: string) => {
  const cleanedValue = value.replace(/\D/g, '');
  return cleanedValue.slice(0, 7);
};

export const emailMask = (value: string) => {
  return value.toLowerCase();
};
