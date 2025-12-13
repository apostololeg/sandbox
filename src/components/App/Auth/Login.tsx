import { Link } from 'uilib';
import { useUser } from 'store/user';

export default function Login({ children }) {
  const user = useUser([]);

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
    onSubmit: user.login,
  });
}
