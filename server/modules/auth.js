import gql from 'graphql-tag';
import { GraphQLModule } from '@graphql-modules/core';
import nanoid from 'nanoid';
import jwt from 'jsonwebtoken';

require('dotenv').config();

const { JWT_SECRET } = process.env;

// TODO: use Prisma for database.
const users = [
  {
    id: nanoid(),
    email: 'a@a.com',
    username: 'admin',
    password: '123',
    roles: ['admin']
  }
];
const getUserBy = (field, val) => {
  const data = users.find(user => user[field] === val);
  return Promise.resolve(data);
};

export default new GraphQLModule({
  name: 'auth',
  typeDefs: gql`
    type User {
      id: ID!
      email: String!
      username: String!
      roles: [String!]!
    }

    type AuthResponse {
      data: User
      token: String
      message: String
    }

    type Query {
      me: User
    }

    type Mutation {
      register(username: String!, email: String!, password: String!): AuthResponse
      login(email: String!, password: String!): AuthResponse
    }
  `,
  resolvers: {
    Query: {
      me: (root, args, { currentUser }) => currentUser,
    },
    Mutation: {
      async register(root, { username, email, password }, ctx) {
        const user = await getUserBy('email', email);

        if (user) {
          return {
            token: '',
            message: 'Username already exist'
          };
        }

        const id = nanoid();
        const token = jwt.sign({ id }, JWT_SECRET, { expiresIn: '1d' });

        ctx.res.cookie('jwt', token, { httpOnly: true, secure: true });

        users.push({
          id,
          username,
          email,
          password,
          roles: 'user'
        });

        return { token };
      },
      async login(root, { email, password }, ctx) {
        const user = await getUserBy('email', email);

        if (!user || user.password !== password) {
          return { message: 'Invalid credentials' };
        }

        const { id } = user;
        const token = jwt.sign({ id }, JWT_SECRET, { expiresIn: '1d' });

        ctx.res.cookie('jwt', token, { httpOnly: true, secure: true });

        return { token };
      }
    },
    User: {
      id: user => user.id,
      username: user => user.username,
      roles: user => user.roles,
    },
  },
  async context({ req }) {
    // TODO: How to set authorization header in GraphQL requests ?
    // const authToken = req.headers.authorization;
    const { authToken } = req.params;
    debugger

    if (!authToken) {
      return null;
    }

    try {
      const { id } = jwt.verify(authToken, JWT_SECRET);
      const currentUser = await getUserBy('id', id);

      return {
        authToken,
        currentUser,
      };
    } catch (e) {
      console.warn(`Unable to authenticate using auth token: ${authToken}`);
      return null;
    }
  },
});
