var API_URL=window.location.origin+"/api/v1/";!function(){angular.module("bookmarksApp",["ngRoute","angucomplete-alt","ui.ace"])}(),$(function(){function e(){function e(e){var t;return t=e.indexOf("://")>-1?e.split("/")[2]:e.split("/")[0],t=t.split(":")[0],window.location.protocol+"//"+t+"/"}var t="";t+="(",t+=" function() {",t+=' 	l="'+e(window.location.href)+'#/bookmark/add?title="+encodeURIComponent(document.title)+"&link="+encodeURIComponent(window.location.href);',t+=' 	var e=window.open(l+"&window=1","EasyBookmarkManager","location=0,links=0,scrollbars=0,toolbar=0,width=594,height=600");',t+=" }",t+=")()",$("a.bookmark-me-link").attr("href","javascript:"+encodeURIComponent(t))}e()}),function(){var e=function(e,t,n,r,o,a,i,s){e.viewReady=!1,e.errorMessage="",e.goodMessage="",e.globalGoodMessage="",e.globalErrorMessage="",e.newItem=!1,e.fromWindow=!1,e.canViewSnippet=!1,e.categories=[],e.busyWithAction=!1,e.duplicates=[],e.bookmark={favourite:!1,title:n.title||"",link:n.link||"",snippet:"",category:"",tags:[]},this.run=function(){i.fetchCategories().then(function(t){"ok"==t.result&&(e.categories=t.data.categories)}),e.newItem?i.checkDuplicates(e.bookmark).then(function(t){"ok"==t.result&&"undefined"!=typeof t.data&&(e.duplicates=t.data.bookmarks)}):i.fetchBookmark(n.bookmarkId||"").then(function(t){if(e.globalErrorMessage="","ok"!=t.result)return e.globalErrorMessage=t.message,void(e.viewReady=!1);e.bookmark=t.data.bookmark;var n=e.bookmark.snippet||"";""!==n&&(e.canViewSnippet=!0)}),e.viewReady=!0},e.checkStatus=function(){"undefined"!=typeof n.bookmarkId&&""!==n.bookmarkId||(e.newItem=!0),1==n.window&&(e.fromWindow=!0,$("div.row.container-header h1 .hide-for-window").hide())},e.closeWindow=function(){window.close()},e.cancelUpdate=function(){e.busyWithAction=!0,t.path("/")},e.enableSnippet=function(){e.canViewSnippet=!0},e.deleteBookmark=function(){e.busyWithAction=!0,e.viewReady=!1,i.deleteBookmark(n.bookmarkId||"",e.bookmark).then(function(n){if(e.errorMessage="","ok"!=n.result)return e.errorMessage=n.message,e.viewReady=!0,void(e.busyWithAction=!1);e.globalGoodMessage="Deleted, redirecting...";var r=o(function(){o.cancel(r),t.path("/")},1e3)})},e.categorySelect=function(t){t?"object"==typeof t.originalObject?e.bookmark.category=t.originalObject.name:e.bookmark.category=t.originalObject:e.bookmark.category=""},e.createBookmark=function(){e.busyWithAction=!0,e.goodMessage="",e.errorMessage="",i.createBookmark(e.bookmark).then(function(n){if(e.errorMessage="","ok"!=n.result)return e.errorMessage=n.message,void(e.busyWithAction=!1);var r;return e.newItem&&1==e.fromWindow?(e.goodMessage="Created, closing...",void(r=o(function(){o.cancel(r),window.close()},1e3))):(e.goodMessage="Created",void(r=o(function(){o.cancel(r),t.path("/bookmark/edit/"+n.data.bookmark.id)},1e3)))})},e.updateBookmark=function(r){e.busyWithAction=!0,e.goodMessage="",e.errorMessage="",i.updateBookmark(n.bookmarkId||"",e.bookmark).then(function(n){return e.errorMessage="","ok"!=n.result?(e.errorMessage=n.message,void(e.busyWithAction=!1)):(e.bookmark=n.data.bookmark,e.goodMessage="Updated",e.busyWithAction=!1,void(r&&(e.busyWithAction=!0,t.path("/"))))})},e.checkStatus();var l=this;a.checkLoginStatus().then(function(t){return e.errorMessage="","ok"!=t.result?e.newItem&&e.fromWindow?void(e.globalErrorMessage="No session found, please login via the browser."):(e.globalErrorMessage=t.message,void(s.location="/login")):void l.run()})};angular.module("bookmarksApp").controller("bookmarkEditController",["$scope","$location","$routeParams","$http","$interval","userService","bookmarkService","$window",e])}(),function(){var e=function(e,t){var n={fetchCategoriesAndTags:function(){return t.get(API_URL+"bookmarks/categories-and-tags").then(function(e){return e.data})},fetchCategories:function(){return t.get(API_URL+"categories").then(function(e){return e.data})},fetchTags:function(){return t.get(API_URL+"tags").then(function(e){return e.data})},fetchFilteredBookmarks:function(e,n,r,o,a){return t.get(API_URL+"bookmarks?categories="+e+"&tags="+n+"&search="+r+"&page="+o+"&limit="+a).then(function(e){return e.data})},fetchBookmark:function(e){return t.get(API_URL+"bookmark/"+e).then(function(e){return e.data})},createBookmark:function(e){return t.post(API_URL+"bookmark/create?"+$.param(e)).then(function(e){return e.data})},checkDuplicates:function(e){return t.get(API_URL+"bookmarks/duplicates?"+$.param(e)).then(function(e){return e.data})},updateBookmark:function(e,n){return t.put(API_URL+"bookmark/"+e+"?"+$.param(n)).then(function(e){return e.data})},deleteBookmark:function(e,n){return t["delete"](API_URL+"bookmark/"+e+"?"+$.param(n)).then(function(e){return e.data})},importBookmarks:function(e){return t.post(API_URL+"bookmarks/import?",e,{withCredentials:!0,headers:{"Content-Type":void 0},transformRequest:angular.identity}).then(function(e){return e.data})}};return n};angular.module("bookmarksApp").service("bookmarkService",["$location","$http",e])}(),function(){var e=function(e,t,n,r,o,a,i,s,l){e.categories=[],e.tags=[],e.bookmarks=[],e.viewReady=!1,e.busyImporting=!1,e.loadingBookmarks=!0,e.badDataResponse="",e.selectedCategories=[],e.selectedTags=[],e.bookmarkResults={page:1,maxPages:0,limit:10,totalCount:0},e.maxCloudTagValue=0,e.globalErrorMessage="",e.globalGoodMessage="";var u,c=a.getModel();e.search=c.search,e.bookmarkResults.page=c.pageNo,this.run=function(){r.checkLoginStatus().then(function(t){return e.errorMessage="","ok"!=t.result?(e.globalErrorMessage=t.message,void(l.location="/login")):(o.fetchCategoriesAndTags().then(function(t){if("ok"==t.result){e.categories=t.data.categories;for(var n=5;n<e.categories.length;n++)e.categories[n].hidden=!0;e.tags=t.data.tags.sort(function(){return.5-Math.random()})}}),e.fetchFilteredBookmarks(),void(e.viewReady=!0))})},e.loadMore=function(){for(var t=5;t<e.categories.length;t++)e.categories[t].hidden=!1},e.clearSearch=function(){e.search="",e.searchKeyUp(""),$("#searchText").val("")},e.fetchFilteredBookmarks=function(){e.bookmarks=null,e.loadingBookmarks=!0,e.badDataResponse="",o.fetchFilteredBookmarks(e.selectedCategories,e.selectedTags,e.search,e.bookmarkResults.page,e.bookmarkResults.limit).then(function(t){e.loadingBookmarks=!1,"ok"==t.result?(e.bookmarks=t.data.bookmarks,e.bookmarkResults.maxPages=Math.ceil(t.data.totalCount/e.bookmarkResults.limit),e.bookmarkResults.totalCount=t.data.totalCount):e.badDataResponse=t.message})},e.toggleTag=function(t){e.bookmarkResults.page=1,t.selected=!t.selected,-1!=e.selectedTags.indexOf(t.name)?e.selectedTags.splice(e.selectedTags.indexOf(t.name),1):e.selectedTags.push(t.name),e.fetchFilteredBookmarks()},e.calculateMaxCloudTagValue=function(){for(var t=0;t<e.tags.length;t++)parseInt(e.tags[t].count)>parseInt(e.maxCloudTagValue)&&(e.maxCloudTagValue=e.tags[t].count)},e.getCloudClass=function(t){if(e.tags.length<6)return"tag1";var n=5,r=Math.ceil(t.count*n/e.maxCloudTagValue);return"tag"+r},e.toggleCategory=function(t){e.bookmarkResults.page=1,t.selected=!t.selected,-1!=e.selectedCategories.indexOf(t.name)?e.selectedCategories.splice(e.selectedCategories.indexOf(t.name),1):e.selectedCategories.push(t.name),e.fetchFilteredBookmarks()},e.searchKeyUp=function(t){e.bookmarkResults.page=1,u&&s.cancel(u),u=s(function(){e.search=t,c.search=t,a.setModel(c),e.fetchFilteredBookmarks()},250)},e.newBookmark=function(){t.path("/bookmark/add")},e.logout=function(){l.location="/auth/logout"},e.nextPage=function(){e.bookmarkResults.page++,c.pageNo=e.bookmarkResults.page,a.setModel(c),e.fetchFilteredBookmarks()},e.prevPage=function(){e.bookmarkResults.page--,c.pageNo=e.bookmarkResults.page,a.setModel(c),e.fetchFilteredBookmarks()},e.editUser=function(){t.path("/user/edit")},e.editBookmark=function(e,n){return e.stopPropagation(),e.preventDefault(),t.path("/bookmark/edit/"+n.id),!1},e.gotoBookmark=function(t,n){if(t.stopPropagation(),t.preventDefault(),n.link){var r=window.open(n.link,"_blank");r.focus()}else e.editBookmark(t,n)},e.uploadFile=function(t){e.busyImporting=!0,e.globalErrorMessage="",e.globalGoodMessage="";var n=new FormData;n.append("bookmarkfile",t[0]),o.importBookmarks(n).then(function(t){if(e.busyImporting=!1,"ok"!=t.result)return void(e.globalErrorMessage=t.message);e.globalGoodMessage="Imported "+t.data.imported+" record(s), reloading...";var n=i(function(){i.cancel(n),l.location.reload()},1500)})},this.run()};angular.module("bookmarksApp").controller("bookmarkViewController",["$scope","$location","$http","userService","bookmarkService","sessionService","$interval","$timeout","$window",e])}(),function(){var e=function(){return function(e,t,n){var r=[];return(e||[]).forEach(function(e){var o=!1;(e.tags||[]).forEach(function(e){-1!=t.indexOf(e)&&(o=!0)});var a=!1;-1!=n.indexOf(e.category)&&(a=!0),0===n.length&&0===t.length?r.push(e):0===t.length&&a?r.push(e):0===n.length&&o?r.push(e):a&&o&&r.push(e)}),r}},t=function(){return function(e,t,n,r){if(!e)return"";if(n=parseInt(n,10),!n)return e;if(e.length<=n)return e;if(e=e.substr(0,n),t){var o=e.lastIndexOf(" ");-1!=o&&(e=e.substr(0,o))}return e+(r||" …")}};angular.module("bookmarksApp").filter("filterByTags",e),angular.module("bookmarksApp").filter("cut",t)}(),function(){var e=function(e){e.when("/",{templateUrl:"/views/bookmark-view.html",controller:"bookmarkViewController"}).when("/bookmark/edit/:bookmarkId",{templateUrl:"/views/bookmark-edit.html",controller:"bookmarkEditController"}).when("/bookmark/add",{templateUrl:"/views/bookmark-edit.html",controller:"bookmarkEditController"}).when("/user/edit",{templateUrl:"/views/user-edit.html",controller:"userEditController"}).otherwise({redirectTo:"/login"})};angular.module("bookmarksApp").config(["$routeProvider",e])}(),function(){var e=function(){var e={model:{theme:"",search:"",pageNo:1},setModel:function(e){this.model=e},getModel:function(){return this.model},clearModel:function(){this.model={theme:"",search:"",pageNo:1}}};return e};angular.module("bookmarksApp").service("sessionService",[e])}(),function(){var e=function(e,t,n,r,o){e.errorMessage="",e.goodMessage="",e.busyWithAction=!0,e.profile={name:"",email:"",theme:"",password1:"",password2:""};var a=localStorage.getItem("theme")||"bootstrap-yeti";e.profile.theme=a,o.getDetails().then(function(t){return e.busyWithAction=!1,"ok"!=t.result?void(e.errorMessage=t.message):(e.profile.name=t.data.user.name,void(e.profile.email=t.data.user.email))}),e.updateUser=function(){if(e.errorMessage="",e.goodMessage="",e.profile.password1.length>0){if(e.profile.password1.length<5)return void(e.errorMessage="Your new password must be at least 5 characters");if(e.profile.password1.search(/[a-z]/i)<0)return void(e.errorMessage="Your new password must contain at least one letter");if(e.profile.password1.search(/[0-9]/)<0)return void(e.errorMessage="Your new password must contain at least one digit");if(e.profile.password1!=e.profile.password2)return void(e.errorMessage="Both passwords must match")}e.busyWithAction=!0,o.updateDetails(e.profile).then(function(t){return e.busyWithAction=!1,"ok"!=t.result?void(e.errorMessage=t.message):(e.goodMessage="Details updated.",e.profile.password1="",void(e.profile.password2=""))})},e.changeTheme=function(t){localStorage.setItem("theme",t),e.profile.theme=t,$(".custom-css").remove(),loadTheme()},e.cancelUpdate=function(){e.busyWithAction=!0,t.path("/")}};angular.module("bookmarksApp").controller("userEditController",["$scope","$location","$http","$interval","userService",e])}(),function(){var e=function(e,t){var n={getDetails:function(){return t.get(API_URL+"user").then(function(e){return e.data})},updateDetails:function(e){return t.put(API_URL+"user?"+$.param(e)).then(function(e){return e.data})},checkLoginStatus:function(){return t.get(API_URL+"user/status?").then(function(e){return e.data})}};return n};angular.module("bookmarksApp").service("userService",["$location","$http",e])}(),function(e,t){"undefined"!=typeof module&&module.exports?module.exports=t(require("angular")):"function"==typeof define&&define.amd?define(["angular"],t):t(e.angular)}(window,function(e){e.module("angucomplete-alt",[]).directive("angucompleteAlt",["$q","$parse","$http","$sce","$timeout","$templateCache","$interpolate",function(e,t,n,r,o,a,i){function s(t,a,i,s){function y(e,n){e&&("object"==typeof e?(t.searchStr=A(e),R({originalObject:e})):"string"==typeof e&&e.length>0?t.searchStr=e:console&&console.error,U(!0))}function C(e){ge=null,t.hideResults(e),document.body.removeEventListener("click",C)}function I(e){return e.which?e.which:e.keyCode}function R(e){"function"==typeof t.selectedObject?t.selectedObject(e):t.selectedObject=e,U(e?!0:!1)}function $(e){return function(n){return t[e]?t[e](n):n}}function x(e){R({originalObject:e}),t.clearSelected&&(t.searchStr=null),G()}function A(e){return t.titleField.split(",").map(function(t){return M(e,t)}).join(" ")}function M(e,t){var n,r;if(t){n=t.split("."),r=e;for(var o=0;o<n.length;o++)r=r[n[o]]}else r=e;return r}function D(e,n){var o,a,i;return i=new RegExp(n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"i"),e?(e.match&&e.replace||(e=e.toString()),a=e.match(i),o=a?e.replace(i,'<span class="'+t.matchClass+'">'+a[0]+"</span>"):e,r.trustAsHtml(o)):void 0}function U(e){t.notEmpty=e,le=t.searchStr,t.fieldRequired&&s&&t.inputName&&s[t.inputName].$setValidity(se,e)}function F(e){var n=I(e);if(n!==d&&n!==u)if(n===c||n===f)e.preventDefault();else if(n===l)e.preventDefault(),!t.showDropdown&&t.searchStr&&t.searchStr.length>=ae&&(z(),t.searching=!0,Z(t.searchStr));else if(n===g)G(),t.$apply(function(){oe.val(t.searchStr)});else{if(0===ae&&!t.searchStr)return;t.searchStr&&""!==t.searchStr?t.searchStr.length>=ae&&(z(),ie&&o.cancel(ie),t.searching=!0,ie=o(function(){Z(t.searchStr)},t.pause)):t.showDropdown=!1,le&&le!==t.searchStr&&!t.clearSelected&&t.$apply(function(){R()})}}function B(e){!t.overrideSuggestions||t.selectedObject&&t.selectedObject.originalObject===t.searchStr||(e&&e.preventDefault(),o.cancel(ie),j(),x(t.searchStr))}function O(e){var t=getComputedStyle(e);return e.offsetHeight+parseInt(t.marginTop,10)+parseInt(t.marginBottom,10)}function L(){return ce.getBoundingClientRect().top+parseInt(getComputedStyle(ce).maxHeight,10)}function E(){return a[0].querySelectorAll(".angucomplete-row")[t.currentIndex]}function T(){return E().getBoundingClientRect().top-(ce.getBoundingClientRect().top+parseInt(getComputedStyle(ce).paddingTop,10))}function P(e){ce.scrollTop=ce.scrollTop+e}function W(){var e=t.results[t.currentIndex];t.matchClass?oe.val(A(e.originalObject)):oe.val(e.title)}function _(e){var n=I(e),r=null,o=null;n===f&&t.results?(t.currentIndex>=0&&t.currentIndex<t.results.length?(e.preventDefault(),t.selectResult(t.results[t.currentIndex])):(B(e),G()),t.$apply()):n===l&&t.results?(e.preventDefault(),t.currentIndex+1<t.results.length&&t.showDropdown&&(t.$apply(function(){t.currentIndex++,W()}),de&&(r=E(),L()<r.getBoundingClientRect().bottom&&P(O(r))))):n===c&&t.results?(e.preventDefault(),t.currentIndex>=1?(t.$apply(function(){t.currentIndex--,W()}),de&&(o=T(),0>o&&P(o-1))):0===t.currentIndex&&t.$apply(function(){t.currentIndex=-1,oe.val(t.searchStr)})):n===m?t.results&&t.results.length>0&&t.showDropdown?-1===t.currentIndex&&t.overrideSuggestions?B():(-1===t.currentIndex&&(t.currentIndex=0),t.selectResult(t.results[t.currentIndex]),t.$digest()):t.searchStr&&t.searchStr.length>0&&B():n===g&&e.preventDefault()}function N(e){return function(n,r,o,a){r||o||a||!n.data||(n=n.data),t.searching=!1,J(M(ee(n),t.remoteUrlDataField),e)}}function q(e,n,r,o){0!==n&&-1!==n&&(n||r||o||(n=e.status),t.remoteUrlErrorCallback?t.remoteUrlErrorCallback(e,n,r,o):console&&console.error)}function j(){ue&&ue.resolve()}function V(r){var o={},a=t.remoteUrl+encodeURIComponent(r);t.remoteUrlRequestFormatter&&(o={params:t.remoteUrlRequestFormatter(r)},a=t.remoteUrl),t.remoteUrlRequestWithCredentials&&(o.withCredentials=!0),j(),ue=e.defer(),o.timeout=ue.promise,n.get(a,o).success(N(r)).error(q)}function H(n){j(),ue=e.defer(),t.remoteApiHandler(n,ue.promise).then(N(n))["catch"](q)}function G(){t.showDropdown=!1,t.results=[],ce&&(ce.scrollTop=0)}function z(){t.showDropdown=ne,t.currentIndex=t.focusFirst?0:-1,t.results=[]}function Y(e){var n,r,o,a,i=t.searchFields.split(","),s=[];for("undefined"!=typeof t.parseInput()&&(e=t.parseInput()(e)),n=0;n<t.localData.length;n++){for(r=!1,o=0;o<i.length;o++)a=M(t.localData[n],i[o])||"",r=r||a.toString().toLowerCase().indexOf(e.toString().toLowerCase())>=0;r&&(s[s.length]=t.localData[n])}t.searching=!1,J(s,e)}function K(e,n,r){if(!r)return!1;for(var o in n)if(n[o].toLowerCase()===r.toLowerCase())return t.selectResult(e),!0;return!1}function Z(e){!e||e.length<ae||(t.localData?t.$apply(function(){Y(e)}):t.remoteApiHandler?H(e):V(e))}function J(e,n){var r,o,a,i,s,l;if(e&&e.length>0)for(t.results=[],r=0;r<e.length;r++)t.titleField&&""!==t.titleField&&(i=s=A(e[r])),o="",t.descriptionField&&(o=l=M(e[r],t.descriptionField)),a="",t.imageField&&(a=M(e[r],t.imageField)),t.matchClass&&(s=D(i,n),l=D(o,n)),t.results[t.results.length]={title:s,description:l,image:a,originalObject:e[r]};else t.results=[];t.autoMatch&&1===t.results.length&&K(t.results[0],{title:i,desc:o||""},t.searchStr)?t.showDropdown=!1:0!==t.results.length||re?t.showDropdown=!0:t.showDropdown=!1}function Q(){t.localData?J(t.localData,""):t.remoteApiHandler?H(""):V("")}var X,ee,te,ne,re,oe=a.find("input"),ae=p,ie=null,se=b,le=null,ue=null,ce=a[0].querySelector(".angucomplete-dropdown"),de=!1,ge=null;a.on("mousedown",function(e){e.target.id?(ge=e.target.id,ge===t.id+"_dropdown"&&document.body.addEventListener("click",C)):ge=e.target.className}),t.currentIndex=t.focusFirst?0:null,t.searching=!1,te=t.$watch("initialValue",function(e){e&&(te(),y(e,!0))}),t.$watch("fieldRequired",function(e,n){e!==n&&(e?U(le&&-1!==t.currentIndex?!0:!1):s[t.inputName].$setValidity(se,!0))}),t.$on("angucomplete-alt:clearInput",function(e,n){n&&n!==t.id||(t.searchStr=null,R(),U(!1),G())}),t.$on("angucomplete-alt:changeInput",function(e,n,r){n&&n===t.id&&y(r)}),t.onFocusHandler=function(){t.focusIn&&t.focusIn(),0!==ae||t.searchStr&&0!==t.searchStr.length||(t.currentIndex=t.focusFirst?0:t.currentIndex,t.showDropdown=!0,Q())},t.hideResults=function(){ge&&(ge===t.id+"_dropdown"||ge.indexOf("angucomplete")>=0)?ge=null:(X=o(function(){G(),t.$apply(function(){t.searchStr&&t.searchStr.length>0&&oe.val(t.searchStr)})},v),j(),t.focusOut&&t.focusOut(),t.overrideSuggestions&&t.searchStr&&t.searchStr.length>0&&-1===t.currentIndex&&B())},t.resetHideResults=function(){X&&o.cancel(X)},t.hoverRow=function(e){t.currentIndex=e},t.selectResult=function(e){t.matchClass&&(e.title=A(e.originalObject),e.description=M(e.originalObject,t.descriptionField)),t.clearSelected?t.searchStr=null:t.searchStr=e.title,R(e),G()},t.inputChangeHandler=function(e){return e.length<ae?(j(),G()):0===e.length&&0===ae&&(t.searching=!1,Q()),t.inputChanged&&(e=t.inputChanged(e)),e},t.fieldRequiredClass&&""!==t.fieldRequiredClass&&(se=t.fieldRequiredClass),t.minlength&&""!==t.minlength&&(ae=parseInt(t.minlength,10)),t.pause||(t.pause=k),t.clearSelected||(t.clearSelected=!1),t.overrideSuggestions||(t.overrideSuggestions=!1),t.fieldRequired&&s&&U(t.initialValue?!0:!1),t.inputType=i.type?i.type:"text",t.textSearching=i.textSearching?i.textSearching:w,t.textNoResults=i.textNoResults?i.textNoResults:S,ne="false"!==t.textSearching,re="false"!==t.textNoResults,t.maxlength=i.maxlength?i.maxlength:h,oe.on("keydown",_),oe.on("keyup",F),ee=$("remoteUrlResponseFormatter"),o(function(){var e=getComputedStyle(ce);de=e.maxHeight&&"auto"===e.overflowY})}var l=40,u=39,c=38,d=37,g=27,f=13,m=9,p=3,h=524288,k=500,v=200,b="autocomplete-required",w="Searching...",S="No results found",y="/angucomplete-alt/index.html";return a.put(y,'<div class="angucomplete-holder" ng-class="{\'angucomplete-dropdown-visible\': showDropdown}">  <input id="{{id}}_value" name="{{inputName}}" ng-class="{\'angucomplete-input-not-empty\': notEmpty}" ng-model="searchStr" ng-disabled="disableInput" type="{{inputType}}" placeholder="{{placeholder}}" maxlength="{{maxlength}}" ng-focus="onFocusHandler()" class="{{inputClass}}" ng-focus="resetHideResults()" ng-blur="hideResults($event)" autocapitalize="off" autocorrect="off" autocomplete="off" ng-change="inputChangeHandler(searchStr)"/>  <div id="{{id}}_dropdown" class="angucomplete-dropdown" ng-show="showDropdown">    <div class="angucomplete-searching" ng-show="searching" ng-bind="textSearching"></div>    <div class="angucomplete-searching" ng-show="!searching && (!results || results.length == 0)" ng-bind="textNoResults"></div>    <div class="angucomplete-row" ng-repeat="result in results" ng-click="selectResult(result)" ng-mouseenter="hoverRow($index)" ng-class="{\'angucomplete-selected-row\': $index == currentIndex}">      <div ng-if="imageField" class="angucomplete-image-holder">        <img ng-if="result.image && result.image != \'\'" ng-src="{{result.image}}" class="angucomplete-image"/>        <div ng-if="!result.image && result.image != \'\'" class="angucomplete-image-default"></div>      </div>      <div class="angucomplete-title" ng-if="matchClass" ng-bind-html="result.title"></div>      <div class="angucomplete-title" ng-if="!matchClass">{{ result.title }}</div>      <div ng-if="matchClass && result.description && result.description != \'\'" class="angucomplete-description" ng-bind-html="result.description"></div>      <div ng-if="!matchClass && result.description && result.description != \'\'" class="angucomplete-description">{{result.description}}</div>    </div>  </div></div>'),{restrict:"EA",require:"^?form",scope:{selectedObject:"=",disableInput:"=",initialValue:"=",localData:"=",remoteUrlRequestFormatter:"=",remoteUrlRequestWithCredentials:"@",remoteUrlResponseFormatter:"=",remoteUrlErrorCallback:"=",remoteApiHandler:"=",id:"@",type:"@",placeholder:"@",remoteUrl:"@",remoteUrlDataField:"@",titleField:"@",descriptionField:"@",imageField:"@",inputClass:"@",pause:"@",searchFields:"@",minlength:"@",matchClass:"@",clearSelected:"@",overrideSuggestions:"@",fieldRequired:"=",fieldRequiredClass:"@",inputChanged:"=",autoMatch:"@",focusOut:"&",focusIn:"&",inputName:"@",focusFirst:"@",parseInput:"&"},templateUrl:function(e,t){return t.templateUrl||y},compile:function(e){var t=i.startSymbol(),n=i.endSymbol();if("{{"!==t||"}}"!==n){var r=e.html().replace(/\{\{/g,t).replace(/\}\}/g,n);e.html(r)}return s}}}])}),function(){var e=function(e,t){return{restrict:"EA",scope:{controltags:"=tagsattribute",newitem:"=newitemattribute"},replace:!1,link:function(e,n){var r=0,o=[];this.initSelect2=function(e,t){$(".loading-tags").hide(),$(e).select2({placeholder:"Add tags...",allowClear:!0,tags:!0,data:t})},e.$watch("newitem",function(e){e&&0===o.length&&t.fetchTags().then(function(e){if("ok"==e.result)for(var t=0;t<e.data.tags.length;t++){var r=e.data.tags[t].name;o.push({id:r,text:r,selected:!1})}this.initSelect2(n,o)})}),e.$watch("controltags",function(e){var a=e||null;r++,r>1&&0===o.length&&t.fetchTags().then(function(e){var t;for(t=0;t<a.length;t++)o.push({id:a[t],text:a[t],selected:!0});if("ok"==e.result)for(t=0;t<e.data.tags.length;t++){for(var r=e.data.tags[t].name,i=!1,s=0;s<o.length;s++)if(o[s].text==r){i=!0;break}i||o.push({id:r,text:r,selected:!1})}this.initSelect2(n,o)})})}}};angular.module("bookmarksApp").directive("customSelect2",["$timeout","bookmarkService",e])}(),function(){var e=function(){return{restrict:"E",scope:{tags:"="},templateUrl:"/views/tagmanager-directive.html",link:function(e,t){angular.element(t.children()[1]);e.add=function(){if(!e.new_value)return void(e.new_value="");var t=new RegExp("^[A-Za-z][A-Za-z0-9\\_]{1,}$");if(t.test(e.new_value)&&-1===e.tags.indexOf(e.new_value)){var n=!1;e.tags.forEach(function(t){t.toLowerCase()==e.new_value.toLowerCase()&&(n=!0)}),n||(e.tags.push(e.new_value),e.new_value="")}},e.remove=function(t){e.tags.splice(t,1)}}}};angular.module("bookmarksApp").directive("tagManager",e)}(),angular.module("ui.ace",[]).constant("uiAceConfig",{}).directive("uiAce",["uiAceConfig",function(e){if(angular.isUndefined(window.ace))throw new Error("ui-ace need ace to work... (o rly?)");var t=function(e,t,n){if(angular.isDefined(n.workerPath)){var r=window.ace.require("ace/config");r.set("workerPath",n.workerPath)}angular.isDefined(n.require)&&n.require.forEach(function(e){window.ace.require(e)}),angular.isDefined(n.showGutter)&&e.renderer.setShowGutter(n.showGutter),angular.isDefined(n.useWrapMode)&&t.setUseWrapMode(n.useWrapMode),angular.isDefined(n.showInvisibles)&&e.renderer.setShowInvisibles(n.showInvisibles),angular.isDefined(n.showIndentGuides)&&e.renderer.setDisplayIndentGuides(n.showIndentGuides),angular.isDefined(n.useSoftTabs)&&t.setUseSoftTabs(n.useSoftTabs),angular.isDefined(n.showPrintMargin)&&e.setShowPrintMargin(n.showPrintMargin),angular.isDefined(n.disableSearch)&&n.disableSearch&&e.commands.addCommands([{name:"unfind",bindKey:{win:"Ctrl-F",mac:"Command-F"},exec:function(){return!1},readOnly:!0}]),angular.isString(n.theme)&&e.setTheme("ace/theme/"+n.theme),angular.isString(n.mode)&&t.setMode("ace/mode/"+n.mode),angular.isDefined(n.firstLineNumber)&&(angular.isNumber(n.firstLineNumber)?t.setOption("firstLineNumber",n.firstLineNumber):angular.isFunction(n.firstLineNumber)&&t.setOption("firstLineNumber",n.firstLineNumber()));var o,a;if(angular.isDefined(n.advanced))for(o in n.advanced)a={name:o,value:n.advanced[o]},e.setOption(a.name,a.value);if(angular.isDefined(n.rendererOptions))for(o in n.rendererOptions)a={name:o,value:n.rendererOptions[o]},e.renderer.setOption(a.name,a.value);angular.forEach(n.callbacks,function(t){angular.isFunction(t)&&t(e)})};return{restrict:"EA",require:"?ngModel",link:function(n,r,o,a){var i,s,l=e.ace||{},u=angular.extend({},l,n.$eval(o.uiAce)),c=window.ace.edit(r[0]),d=c.getSession(),g=function(){var e=arguments[0],t=Array.prototype.slice.call(arguments,1);angular.isDefined(e)&&n.$evalAsync(function(){if(!angular.isFunction(e))throw new Error("ui-ace use a function as callback.");e(t)})},f={onChange:function(e){return function(t){var r=d.getValue();!a||r===a.$viewValue||n.$$phase||n.$root.$$phase||n.$evalAsync(function(){a.$setViewValue(r)}),g(e,t,c)}},onBlur:function(e){return function(){g(e,c)}}};o.$observe("readonly",function(e){c.setReadOnly(!!e||""===e)}),a&&(a.$formatters.push(function(e){if(angular.isUndefined(e)||null===e)return"";if(angular.isObject(e)||angular.isArray(e))throw new Error("ui-ace cannot use an object or an array as a model");return e}),a.$render=function(){d.setValue(a.$viewValue)});var m=function(e,r){e!==r&&(u=angular.extend({},l,n.$eval(o.uiAce)),u.callbacks=[u.onLoad],u.onLoad!==l.onLoad&&u.callbacks.unshift(l.onLoad),d.removeListener("change",i),i=f.onChange(u.onChange),d.on("change",i),c.removeListener("blur",s),s=f.onBlur(u.onBlur),c.on("blur",s),t(c,d,u))};n.$watch(o.uiAce,m,!0),m(l),r.on("$destroy",function(){c.session.$stopWorker(),c.destroy()}),n.$watch(function(){return[r[0].offsetWidth,r[0].offsetHeight]},function(){c.resize(),c.renderer.updateFull()},!0)}}}]);