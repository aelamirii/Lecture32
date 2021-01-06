(function () {
'use strict';

angular.module('ShoppingListApp', [])
.controller('ShoppingListController', ShoppingListController)
.factory('ShoppingListFactory', ShoppingListFactory)
.directive('shoppingList', ShoppingList)
;



function ShoppingList() {

  var ddo = {
    templateUrl: 'shoppingList3.html',
    scope: {
      listDirective: '<',
      titleDirective: '@',
      onRemove: '&'
    },
    controller: ShoppingListDirectiveController,
    controllerAs: 'ListDirectiveController',
    bindToController: true,
    link: ShoppingListDirectiveLink,
    transclude: true
  };
  return ddo;
};


function ShoppingListDirectiveLink(scope, element, attrs, controller) {

  console.log("scope : ", scope);
  console.log("element : ", element);
  console.log("attrs : ", attrs);
  console.log("controller : ", controller);

  scope.$watch('ListDirectiveController.findcookies()', function (newValue, odlValue) {

    console.log("Old Value :", odlValue);
    console.log("New Value :", newValue);

    if(newValue === true)
    {
      DisplayWarningcookies();
    }
    else {
      RemoveWarningcookies();
    }

  });


  function DisplayWarningcookies() {
    // Using JqLite
    // var WarningElement = element.find("div");
    // WarningElement.css("display", "block");

    // Using jQuery
    var WarningElement = element.find("div.error");
    WarningElement.slideDown(800);

  };


  function RemoveWarningcookies() {
    // Using JqLite
    // var WarningElement = element.find("div");
    // WarningElement.css("display", "none");

    // Using jQuery
    var WarningElement = element.find("div.error");
    WarningElement.slideUp(800);

  };

};






function ShoppingListDirectiveController() {

  var list_temps = this;

  list_temps.findcookies = function  () {

    for (var i = 0; i < list_temps.listDirective.getItems.length; i++) {
      var name = list_temps.listDirective.getItems[i].name;
      if(name.toLowerCase().indexOf("cookies") !== -1)
      return true;
    }
    return false;
  };

};



ShoppingListController.$inject = ['ShoppingListFactory'];
function ShoppingListController(ShoppingListFactory) {

  var list = this;

  var ShoppingList = ShoppingListFactory();

  list.ItemName = "";
  list.ItemQuantity = "";

  list.getItems = ShoppingList.getItems();

  var Org_Title = "Shopping List 1 ";
  list.titleController = Org_Title + "("+ list.getItems.length +")";

  list.WarningMessage = "WArning , cookies detected ......................";

  list.addItem = function () {
    try {
      ShoppingList.addItem(list.ItemName , list.ItemQuantity );
      list.titleController = Org_Title + "("+ list.getItems.length +")";
    } catch (e) {
      list.errorMessage = e.message;
    } finally {

    }
  };

  list.RemoveItem = function (indexItem) {
    console.log("this is :", this);
    this.LasRemoved = "Last item removed was :"+ list.getItems[indexItem].name;
    ShoppingList.RemoveItem(indexItem);
    list.errorMessage = "";
    this.titleController = Org_Title + "("+ list.getItems.length +")";
  };

};





function ShoppingList_Service(maxItems) {

  var service = this;

  var Items = [];

  service.addItem = function (itemName, itemQuantity) {

    if( ( maxItems === undefined ) ||
        ( maxItems !== undefined && Items.length < maxItems )
    )
    {
      var item = {
        name: itemName,
        quantity: itemQuantity
      };

      Items.push(item);
    }
    else {
      throw new Error("Max items ("+ Items.length +") was reached ");
    }

  };

  service.getItems = function () {
    return Items;
  };

  service.RemoveItem = function (indexItem) {
    Items.splice( indexItem, 1 );
  };

};


function ShoppingListFactory() {

  var factory = function (maxItems) {
    return new ShoppingList_Service(maxItems);
  };
  return factory;
};



})();
