import { h, Component, Fragment } from 'preact'
import { store, view } from 'preact-easy-state'
import { bind } from 'decko'

import { capitalize } from 'tools/string'

import { notify } from 'store/notifications'
import PageStore from 'store/page'

import withTitle from 'components/HOC/withTitle'
import Redirect from 'components/UI/Redirect'
import Link from 'components/UI/Link'
import Flex from 'components/UI/Flex'
import Form, { SubmitButtons } from 'components/UI/Form'

import Login from './Login'
import Logout from './Logout'
import Register from './Register'

import s from './Auth.styl'

const Forms = {
  Login,
  Logout,
  Register
};

@withTitle('Auth')
@view
class Auth extends Component {
  store = store({ needRedirect: false });

  componentDidMount() {
    PageStore.isAuth = true;
  }

  componentWillUnmount() {
    PageStore.isAuth = false;
  }

  @bind
  async onSubmit(onSubmit, payload) {
    try {
      await onSubmit(payload);
      this.store.needRedirect = true;
    } catch(err) {
      notify({
        type: 'error',
        title: 'Login',
        content: err.message
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
          {({ Field, isValid, isDirty }) => (
            <Fragment>
              {fields.map(props => <Field {...props} key={props.name} />)}
              <div className={s.footer}>
                {footerContent}
                <div className={s.gap} />
                <SubmitButtons
                  buttons={[
                    {
                      text: submitText,
                      type: 'submit',
                      disabled: !isDirty || !isValid
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
    const { type } = this.props;
    const { needRedirect } = this.store;
    const AuthForm = Forms[capitalize(type)];

    if (needRedirect) {
      return <Redirect to="/" noThrow />;
    }

    return (
      <Flex centered scrolled>
        <AuthForm>{this.renderAuthForm}</AuthForm>
      </Flex>
    );
  }
}

export default Auth;
