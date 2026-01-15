/*! scale.fix.js | MIT License | https://github.com/orderedlist */
(function(document, window) {
  'use strict';

  // Fix scaling issues on mobile devices
  var addEvent = function(element, eventName, fn) {
    if (element.addEventListener) {
      return element.addEventListener(eventName, fn, false);
    } else if (element.attachEvent) {
      return element.attachEvent('on' + eventName, fn);
    }
  };

  // Initialize when DOM is ready
  var onDOMReady = function(fn) {
    if (document.readyState === 'complete') {
      return fn();
    } else if (document.addEventListener) {
      return document.addEventListener('DOMContentLoaded', fn);
    } else {
      return document.attachEvent('onreadystatechange', function() {
        if (document.readyState === 'complete') {
          return fn();
        }
      });
    }
  };

  // Main function
  var scaleFix = function() {
    var meta = document.querySelector('meta[name="viewport"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'viewport';
      document.head.appendChild(meta);
    }
    
    // Set viewport meta tag
    meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    
    // Fix iOS viewport scaling bug
    if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {
      document.addEventListener('gesturestart', function() {
        meta.content = 'width=device-width, minimum-scale=0.25, maximum-scale=1.6';
      }, false);
    }
  };

  // Add smooth scrolling for anchor links
  var addSmoothScroll = function() {
    var links = document.querySelectorAll('a[href^="#"]');
    
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function(e) {
        var href = this.getAttribute('href');
        if (href !== '#') {
          var target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            var offsetTop = target.offsetTop - 20;
            window.scrollTo({
              top: offsetTop,
              behavior: 'smooth'
            });
          }
        }
      });
    }
  };

  // Copy code functionality
  var addCopyCode = function() {
    var codeBlocks = document.querySelectorAll('pre code');
    
    for (var i = 0; i < codeBlocks.length; i++) {
      var container = codeBlocks[i].parentElement;
      
      if (!container.classList.contains('highlight')) {
        continue;
      }
      
      var button = document.createElement('button');
      button.className = 'copy-button';
      button.textContent = 'Copy';
      button.style.cssText = 'position: absolute; top: 5px; right: 5px; padding: 5px 10px; background: #f0f0f0; border: 1px solid #ccc; border-radius: 3px; cursor: pointer; font-size: 12px;';
      
      button.addEventListener('click', function(e) {
        var code = this.parentElement.querySelector('code');
        var text = code.textContent;
        
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(function() {
            e.target.textContent = 'Copied!';
            setTimeout(function() {
              e.target.textContent = 'Copy';
            }, 2000);
          });
        } else {
          // Fallback for older browsers
          var textArea = document.createElement('textarea');
          textArea.value = text;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          
          e.target.textContent = 'Copied!';
          setTimeout(function() {
            e.target.textContent = 'Copy';
          }, 2000);
        }
      });
      
      container.style.position = 'relative';
      container.appendChild(button);
    }
  };

  // Initialize everything when DOM is ready
  onDOMReady(function() {
    scaleFix();
    addSmoothScroll();
    addCopyCode();
  });

  // Handle window resize events
  addEvent(window, 'resize', function() {
    // Add any resize-specific functionality here
  });

  // Handle orientation change on mobile
  addEvent(window, 'orientationchange', function() {
    // Add any orientation-specific functionality here
  });

})(document, window);