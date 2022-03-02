import { Fragment, Component } from 'react';
import { withStore } from 'justorm/react';

import { Spinner, Button } from 'uilib';

import { Link } from 'components/Router/Router';
import { Title } from 'components/Header/Header';
import Flex from 'components/UI/Flex/Flex';
import Menu, { MenuItem } from 'components/UI/Menu/Menu';

// import S from './PostList.styl';

type Props = {
  store?: any;
};

@withStore({
  user: ['isAdmin', 'isEditor'],
  posts: ['list', 'loadingList', 'deleting'],
  notifications: [],
})
class PostList extends Component<Props> {
  componentDidMount() {
    const { posts } = this.props.store;

    posts.loadPosts();
  }

  renderItem = ({ slug, title }) => {
    const { user, posts } = this.props.store;
    const { isAdmin, isEditor } = user;

    return (
      <MenuItem key={slug}>
        <Link href={slug} isClear>
          <h2>{title || `[${slug}]`}</h2>
        </Link>
        {isEditor && <Link href={`${slug}/edit`}>Edit</Link>}
        {isAdmin && (
          <Button
            onClick={() => posts.deletePost(slug)}
            isLoading={posts.deleting[slug]}
          >
            Remove
          </Button>
        )}
      </MenuItem>
    );
  };

  render() {
    const { user, posts } = this.props.store;
    const { loadingList, list } = posts;

    return (
      <Fragment>
        <Title text="Posts">
          {user.roles?.includes('EDITOR') && <Link href="new">Create New</Link>}
        </Title>
        <Flex scrolled centered={loadingList}>
          {loadingList ? (
            <Spinner size="l" />
          ) : (
            <Menu>{list.map(this.renderItem)}</Menu>
          )}
        </Flex>
      </Fragment>
    );
  }
}

export default PostList;
