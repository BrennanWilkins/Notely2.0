export const isEmail = email => (
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)
);

export const isUsername = username => /^[A-Za-z0-9]+$/.test(username);

export const passIsValid = pass => /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[#$@!%&*?])[\w\d#$@!%&*?]{8,70}$/.test(pass);

export const validateSignup = (email, username, pass, confPass) => {
  if (!username.length) {
    return 'Please enter your username';
  }
  if (!email.length) {
    return 'Please enter your email.';
  }
  if (!isEmail(email)) {
    return 'Please enter a valid email.';
  }
  if (username.length > 50) {
    return 'Your username cannot be more than 50 characters.';
  }
  if (!isUsername(username)) {
    return 'Your username can only contain letters and numbers.';
  }
  if (!pass.length) {
    return 'Your password cannot be empty.';
  }
  if (pass.length < 8) {
    return 'Your password must be at least 8 characters.';
  }
  if (pass.length > 70) {
    return 'Your password cannot be over 70 characters.';
  }
  if (!passIsValid(pass)) {
    return 'Your password must contain at least one number, letter, and special character.';
  }
  if (pass !== confPass) {
    return 'Password and confirm password must be the same.';
  }
  return '';
};

export const validateLogin = (loginName, pass) => {
  if (!loginName.length) {
    return 'Please enter your username or email.';
  }
  if (!pass.length) {
    return 'Please enter your password.';
  }
  return '';
};

export const getTokenParam = search => {
  return new URLSearchParams(search).get('token');
};

export const validateResetPass = (pass, confPass, token) => {
  if (!pass.length) {
    return 'Your password cannot be empty.';
  }
  if (pass.length < 8) {
    return 'Your password must be at least 8 characters.';
  }
  if (pass.length > 70) {
    return 'Your password cannot be over 70 characters.';
  }
  if (!passIsValid(pass)) {
    return 'Your password must contain at least one number, letter, and special character.';
  }
  if (pass !== confPass) {
    return 'Password and confirm password must be the same.';
  }
  if (!token) {
    return 'Your recovery link is not valid.';
  }
  return '';
};

export const validateChangePass = (oldPass, newPass, confPass) => {
  if (!oldPass.length) {
    return 'Please enter your old password.';
  }
  if (newPass.length < 8) {
    return 'Your new password must be at least 8 characters.';
  }
  if (newPass.length > 70) {
    return 'Your new password cannot be over 70 characters.';
  }
  if (!passIsValid(newPass)) {
    return 'Your new password must contain at least one number, letter, and special character.';
  }
  if (newPass === oldPass) {
    return 'Your new password cannot be the same as your old password.';
  }
  if (newPass !== confPass) {
    return 'Your new password and confirm password must be the same.';
  }
  return '';
};
