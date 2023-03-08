const strongPassword = RegExp('((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,}))');
const mediumPassword = RegExp('((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.{8,}))|((?=.*[0-9])(?=.*[A-Z])(?=.{8,}))|((?=.*[a-z])(?=.*[0-9])(?=.{8,}))|((?=.*[a-z])(?=.{10,}))|((?=.*[A-Z])(?=.{10,}))|((?=.*[0-9])(?=.{10,}))');

export {strongPassword, mediumPassword}