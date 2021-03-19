export const isEmail = email => (
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)
);

export const validateSignup = (email, pass, confPass) => {
  if (!email.length) {
    return 'Please enter your email.';
  }
  if (!pass.length) {
    return 'Your password cannot be empty.';
  }
  if (!isEmail(email)) {
    return 'Please enter a valid email.';
  }
  if (pass.length < 8) {
    return 'Your password must be at least 8 characters.';
  }
  if (pass.length > 100) {
    return 'Your password cannot be over 100 characters.';
  }
  if (!/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[#$@!%&*?])[\w\d#$@!%&*?]{8,100}$/.test(pass)) {
    return 'Your password must contain at least one number, letter, and special character.';
  }
  if (pass !== confPass) {
    return 'Password and confirm password must be the same.';
  }
  return '';
};

export const validateLogin = (email, pass) => {
  if (!email.length) {
    return 'Please enter your email.';
  }
  if (!pass.length) {
    return 'Please enter your password.';
  }
  return '';
};
