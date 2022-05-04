import { withStore } from 'justorm/react';

import { Link } from '@foreverido/uilib';

export default withStore({ user: [] })(function Login({ children, store }) {
  return children({
    title: 'Sign in',
    titleLink: {
      text: 'Registration',
      to: '/register',
    },
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: {
      email: { type: 'email' },
      password: { type: 'string', min: 6 },
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
    ],
    footerContent: <Link href="/reset-password">Forgot password?</Link>,
    submitText: 'Sign in',
    onSubmit: store.user.login,
  });
});
