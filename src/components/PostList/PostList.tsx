import { Fragment, Component } from 'react';
import { withStore } from 'justorm/react';

import { Scroll, Button, Link } from 'uilib';

import Menu, { MenuItem } from 'components/UI/Menu/Menu';
import { PageLoader } from 'components/UI/Loader/Loader';
import { Gap } from 'components/UI/Flex/Flex';

import { Title } from 'components/Header/Header';
import LangSwitcher from 'components/Post/LangSwitcher/LangSwitcher';

import S from './PostList.styl';

type Props = {
  store?: any;
};

let isFirstLoaded = false;

@withStore({
  user: ['isAdmin', 'isEditor'],
  posts: ['items', 'lang', 'loadingList', 'deleting'],
  notifications: [],
})
class PostList extends Component<Props> {
  componentDidMount() {
    const { loadPosts } = this.props.store.posts;

    if (isFirstLoaded) return;

    isFirstLoaded = true;
    loadPosts({ orderBy: { updatedAt: 'desc' } });
  }

  renderItem = id => {
    const { user, posts } = this.props.store;
    const { isAdmin, isEditor } = user;
    const allowEdit = isEditor || isAdmin;
    const { byId, lang } = posts;
    const { slug, texts } = byId[id];
    const title = texts.find(t => t.lang === lang)?.title ?? texts[0]?.title;

    return (
      <MenuItem key={slug}>
        <Link href={`//post/${slug}?lang=${lang.toLowerCase()}`} isClear>
          <h2>{title?.trim() || `[${slug}]`}</h2>
        </Link>
        {allowEdit && <Link href={`//post/${id}/edit`}>Edit</Link>}
        {isAdmin && (
          <Button
            onClick={() => posts.deletePost(id)}
            loading={posts.deleting[id]}
          >
            Remove
          </Button>
        )}
      </MenuItem>
    );
  };

  render() {
    const { user, posts } = this.props.store;
    const { loadingList, items } = posts;
    const { isAdmin, isEditor } = user;
    const canCreateNew = isEditor || isAdmin;

    return (
      <Fragment>
        <Title text="Posts">
          {canCreateNew && <Link href="/new">Create New</Link>}
        </Title>
        {loadingList ? (
          <PageLoader size="l" />
        ) : (
          <>
            <Scroll y>
              <Menu>{items.map(this.renderItem)}</Menu>
            </Scroll>
            <Gap />
            <div className={S.footer}>
              <LangSwitcher popupProps={{ direction: 'right-top' }} />
            </div>
          </>
        )}
      </Fragment>
    );
  }
}

export default PostList;
