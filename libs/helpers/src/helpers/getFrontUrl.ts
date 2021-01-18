import config from 'config';

const getFrontUrlForPath = (path = '') => {
  return `${config.FRONT_URL}${path}`;
};

export { getFrontUrlForPath };
