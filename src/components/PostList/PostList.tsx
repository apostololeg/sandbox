import { Fragment, Component } from 'react';
import { withStore } from 'justorm/react';

import { Spinner, Button, Link } from 'uilib';

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
    const allowEdit = isEditor || isAdmin;

    return (
      <MenuItem key={slug}>
        <Link href={`/posts/${slug}`} isClear>
          <h2>{title || `[${slug}]`}</h2>
        </Link>
        {allowEdit && <Link href={`/posts/${slug}/edit`}>Edit</Link>}
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
    const { isAdmin, isEditor } = user;
    const canCreateNew = isEditor || isAdmin;

    return (
      <Fragment>
        <Title text="Posts">
          {canCreateNew && <Link href="/posts/new">Create New</Link>}
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
