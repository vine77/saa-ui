import Ember from 'ember';

export default function(url) {
  return new Ember.RSVP.Promise(function(resolve, reject) {
    var xhr = new window.XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onreadystatechange = function() {
      if (this.readyState === this.DONE) {
        if (this.status === 200) {
          resolve(this.response);
        } else {
          reject(this);
        }
      }
    };
    xhr.responseType = 'json';
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.send();
  });
}
