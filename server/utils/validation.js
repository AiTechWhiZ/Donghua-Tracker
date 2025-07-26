function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

function validatePassword(password) {
  return typeof password === "string" && password.length >= 6;
}

function validateUsername(username) {
  return (
    typeof username === "string" &&
    username.length >= 3 &&
    /^[a-zA-Z0-9_]+$/.test(username)
  );
}

module.exports = {
  validateEmail,
  validatePassword,
  validateUsername,
};
