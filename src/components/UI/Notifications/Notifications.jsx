import cn from 'classnames';
import { withStore } from 'justorm/react';

import icons from './icons';
import s from './Notifications.styl';

function Item(props) {
  const {
    id,
    type = 'info',
    title,
    content,
    visible,
    pause,
    unpause,
    close,
  } = props;
  const classes = cn(s.item, s[`item_type_${type}`], visible && s.item_visible);

  const Icon = icons[type];
  const Close = icons.close;

  return (
    <div
      className={classes}
      onMouseOver={pause}
      onFocus={pause}
      onTouchStart={pause}
      onMouseOut={unpause}
      onBlur={unpause}
      onTouchEnd={unpause}
    >
      <div className={s.itemInner}>
        <Icon className={s.icon} />
        {(title || content) && (
          <div className={s.text}>
            {title && <div className={s.title}>{title}</div>}
            {content && <div className={s.content}>{content}</div>}
          </div>
        )}
        <Close className={s.close} onClick={() => close(id)} />
      </div>
    </div>
  );
}

export default withStore({ notifications: ['items', 'data'] })(
  function Notifications({ store }) {
    const { items, data, pause, unpause, close } = store.notifications;
    const api = { pause, unpause, close };

    return (
      <div className={s.root}>
        {items.map(id => (
          <Item {...data[id]} {...api} id={id} key={id} />
        ))}
      </div>
    );
  }
);
