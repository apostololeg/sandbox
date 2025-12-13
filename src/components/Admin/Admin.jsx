import { Redirect } from 'uilib';

import { Title } from 'components/Header/Header';
import Flex from 'components/UI/Flex/Flex';
import { useUser } from 'store/user';

export default function Admin() {
  const user = useUser(['isLogged']);
  const { isLogged } = user;

  if (!isLogged) {
    return <Redirect to="/login" />;
  }

  return (
    <Flex className="Admin">
      <Title text="Admin" />
      What's going on here?
    </Flex>
  );
}
