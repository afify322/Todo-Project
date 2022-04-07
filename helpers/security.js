
const helmet=require('helmet');
exports.security=
helmet.contentSecurityPolicy({
  directives: {
    ...helmet.contentSecurityPolicy.getDefaultDirectives(),
    'img-src': ["'self'", 'https://res.cloudinary.com','*.my-2dos.herokuapp.com','https://lh3.googleusercontent.com'],
    'default-src':["'self'",'*.cloudinary.com','*.my-2dos.herokuapp.com','https://.lh3.googleusercontent.com'],
    'connect-src':["'self'",'*.cloudinary.com','https://my-2dos.herokuapp.com','*.lh3.googleusercontent.com']
  }
})



/* exports.security=
helmet.contentSecurityPolicy({
  directives: {
    ...helmet.contentSecurityPolicy.getDefaultDirectives(),
    'img-src': ["'self'"],
    'default-src':["'self'"],
    'connect-src':["'self'"]
  }
}) */