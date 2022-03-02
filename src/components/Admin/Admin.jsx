import { withStore } from 'justorm/react';

import { Redirect } from 'components/Router/Router';
import { Title } from 'components/Header/Header';
import Flex from 'components/UI/Flex/Flex';

export default withStore({ user: ['isLogged'] })(function Admin({ store }) {
  const { isLogged } = store.user;

  if (!isLogged) {
    return <Redirect to="/login" />;
  }

  return (
    <Flex className="Admin">
      <Title text="Admin" />
      What's going on here?
    </Flex>
  );
});
