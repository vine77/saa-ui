require('list-view/list_view_mixin');
require('list-view/list_view_helper');

var get = Ember.get, set = Ember.set;

/**
  The `Ember.ListView` view class renders a
  [div](https://developer.mozilla.org/en/HTML/Element/div) HTML element,
  with `ember-list-view` class.

  The context of each item element within the `Ember.ListView` are populated
  from the objects in the `Element.ListView`'s `content` property.

  ### `content` as an Array of Objects

  The simplest version of an `Ember.ListView` takes an array of object as its
  `content` property. The object will be used as the `context` each item element
  inside the rendered `div`.

  Example:

  ```javascript
  App.contributors = [{ name: 'Stefan Penner' }, { name: 'Alex Navasardyan' }, { name: 'Rey Cohen'}];
  ```

  ```handlebars
  {{#collection Ember.ListView contentBinding="App.contributors" height=500 rowHeight=50}}
    {{name}}
  {{/collection}}
  ```

  Would result in the following HTML:

  ```html
   <div id="ember181" class="ember-view ember-list-view" style="height:500px;width:500px;position:relative;overflow:scroll;-webkit-overflow-scrolling:touch;overflow-scrolling:touch;">
    <div class="ember-list-container">
      <div id="ember186" class="ember-view ember-list-item-view" style="-webkit-transform: translate3d(0px, 0px, 0);">
        <script id="metamorph-0-start" type="text/x-placeholder"></script>Stefan Penner<script id="metamorph-0-end" type="text/x-placeholder"></script>
      </div>
      <div id="ember187" class="ember-view ember-list-item-view" style="-webkit-transform: translate3d(0px, 50px, 0);">
        <script id="metamorph-1-start" type="text/x-placeholder"></script>Alex Navasardyan<script id="metamorph-1-end" type="text/x-placeholder"></script>
      </div>
      <div id="ember188" class="ember-view ember-list-item-view" style="-webkit-transform: translate3d(0px, 100px, 0);">
        <script id="metamorph-2-start" type="text/x-placeholder"></script>Rey Cohen<script id="metamorph-2-end" type="text/x-placeholder"></script>
      </div>
      <div id="ember189" class="ember-view ember-list-scrolling-view" style="height: 150px"></div>
    </div>
  </div>
  ```

  By default `Ember.ListView` provides support for `height`,
  `rowHeight`, `width`, `elementWidth`, `scrollTop` parameters.

  Note, that `height` and `rowHeight` are required parameters.

  ```handlebars
  {{#collection Ember.ListView contentBinding="App.contributors" height=500 rowHeight=50}}
    {{name}}
  {{/collection}}
  ```

  If you would like to have multiple columns in your view layout, you can
  set `width` and `elementWidth` parameters respectively.

  ```handlebars
  {{#collection Ember.ListView contentBinding="App.contributors" height=500 rowHeight=50 width=500 elementWidth=80}}
    {{name}}
  {{/collection}}
  ```

  ### extending `Ember.ListView`

  Example:

  ```handlebars
  {{view App.ListView contentBinding="content"}}

  <script type="text/x-handlebars" data-template-name="row_item">
    {{name}}
  </script>
  ```

  ```javascript
  App.ListView = Ember.ListView.extend({
    height: 500,
    width: 500,
    elementWidth: 80,
    rowHeight: 20,
    itemViewClass: Ember.ListItemView.extend({templateName: "row_item"})
  });
  ```

  @extends Ember.ContainerView
  @class ListView
  @namespace Ember
*/
Ember.ListView = Ember.ContainerView.extend(Ember.ListViewMixin, {
  css: {
    position: 'relative',
    overflow: 'scroll',
    '-webkit-overflow-scrolling': 'touch',
    'overflow-scrolling': 'touch'
  },

  applyTransform: Ember.ListViewHelper.applyTransform,

  _scrollTo: function(scrollTop) {
    var element = get(this, 'element');

    if (element) { element.scrollTop = scrollTop; }
  },

  didInsertElement: function() {
    var that, element;

    that = this,
    element = get(this, 'element');

    this._updateScrollableHeight();

    this._scroll = function(e) { that.scroll(e); };

    Ember.$(element).on('scroll', this._scroll);
  },

  willDestroyElement: function() {
    var element;

    element = get(this, 'element');

    Ember.$(element).off('scroll', this._scroll);
  },

  scroll: function(e) {
    this.scrollTo(e.target.scrollTop);
  },

  scrollTo: function(y){
    var element = get(this, 'element');
    this._scrollTo(y);
    this._scrollContentTo(y);
  },

  totalHeightDidChange: Ember.observer(function () {
    Ember.run.scheduleOnce('afterRender', this, this._updateScrollableHeight);
  }, 'totalHeight'),

  _updateScrollableHeight: function () {
    if (this.state === 'inDOM') {
      this.$('.ember-list-container').css({
        height: get(this, 'totalHeight')
      });
    }
  }
});
