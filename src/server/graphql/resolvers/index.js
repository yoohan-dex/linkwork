import {getUserByEmail} from './helper';
export default {
  Query: {
    async author(root, {name}) {
      const user = await getUserByEmail(name);
      console.log(user);
      return user.name;
    },
    getTest(root, {testString}) {
      return `fuck you ${testString}`;
    },
  },
  Mutation: {
    postAuthor(root, {name}) {
      return `fuck it ${name}`;
    },
  },
};
