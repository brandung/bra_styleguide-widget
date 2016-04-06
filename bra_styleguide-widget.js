/**
 * bra_styleguide-widget.js v1.0.0
 * https://github.com/brandung/bra_styleguide-widget.git
 *
 * This widget generates an online style guide
 * within the Capitan workflow
 *
 * @author: Simon Kemmerling
 *
 * Copyright 2016, brandung GmbH & Co. KG
 * http://www.brandung.de
 *
 * MIT License (MIT)
 */

(function ($) {

	var self = {
			settings: {
				mwCheckbox: '.mw-container__check',		// Selector: Checkbox on each module headline
				isStickyHeader: true,					// Boolean: set sticky header value
				stickyHeader: '.main-nav-wrapper',		// Selector: Sticky Header wrapper

				compParam: 'comp',						// String: URL Parameter name for single component
				hideParam: 'hide',						// String: URL Parameter name to hide the widget
				deleteParam: 'delete',					// String: URL Parameter name to delete hidden components

				dataEl: 'sg',
				dataSection: 'sg__section',
				dataComponent: 'sg__component',
				dataSubline: 'sg__subline',
				dataName: 'name',

				classes: {
					// Styleguide
					styleguide: 'sg',
					// Widget
					wgt: 'sg__wgt',
					wgtHeader: 'sg__wgt-header',
					wgtContainer: 'sg__wgt-container',
					wgtCheck: 'sg__wgt-check',
					// Widget controller elements
					ctrRemove: 'sg__ctr-remove',
					ctrOpen: 'sg__ctr-open',
					ctrGrid: 'sg__ctr-grid',
					ctrCheck: 'sg__ctr-check',
					// Gird
					showGrid: 'sg__show-grid',
					gridOverlay: 'sg__grid-overlay',
					// Headlines
					hl: 'sg__hl',
					hlSection: '--section',
					hlComponent: '--component',
					hlSubline: '--subline'
				}
			},
			tpl: {
				$col: '<div class="col-xs-3 col-sm-2 col-lg-1"></div>',	// Template: Col
				columns: 12												// Integer: Col counts
			}
		},
		_ ={};


	/**
	 * Append widget to body
	 * and bind event listener
	 */
	_.addWidget = function () {

		var cl = self.settings.classes;

		// DOM of widget
		self.settings.widget = $('<div class="' + cl.wgt + '">' +
			'<div class="' + cl.wgtHeader + '">' +
			'	<h3>Styleguide</h3>' +
			'<span class="' + cl.ctrRemove + '" title="Remove">Remove</span>' +
			'<span class="' + cl.ctrGrid + '" title="Show grid">Show grid</span>' +
			'<span class="' + cl.ctrCheck + '" title="Toggle modules">Toggle modules</span>' +
			'<span class="' + cl.ctrOpen + '" title="Show module list">Open</span>' +
			'</div>' +
			'<div class="' + cl.wgtContainer + '">' +
			'</div>' +
			'</div>');


		// add section headlines
		_.addSectionHeaders();
		// add grid overlay
		_.addGrid();
		// append widget to body
		self.settings.widget.appendTo('body');

		// define selectors
		self.selectors = {
			$wgt: $('.' + cl.wgt),
			$wgtContainer: $('.' + cl.wgtContainer),
			$wgtCheck: $('.' + cl.wgtCheck),
			$dataRole: $('[data-role="' + self.settings.dataEl + '"]')
		};

		// get deep links
		_.getDeepLinks();
		// add event listener
		_.addListener();

		//TODO: switch get functions to public methodes
		// check if only one component should been showed
		_.showComponent();
		// check if widget should be hidden
		_.hideWidget();
		// check if hidden components should be deleted
		_.deleteComponents();
	};

	/**
	 * Add headlines to sections and components
	 * Used the 'data-type' value for separation
	 *
	 * @private
	 */
	_.addSectionHeaders = function () {

		var cl = self.settings.classes;

		$('[data-role="' + self.settings.dataEl + '"]').each(function() {
			var $this = $(this),
				type = $this.data('type');

			switch(type) {
				case self.settings.dataComponent:
					$this.prepend('<h3 class="' + cl.hl + ' ' + cl.hl + cl.hlComponent + '">' + $this.data(self.settings.dataName) + '</h3>');
					break;
				case self.settings.dataSubline:
					$this.prepend('<h4 class="' + cl.hl + ' ' + cl.hl + cl.hlSubline + '">' + $this.data(self.settings.dataName) + '</h4>');
					break;
				default:
					$this.prepend('<h2 class="' + cl.hl + ' ' + cl.hl + cl.hlSection + '">' + $this.data(self.settings.dataName) + '</h2>');
			}

			if($this.data('headline') == 'hidden') {
				$this.find('.' + cl.hl).hide();
			}
		});
	};

	/**
	 * Build grid overlay markup
	 * and append it to the body
	 *
	 * @private
	 */
	_.addGrid = function () {
		var cl = self.settings.classes;

		function buildCols() {
			var cols = '';
			for (var i=0; i< self.tpl.columns; i++) {
				cols += self.tpl.$col + '\n';
			}
			return cols;
		}

		var grid = [
			'<div class="' + cl.gridOverlay + '">',
			//'<main>',
			'<div class="container">',
			'<div class="row">',
			'' + buildCols() + '',
			'</div>',
			'</div>',
			//'</main>',
			'</div>'
		].join("\n");

		// store grid in settings object
		self.settings.grid = $(grid);
		// append grid to body
		self.settings.grid.appendTo('body');
	};


	/**
	 * Show only single component
	 *
	 * @private
	 */
	_.showComponent = function () {
		if(_.getParam(self.settings.compParam)) {
			// hide all components
			self.settings.widget.find('.mw-check').click();

			// hide headlines
			$(self.settings.deepLinkObj).hide();

			// show single component if string matched
			$(self.settings.mwCheckbox).each(function() {

				var _this = $(this),
					selfText = $.trim(_this.prev().text());

				if(selfText.toLowerCase() === _.getParam(self.settings.compParam).toLowerCase()) {
					_this.click();
					return false;
				}
			});
		}
	};


	/**
	 * Show widget
	 *
	 * @private
	 */
	_.hideWidget = function () {
		if(_.getParam(self.settings.hideParam) === 'true') {
			self.settings.widget.remove();
		}
	};


	/**
	 * Show widget
	 *
	 * @private
	 */
	_.deleteComponents = function () {
		if(_.getParam(self.settings.deleteParam) === 'true') {
			$('.mw-wrapper:hidden').remove();
		}
	};


	/**
	 * Add Event Listener
	 *
	 * @private
	 */
	_.addListener = function () {
		var cl = self.settings.classes;
	
		// handle breakpoint change
		Capitan.Vars.$doc.on('on-changed-breakpoint', _.handleBreakpointChange);

		// open widget
		self.settings.widget.find('.' + cl.ctrOpen).on('click', function () {
			$(this).toggleClass('is-active');
			self.selectors.$wgt.toggleClass('is-open');
		});

		// toggle modules
		self.settings.widget.find('.' + cl.ctrCheck).on('click', function () {
			$(this).toggleClass('is-active');
			_.toggleModules();
		});

		// toggle grid
		self.settings.widget.find('.' + cl.ctrGrid).on('click', function () {
			$(this).toggleClass('is-active');
			$('body').toggleClass(self.settings.classes.showGrid);
		});

		// remove widget
		self.settings.widget.find('.' + cl.ctrRemove).on('click', function () {
			self.settings.widget.remove();
			self.settings.grid.remove();
			$('body').removeClass(self.settings.classes.styleguide);
		});

		// show/hide specific module
		$('body').on('change', self.selectors.$wgtCheck.selector, function () {
			var $this = $(this);

			 _.showHideModules.call($this);
		});
	};

	/**
	 * Show or Hide modules.
	 * Checked also child elements of triggered sections
	 *
	 * @private
	 */
	_.showHideModules = function () {
		var $this = this,
			selfText = $.trim($this.prev().text()),
			isVisible = $this.is(":checked"),
			isSection = ($this.parent().data('listtype') == self.settings.dataSection),
			$compEl = null;

		// check if triggered element is type section or component
		if(isSection) {
			// find all section child components
			$compEl = $this.parent().nextUntil('[data-listtype="' + self.settings.dataSection + '"]');
		} else {
			// find previous section of triggered component
			$compEl = $this.parent().prevAll('[data-listtype="' + self.settings.dataSection + '"]:first');
		}


		// show or hide all selected modules
		if(isVisible) {
			// the triggered one
			$('[data-name="' + selfText + '"]').show();
			// the siblings
			$compEl.each(function () {

				var $that = $(this),
					elTxt = $.trim($that.text());

				console.log(elTxt);

				$that.find('input').prop('checked', true);
				$('[data-name="' + elTxt + '"]').show();
			});
		} else {
			// the triggered one
			$('[data-name="' + selfText + '"]').hide();
			// the siblings
			if (isSection){
				$compEl.each(function () {
					var $that = $(this),
						elTxt = $.trim($that.text());
					$that.find('input').prop('checked', false);
					$('[data-name="' + elTxt + '"]').hide();
				});
			}
		}
	};


	/**
	 * Toggle all modules
	 *
	 * @private
	 */
	_.toggleModules = function () {
		var cl = self.settings.classes;

		if (self.settings.widget.find('.' + cl.ctrCheck).hasClass('is-active')) {
			self.settings.widget.find('.' + cl.wgtCheck).each(function (){
				$(this).prop('checked', false).change();
			});
		} else {
			self.settings.widget.find('.' + cl.wgtCheck).each(function (){
				$(this).prop('checked', true).change();
			});
		}
	};


	/**
	 * Get all modules and append the links
	 * to the widget container
	 *
	 * @private
	 */
	_.getDeepLinks = function () {
		var cl = self.settings.classes,
			links = $('<ul></ul>');

		self.selectors.$dataRole.each(function () {
			var $this = $(this),
				text = $this.data(self.settings.dataName);

			if(!/^\d+\.\W/ig.test(text)) {
				text = '&nbsp;&nbsp;&nbsp; ' + text;
			}

			$('<li data-listtype="' + $this.data('type') + '">' +
				'<span>' + text + '</span>' +
				'<input class="' + cl.wgtCheck + '" type="checkbox" checked name="text" />' +
				'</li>').appendTo(links);
		});

		links.find('li').on('click', function () {
			var $this = $(this),
				selfText = $.trim($this.text()),
				headerHeight = 0;

			console.log(selfText);

			// if sticky header is in use get height of sticky element
			if (self.settings.isStickyHeader) {
				headerHeight = $(self.settings.stickyHeader).height()
			}

			// get element top position
			// and scroll to it
			self.selectors.$dataRole.each(function () {
				if ($(this).data(self.settings.dataName) === selfText) {
					var topPos = $(this).offset().top - headerHeight;

					$('body').stop().animate({'scrollTop': topPos}, 'fast', function () {
						return false;
					});

					return false;
				}
			})
		});

		// append to widget container
		links.appendTo(self.selectors.$wgtContainer);
	};


	/**
	 * Show/Hide Widget on breakpoint change
	 *
	 * @private
	 */
	_.handleBreakpointChange = function () {
		if(Capitan.Function.assertBreakpoint('lt', 'md')) {
			//self.settings.widget.hide();
			self.selectors.$wgt.addClass('is-mobile');
		} else {
			//self.settings.widget.show();
			self.selectors.$wgt.removeClass('is-mobile');
		}
	};


	/**
	 * Get URL parameter value
	 *
	 * @param name
	 * @returns {*}
	 */
	_.getParam = function (name) {

		var params = window.location.search.substr(1).split('&');
		for (var i = 0; i < params.length; i++) {
			var path = params[i].split('=');
			if (path[0] == name) {
				return decodeURIComponent(path[1]);
			}
		}

		return false;
	};


	/**
	 * init the plugin
	 *
	 * @param {object} settings
	 */
	self.init = function (settings) {
		var cl = self.settings.classes;

		self.settings = $.extend(self.settings, settings);
		$('body').addClass(cl.styleguide);

		_.addWidget();
		_.handleBreakpointChange();
	};

	return self;

})(jQuery).init();
