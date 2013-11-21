/**
 * jquery.cb.toaster.js
 *
 * Copyright (c) 2013 Colin Bacon
 * http://www.iambacon.co.uk
 *
 * Depends:
 * jquery.js v1.8+
 * jquery-ui.widget.js
 * transition-helper.js
 */

(function($) {
    $.widget("cb.toaster", {
        // Options
        options: {},
        items: null, // Carousel list items
        currentItemIndex: null, // Active item index no.
        nextItemIndex: null, // Next item index no.
        itemWidth: null, // Width of the item.
        numItems: null, // Total number of items
        isAnimating: null,
        prevLink: null,
        nextLink: null,
        transitionDefaults: {
            duration: 500,
            easing: 'ease-in-out 250ms'
        },

        /**
         * Function: addHandlers
         * Adds event handlers.
         */
        _addHandlers: function() {
            var self = this,
                el = self.element,
                nav,
                paging;

            nav = $(el).next();
            self.nextLink = $(nav).find('.cb-toaster-next');
            self.prevLink = $(nav).find('.cb-toaster-prev');
            paging = $(nav).siblings('.cb-toaster-paging').find('.cb-toaster-paging-item');

            // next link
            self.nextLink.on("click", function(e) {
                e.preventDefault();
                if (self.currentItemIndex < self.numItems) {
                    self.nextItemIndex = self.currentItemIndex + 1;
                    self._navigate();
                }
            });

            // previous link
            self.prevLink.on("click", function(e) {
                e.preventDefault();
                if (self.currentItemIndex > 0) {
                    self.nextItemIndex = self.currentItemIndex - 1;
                    self._navigate();
                }
            });

            // paging link
            paging.on("click", function(e) {
                e.preventDefault();
                self.nextItemIndex = $(this).index();
                self._navigate();
            });
        },

        _create: function() {
            var self = this,
                el = self.element;

            self.items = $(el).find('li');

            if (self.items.length === 0) {
                return;
            }

            el.addClass('cb-toaster');

            self.items.each(function() {
                $(this).addClass('cb-toaster-item');
            });

            self._createWrapper();
            self._createDisplayTitle();
            self._createPaging();
            self._createNavigation();
            self._setViewport();
            self._addHandlers();
            self._setActivePage(0);
        },

        /**
         * Function: createDisplayTitle
         * Appends carousel item title after the element.
         */
        _createDisplayTitle: function() {
            var self = this,
                el = self.element,
                title;

            title = $('<h2 class="cb-toaster-display-title"></h2>');
            el.after(title);
        },

        /**
         * Function: createNavigation
         * Appends navigation links after the element.
         */
        _createNavigation: function() {
            var self = this,
                el = self.element,
                nav,
                next,
                prev;

            nav = $('<nav class="cb-toaster-nav"></nav>');
            next = $('<a class="cb-toaster-next ir" href="#" title="Navigate to next item">Next</a>');
            prev = $('<a class="cb-toaster-prev ir" href="#" title="Navigate to previous item">Previous</a>');

            nav.append(prev, next);
            el.after(nav);
        },

        /**
         * Function: createPaging
         * Appends carousel paging after the element.
         */
        _createPaging: function() {
            var self = this,
                el = self.element,
                paging,
                pagingItem,
                pagingLink,
                i;

            paging = $('<ul class="cb-toaster-paging"></ul>');

            for (i = 1; i < self.items.length + 1; i += 1) {
                pagingLink = $('<a class="cb-toaster-paging-link ir" href="#"></a>').html(i).attr('title', i);
                pagingItem = $('<li class="cb-toaster-paging-item"></li>');
                pagingItem.append(pagingLink);
                paging.append(pagingItem);
            }

            el.after(paging);
        },

        /**
         * Function: createWrapper
         * Creates a wrapper around the element.
         */
        _createWrapper: function() {
            var self = this,
                el = self.element,
                wrapper,
                width = self.items.outerWidth();

            wrapper = $('<div class="cb-toaster-wrapper"></div>');
            wrapper.css({
                'width': width
            });

            el.wrap(wrapper);
        },

        destroy: function() {
            // Dispose of any elements here.
        },

        /**
         * Function: findDisplayTitle
         * Returns the carousel display title.
         * @returns {object} The display title element.
         */
        _findDisplayTitle: function() {
            return this.element
                .siblings('.cb-toaster-display-title');
        },

        /**
         * Function: init
         * Initialises the carousel defaults.
         */
        _init: function() {
            var self = this,
                activeItem,
                title;

            if (self.items.length === 0) {
                return;
            }

            self.currentItemIndex = 0;
            self.itemWidth = self.items.outerWidth();
            self.numItems = self.items.length;
            self._setNavigationState(self.currentItemIndex);

            activeItem = self.items.first();
            activeItem.addClass('is-active');
            title = activeItem.data('cb-toaster-title');

            self._setDisplayTitle(title);
        },

        /**
         * Function: navigate
         * Navigate to selected item by the specified index.
         * @param {object} el The navigation link.
         */
        _navigate: function() {
            var self = this;

            self._slide();
            self._setNavigationState(self.nextItemIndex);
        },

        /**
         * Function: setActivePage
         * Sets the paging item to active.
         * @parma {int} index The paging item index no.
         */
        _setActivePage: function(index) {
            var el = this.element,
                pagingItems;

            pagingItems = el
                .siblings('.cb-toaster-paging')
                .children();

            pagingItems.removeClass('is-active');
            $(pagingItems[index]).addClass('is-active');
        },

        /**
         * Function: setDisplayTitle
         * Sets the display title to the specified title.
         * @param {string} title The title.
         */
        _setDisplayTitle: function(title) {
            this._findDisplayTitle().html(title);
        },

        /**
         * Function: setNavigationState
         * Sets the state of the navigation links.
         * @param {int} index The item index no.
         */
        _setNavigationState: function(index) {
            var self = this,
                el = self.element,
                nav = el.siblings('.cb-toaster-nav');

            nav.children().removeClass('is-disabled');

            if (index === 0) {
                self.prevLink.addClass('is-disabled');
            }

            if (index === self.numItems - 1) {
                self.nextLink.addClass('is-disabled');
            }
        },

        _setOption: function() {
            // Allows us to change options after the initialisation
        },

        /**
         * Function: setViewport
         * Sets the viewport size.
         */
        _setViewport: function() {
            var self = this,
                el = self.element,
                height = self.items.outerHeight(),
                width = self.items.outerWidth();

            el.css({
                'height': height,
                'width': width
            });
        },

        /**
         * Function: slide
         * Transitions from the active item to the next desired item.
         */
        _slide: function() {
            var self = this,
                nextItem,
                currentItem,
                title;

            if (!self.isAnimating) {
                self.isAnimating = true;
                self._findDisplayTitle().fadeOut('slow');

                currentItem = self.items.eq(self.currentItemIndex);
                nextItem = self.items.eq(self.nextItemIndex);

                if ($.support.transitions) {
                    currentItem.removeClass('is-active');

                    // Apply transition end handler once rather than 'on' (always)
                    currentItem.one('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function() {

                        self.isAnimating = false;
                        self._setActivePage(self.nextItemIndex);

                        nextItem.addClass('is-active')
                            .one('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function() {
                                title = $(this).data('cb-toaster-title');

                                self._setDisplayTitle(title);
                                self._findDisplayTitle().fadeIn('slow');
                                self.currentItemIndex = self.nextItemIndex;
                            });
                    });
                } else {
                    self._setActivePage(self.nextItemIndex);

                    currentItem.delay(250).animate({
                        top: '100%'
                    }, 250, function() {
                        $(this).removeClass('is-active');

                        nextItem.delay(250).animate({
                            top: '0'
                        }, 250, function() {
                            $(this).addClass('is-active');
                        });
                    });

                    title = nextItem.find('.tt-feature-title').text();
                    self._findDisplayTitle().fadeOut('slow', function() {
                        self._setDisplayTitle(title);
                        self._findDisplayTitle().fadeIn('slow');
                    });

                    self.isAnimating = false;
                    self.currentItemIndex = self.nextItemIndex;
                }
            }
        }
    });
}(jQuery));