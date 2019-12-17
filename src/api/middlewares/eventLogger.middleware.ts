import { Middleware } from 'middy';

const eventLogger: Middleware<any, any, any> = () => {
  return {
    before: (handler, next) => {
      console.log(JSON.stringify(handler.event, null, 2));
      next();
    },
  };
};

export default eventLogger;
