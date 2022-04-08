import { createStore } from 'justorm/react';
import { nanoid } from 'nanoid';

import time from 'timen';
import { sliceWhere } from 'tools/array';

const SHOW_TIME = 5000;
const ANIMATION_DURATION = 200;

const STORE = createStore('notifications', {
  items: [],
  autohide: [],
  data: {},
  paused: false,
  show(data) {
    const id = nanoid();

    this.items.push(id);
    this.data[id] = {
      ...data,
      createdAt: Date.now(),
    };

    time.after(ANIMATION_DURATION, () => (this.data[id].visible = true));

    if (data.autohide !== false) {
      this.autohide.push(id);
    }
  },
  pause() {
    this.paused = true;
    this.pausedAt = Date.now();
  },
  unpause() {
    const pauseTime = Date.now() - this.pausedAt;

    this.autohide.forEach(id => {
      this.data[id].createdAt += pauseTime;
    });

    this.paused = false;
  },
  close(id) {
    this.data[id].visible = false;
    time.after(ANIMATION_DURATION, () => this.remove(id));
  },
  remove(id) {
    sliceWhere(this.items, id);
    sliceWhere(this.autohide, id);
    this.data[id] = null;
  },
});

// worker
time.tick(function tick() {
  const { paused, autohide, data } = STORE;

  if (paused || autohide.length === 0) {
    return;
  }

  const id = autohide[0]; // TODO: move trough all autohide until some will !readyToHide
  const item = data[id];
  const readyToHide = Date.now() - item.createdAt > SHOW_TIME;

  if (item.visible && readyToHide) {
    item.visible = false;
    time.after(ANIMATION_DURATION, () => STORE.remove(id));
  }
});
