'use strict';

const crypto = require("crypto");
const {createManually, update} = require('./../../controllers/user');

module.exports = strapi => ({
  async initialize() {
    const passportMiddleware = strapi.admin.services.passport.init();

    strapi.app.use(passportMiddleware);

    strapi.app.use(async (ctx, next) => {
      if (
        ctx.request.header.authorization &&
        ctx.request.header.authorization.split(' ')[0] === 'Bearer'
      ) {
        const token = ctx.request.header.authorization.split(' ')[1];
        const { payload, isValid } = await strapi.admin.services.token.decodeJwtToken(token);
        if (isValid) {
          //console.log("isValid", isValid)
          // request is made by an admin
          let admin = await strapi.query('user', 'admin').findOne({ email: payload.email }, ['roles']);
          // console.log("admin", admin)
          // create
          if(admin === null){
            try {
              const role = await strapi.admin.services.role.findOne({ name:  payload.role });
              const hashedPassword = await strapi.admin.services.auth.hashPassword(crypto.randomBytes(9).toString('hex'));
              admin = await  createManually(
                {email:  payload.email,
                  firstname: payload.firstName,
                  lastname: payload.lastName,
                  username: payload.subject,
                  vendorId: payload.vendorId,
                  password: await hashedPassword,
                  isActive: true,
                  roles: [role.id]}
              );
            } catch (e){
              admin = await strapi.query('user', 'admin').findOne({ email: payload.email }, ['roles']);
            }
          }

          if (!admin || !(admin.isActive === true)) {
            return ctx.forbidden('Invalid credentials');
          }

          ctx.state.admin = admin;
          ctx.state.user = admin;
          ctx.state.userAbility = await strapi.admin.services.permission.engine.generateUserAbility(
            admin
          );
          ctx.state.isAuthenticatedAdmin = true;
          return next();
        }
      }

      return next();
    });
  },
});
