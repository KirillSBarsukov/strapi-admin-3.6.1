'use strict';

const { yup, formatYupErrors } = require('strapi-utils');
const validators = require('./common-validators');

const handleReject = error => Promise.reject(formatYupErrors(error));

const userCreationSchema = yup
  .object()
  .shape({
    email: validators.email.nullable(),
    firstname: validators.firstname.nullable(),
    lastname: validators.lastname.nullable(),
    username: validators.username.nullable(),
    password: validators.password.notNull(),
    roles: validators.roles.min(1),
    vendorId: yup.string().notNull(),
    isActive: yup.bool().nullable(),
    preferedLanguage: yup.string().nullable(),
  })
  .noUnknown();

const validateUserCreationInput = data => {
  return userCreationSchema.validate(data, { strict: true, abortEarly: false }).catch(handleReject);
};

const profileUpdateSchema = yup
  .object()
  .shape({
    email: validators.email.notNull(),
    firstname: validators.firstname.notNull(),
    lastname: validators.lastname.notNull(),
    username: validators.username.nullable(),
    password: validators.password.notNull(),
    preferedLanguage: yup.string().nullable(),
  })
  .noUnknown();

const validateProfileUpdateInput = data => {
  return profileUpdateSchema
    .validate(data, { strict: true, abortEarly: false })
    .catch(handleReject);
};

const userUpdateSchema = yup
  .object()
  .shape({
    email: validators.email.notNull(),
    firstname: validators.firstname.notNull(),
    lastname: validators.lastname.notNull(),
    username: validators.username.nullable(),
    password: validators.password.notNull(),
    isActive: yup.bool().notNull(),
    roles: validators.roles.min(1).notNull(),
  })
  .noUnknown();

const validateUserUpdateInput = data => {
  return userUpdateSchema.validate(data, { strict: true, abortEarly: false }).catch(handleReject);
};

const usersDeleteSchema = yup
  .object()
  .shape({
    ids: yup
      .array()
      .of(yup.strapiID())
      .min(1)
      .required(),
  })
  .noUnknown();

const validateUsersDeleteInput = async data => {
  return usersDeleteSchema.validate(data, { strict: true, abortEarly: false }).catch(handleReject);
};

module.exports = {
  validateUserCreationInput,
  validateProfileUpdateInput,
  validateUserUpdateInput,
  validateUsersDeleteInput,

  schemas: {
    userCreationSchema,
    usersDeleteSchema,
    userUpdateSchema,
  },
};
