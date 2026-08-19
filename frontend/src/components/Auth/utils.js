export const getPasswordHelperText = (isLogin) => {
  if (isLogin) return null;
  return 'Must contain uppercase, lowercase, number, and special character.';
};

export const getNewPasswordHelperText = () => {
  return 'Must contain uppercase, lowercase, number, and special character (min 8 chars).';
};
