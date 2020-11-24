/*
 * Copyright (c) 2014
 *
 * This file is licensed under the Affero General Public License version 3
 * or later.
 *
 * See the COPYING-README file.
 *
 */

(function() {

	var TEMPLATE_MENU =
		'<ul>' +
		'{{#each items}}' +
		'<li>' +
			'<a href="#" class="menuitem action action-{{nameLowerCase}} permanent" data-action="{{name}}">' +
				'{{#if icon}}<img class="icon" src="{{icon}}"/>' +
				'{{else}}'+
					'{{#if iconClass}}' +
						'<span class="icon {{iconClass}}"></span>' +
					'{{else}}' +
						'<span class="no-icon"></span>' +
					'{{/if}}' +
				'{{/if}}' +
				'<span>{{displayName}}</span>' +
		'	</a>' +
		'</li>' +
		'{{/each}}' +
		'</ul>';

	/**
	 * Construct a new FileActionsAppDrawer instance
	 * @constructs FileActionsAppDrawer
	 * @memberof OCA.Files
	 */
	var FileActionsAppDrawer = OC.Backbone.View.extend({
		tagName: 'div',
		className: 'fileActionsAppDrawerMenu hidden',

		/**
		 * Current context
		 *
		 * @type OCA.Files.FileActionContext
		 */
		_context: null,

		events: {
			'click a.action': '_onClickAction'
		},

		template: function(data) {
			if (!OCA.Files.FileActionsMenu._TEMPLATE) {
				OCA.Files.FileActionsMenu._TEMPLATE = Handlebars.compile(TEMPLATE_MENU);
			}
			return OCA.Files.FileActionsMenu._TEMPLATE(data);
		},

		/**
		 * Event handler whenever an action has been clicked within the App Drawer
		 *
		 * @param {Object} event event object
		 */
		_onClickAction: function(event) {
			var $target = $(event.target);
			if (!$target.is('a')) {
				$target = $target.closest('a');
			}
			var fileActions = this._context.fileActions;
			var actionName = $target.attr('data-action');
			var actions = fileActions.getActions(
				fileActions.getCurrentMimeType(),
				fileActions.getCurrentType(),
				fileActions.getCurrentPermissions()
			);
			var actionSpec = actions[actionName];
			var fileName = this._context.$file.attr('data-file');

			event.stopPropagation();
			event.preventDefault();

			OC.hideMenus();
			console.log(this._context);
			actionSpec.action(
				fileName,
				this._context
			);
		},

		render: function() {
			var fileActions = this._context.fileActions;
			var mime = fileActions.getCurrentMimeType();
			var type = fileActions.getCurrentType();
			var permissions = fileActions.getCurrentPermissions();
			var actions = fileActions.getActions(mime,type, permissions, true);
			var items = [];

			Object.keys(actions).forEach(function (actionKey){
				items.push(actions[actionKey]);
			});

			this.$el.html(this.template({
				items: items
			}));
		},

		/**
		 * Displays the App Drawer menu.
		 *
		 * @param {OCA.Files.FileActionContext} context context
		 */
		show: function(context) {
			this._context = context;

			this.render();
			this.$el.removeClass('hidden');
			OC.Util.scrollIntoView(this.$el, null);
			OC.showMenu(null, this.$el);
		}
	});

	OCA.Files.FileActionsAppDrawer = FileActionsAppDrawer;

})();

