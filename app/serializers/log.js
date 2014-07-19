import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  attrs: {
    categories: {embedded: 'always'}
  }
});
