import { Middleware } from 'middy';

const eventLogger: Middleware<any, any, any> = () => {
  return {
    before: (handler, next) => {
      console.log(handler.event);
      next();
    },
  };
};

export default eventLogger;
