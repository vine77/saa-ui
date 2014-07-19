import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  attrs: {
    slos: {sideload: 'always'}
  }
});
