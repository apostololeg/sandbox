import { Component, Fragment } from 'react';
import { bind } from 'decko';
import { withStore } from 'justorm/react';

import { Form, SubmitButtons } from 'uilib';

import { Title } from 'components/Header/Header';
import { Link } from 'components/Router/Router';
import Flex from 'components/UI/Flex/Flex';

import Login from './Login';
import Logout from './Logout';
import Register from './Register';

import s from './Auth.styl';

const Forms = {
  '/login': Login,
  '/logout': Logout,
  '/register': Register,
};

@withStore({
  page: [],
  notifications: [],
})
class Auth extends Component {
  @bind
  async onSubmit(onSubmit, payload) {
    const { router, store } = this.props;
    const { notifications } = store;

    try {
      await onSubmit(payload);
      router.navigate('/');
    } catch (err) {
      notifications.show({
        type: 'error',
        title: 'Login',
        content: err.message,
      });
    }
  }

  @bind
  renderAuthForm({
    title,
    titleContent,
    titleLink,
    fields,
    footerContent,
    submitText,
    onSubmit,
    ...formProps
  }) {
    return (
      <div className={s.root}>
        <div className={s.header}>
          <h2>{title}</h2>
          {titleContent}
          {titleLink && (
            <Link href={titleLink.to} className={s.link}>
              {titleLink.text}
            </Link>
          )}
        </div>
        <Form
          className={s.form}
          onSubmit={payload => this.onSubmit(onSubmit, payload)}
          {...formProps}
        >
          {({ Field, isValid, isDirty, isLoading }) => (
            <Fragment>
              {fields.map(props => (
                <Field {...props} key={props.name} />
              ))}
              <div className={s.footer}>
                {footerContent}
                <div className={s.gap} />
                <SubmitButtons
                  className={s.submitButtons}
                  buttons={[
                    {
                      children: submitText,
                      type: 'submit',
                      size: 'm',
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
  }

  render() {
    const { router } = this.props;
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
