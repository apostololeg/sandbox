import { nanoid } from 'nanoid';
import { Router } from 'express';

import { LANGS } from '../../src/shared/langs';
import { parseId } from '../../src/shared/parsers';

import { validateRole, ROLES } from '../permissions';
import { getCurrentUser } from '../api/users';
import db from '../api/db';

const router = Router();

const validateUserRole = async (req, ...roles) => {
  const user = await getCurrentUser(req);
  return validateRole(user, ...roles);
};

const canEdit = req => validateUserRole(req, ROLES.EDITOR);
const canDelete = req => validateUserRole(req, ROLES.ADMIN);

const select = {
  id: true,
  createdAt: true,
  updatedAt: true,
  author: true,
  authorId: true,
  slug: true,
  slugLock: true,
  texts: { select: { id: true, title: true, lang: true } },
  tags: true,
  published: true,
};

router
  .get('/', async (req, res) => {
    const params = { ...req.params, where: {}, select };
    const allowEdit = await canEdit(req);

    if (!allowEdit) params.where.published = true;

    const items = await db.post.findMany(params);

    res.json(items);
  })

  .get('/texts/:id', async (req, res) => {
    const data = await db.postTexts.findUnique({
      where: { id: parseId(req.params.id) },
      select: { title: true, content: true },
    });

    return res.json(data);
  })

  .get('/:idOrSlug', async (req, res) => {
    const { idOrSlug } = req.params;
    const id = parseId(idOrSlug);
    const where = {};

    if (id) where.id = id;
    else where.slug = idOrSlug;

    const params = { where, select };
    const allowEdit = await canEdit(req);

    if (!allowEdit) params.where = { AND: [where, { published: true }] };

    const data = await db.post.findFirst(params);

    res.json(data);
  })

  .post('/new', async (req, res) => {
    const allowEdit = await canEdit(req);

    if (!allowEdit) return res.status(405).send();

    const { lang } = req.body;
    const user = await getCurrentUser(req, { email: true });
    const data = {
      slug: nanoid(),
      author: { connect: { email: user.email } },
      slugLock: false,
      published: false,
      texts: { create: [{ lang, title: '', content: '' }] },
    };

    try {
      const post = await db.post.create({ data, select });

      res.json(post);
    } catch (error) {
      console.log('error', error);

      res.status(400).json({ error });
    }
  })

  .post('/:id', async (req, res) => {
    const data = { ...req.body };
    const allowEdit = await canEdit(req);

    if (!allowEdit) return res.status(405).send();

    if (data.texts) {
      const update = [];
      const create = [];

      data.texts.map(({ id, title, content, lang }) => {
        if (id) update.push({ where: { id }, data: { title, content } });
        else create.push({ lang, title: '', content: '' });
      });

      data.texts = { update, create };
    }

    try {
      const id = parseInt(req.params.id, 10);
      const post = await db.post.update({
        where: { id },
        data,
        select,
      });

      res.json(post);
    } catch (error) {
      console.log('error', error);
      res.status(400).json({ error });
    }
  })

  .delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const isAllowed = await canDelete(req);

    if (!isAllowed) return res.status(405).send();

    try {
      await db.post.delete({ where: { id } });
      res.status(200).send();
    } catch (error) {
      console.log(error);
      res.status(500).send();
    }
  });

export default router;
