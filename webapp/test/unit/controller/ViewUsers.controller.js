/*global QUnit*/

sap.ui.define([
	"com/eliannis/user/users/controller/ViewUsers.controller"
], function (Controller) {
	"use strict";

	QUnit.module("ViewUsers Controller");

	QUnit.test("I should test the ViewUsers controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
