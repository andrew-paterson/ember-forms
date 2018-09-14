import EmberRouter from '@ember/routing/router';
import config from './config/environment';
import { inject as service } from '@ember/service';
import { on } from '@ember/object/evented';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('index', {path: '/'});
  this.route('page-not-found', {path: '/*path'});
  this.route('terms-of-use');
  this.route('dashboard');
  this.route('privacy-policy');
  this.route('component');
  this.route('error');//
  this.route('dynamic-forms');
  this.route('signup');
  this.route('users');
  this.route('edit-account');
});

Router.reopen({
  session: service(),
  checkBrowserSupport: on('willTransition', function() {
    function placeholderSupport() {
      return 'placeholder' in document.createElement('input');
    }
    function fileAPISupport() {
      return typeof FileReader !== 'undefined';
    }
    function webAnimationSupport() {
      var animation = false,
          animationstring = 'animation',
          keyframeprefix = '',
          domPrefixes = 'Webkit Moz O ms Khtml'.split(' '),
          pfx  = '',
          elm = document.createElement('div');

      if( elm.style.animationName !== undefined ) { animation = true; }

      if( animation === false ) {
        for( var i = 0; i < domPrefixes.length; i++ ) {
          if( elm.style[ domPrefixes[i] + 'AnimationName' ] !== undefined ) {
            pfx = domPrefixes[ i ];
            animationstring = pfx + 'Animation';
            keyframeprefix = '-' + pfx.toLowerCase() + '-';
            animation = true;
            break;
          }
        }
      }
      return animation;
    }
    this.set('session.placeholdersSupported', placeholderSupport());
    this.set('session.webAnimationSupported', webAnimationSupport());
    if (!fileAPISupport()) {
      this.set('session.noFileApi', true);
    } else {
      this.set('session.noFileApi', false);
    }
  }),
});
export default Router;
