import { withStore } from 'justorm/react';

export default withStore({ user: [] })(function Register({ children, store }) {
  return children({
    title: 'Registration',
    titleLink: {
      text: 'Sign in',
      to: '/login',
    },
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: {
      email: { type: 'email' },
      password: { type: 'string', min: 6 },
      confirmPassword: {
        type: 'custom',
        messages: {
          mustMatch: 'Passwords must match',
        },
        check(value, schema, { password }) {
          return value !== password
            ? this.makeError('mustMatch', password, value)
            : true;
        },
      },
    },
    fields: [
      {
        name: 'email',
        label: 'Email',
      },
      {
        name: 'password',
        label: 'Password',
        type: 'password',
      },
      {
        name: 'confirmPassword',
        label: 'Confirm password',
        type: 'password',
      },
    ],
    submitText: 'Register',
    onSubmit: ({ email, password }) => store.user.register({ email, password }),
  });
});
