import { Fragment, useCallback } from 'react';
import { useStore } from 'justorm/react';

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
  router?: any;
};

export default function Auth({ router: routerProp }: Props) {
  const { router, notifications } = useStore({
    router: ['path'],
    notifications: [],
  });
  const currentRouter = routerProp || router;

  const handleSubmit = useCallback(
    async (onSubmit, payload) => {
      try {
        await onSubmit(payload);
        currentRouter.go('/');
      } catch (err: any) {
        notifications.show({
          type: 'error',
          title: 'Login',
          content: err.message,
        });
      }
    },
    [currentRouter, notifications]
  );

  function renderAuthForm({
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
          onSubmit={payload => handleSubmit(onSubmit, payload)}
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
  }

  const AuthForm = Forms[currentRouter.path];

  return (
    <Flex centered scrolled>
      <Title text="Auth" />
      <AuthForm router={currentRouter}>{renderAuthForm}</AuthForm>
    </Flex>
  );
}
