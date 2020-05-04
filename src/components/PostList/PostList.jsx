import { Fragment, Component } from 'preact';
import { withStore } from 'justorm/preact';

import { Link } from 'components/Router';
import { Title } from 'components/Header';
import Flex from 'components/UI/Flex';
import Menu, { MenuItem } from 'components/UI/Menu';
import Spinner from 'components/UI/Spinner';
import Button from 'components/UI/Button';

// import S from './PostList.styl';

@withStore({
  user: ['isAdmin'],
  posts: ['list', 'loadingList', 'deleting'],
  notifications: [],
})
class PostList extends Component {
  componentDidMount() {
    const { posts } = this.props.store;

    posts.loadPosts();
  }

  renderItem = ({ slug, title }) => {
    const { user, posts } = this.props.store;

    return (
      <MenuItem key={slug}>
        <Link href={slug} isClear>
          <h2>{title || `[${slug}]`}</h2>
        </Link>
        {user.isAdmin && [
          <Link href={`${slug}/edit`}>Edit</Link>,
          <Button
            onClick={() => posts.deletePost(slug)}
            loading={posts.deleting[slug]}
          >
            Remove
          </Button>,
        ]}
      </MenuItem>
    );
  };

  render() {
    const { user, posts } = this.props.store;
    const { loadingList, list } = posts;

    return (
      <Fragment>
        <Title text="Posts">
          {user.isAdmin && <Link href="new">Create New</Link>}
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
