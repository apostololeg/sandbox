import { Component, Fragment } from 'react';
import { bind } from 'decko';
import { withStore } from 'justorm/react';

import { Form, SubmitButtons, Link } from 'uilib';

import { Title } from 'components/Header/Header';
import Flex from 'components/UI/Flex/Flex';

import Login from './Login';
import Logout from './Logout';
import Register from './Register';

import S from './Auth.styl';

const Forms = {
  '/login': Login,
  '/logout': Logout,
  '/register': Register,
};

type Props = {
  store?: any;
  router?: any;
};

@withStore({
  router: ['path'],
  page: [],
  notifications: [],
})
class Auth extends Component<Props> {
  onSubmit = async (onSubmit, payload) => {
    const { store } = this.props;
    const { router, notifications } = store;

    try {
      await onSubmit(payload);
      router.go('/');
    } catch (err: any) {
      notifications.show({
        type: 'error',
        title: 'Login',
        content: err.message,
      });
    }
  };

  renderAuthForm = ({
    title,
    titleContent,
    titleLink,
    fields,
    footerContent,
    submitText,
    onSubmit,
    ...formProps
  }) => (
    <div className={S.root}>
      <div className={S.header}>
        <h2>{title}</h2>
        {titleContent}
        {titleLink && (
          <Link href={titleLink.to} className={S.link}>
            {titleLink.text}
          </Link>
        )}
      </div>
      <Form
        className={S.form}
        onSubmit={payload => this.onSubmit(onSubmit, payload)}
        {...formProps}
      >
        {({ Field, isValid, isDirty, isLoading }) => (
          <Fragment>
            {fields.map(props => (
              <Field {...props} key={props.name} />
            ))}
            <div className={S.footer}>
              {footerContent}
              <div className={S.gap} />
              <SubmitButtons
                className={S.submitButtons}
                buttons={[
                  {
                    children: submitText,
                    type: 'submit',
                    size: 'm',
                    key: 'submit',
                    loading: isLoading,
                    disabled: !isDirty || !isValid,
                  },
                ]}
              />
            </div>
          </Fragment>
        )}
      </Form>
    </div>
  );

  render() {
    const {
      store: { router },
    } = this.props;
    const AuthForm = Forms[router.path];

    return (
      <Flex centered scrolled>
        <Title text="Auth" />
        <AuthForm router={router}>{this.renderAuthForm}</AuthForm>
      </Flex>
    );
  }
}

export default Auth;
