import { parsePhoneNumberFromString } from 'libphonenumber-js';

const transformPhoneNumber = (value) =>
  value && typeof value === 'string' && parsePhoneNumberFromString(value)
    ? parsePhoneNumberFromString(value).format('E.164')
    : value;

export { transformPhoneNumber };
