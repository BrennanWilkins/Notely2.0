const isObject = o => {
  return Object.prototype.toString.call(o) === '[object Object]';
};

const isPlainObject = o => {
  if (isObject(o) === false) { return false; }

  let constr = o.constructor;
  if (constr === undefined) { return true; }

  let proto = constr.prototype;
  if (isObject(proto) === false) { return false; }

  if (proto.hasOwnProperty('isPrototypeOf') === false) {
    return false;
  }

  return true;
};

const isText = value => {
  return isPlainObject(value) && typeof value.text === 'string';
};

module.exports = isText;
