$(function () { // То же, что и document.addEventListener("DOMContentLoaded"...

  // $ - То же, что и document.querySelector("#navbarToggle").addEventListener("blur",...
  $("#navbarToggle").blur(function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse('hide');
    }
  });
});

(function (global) {

var dc = {};

var homeHtmlUrl = "snippets/home-snippet.html";
var allCategoriesUrl =
  "https://davids-restaurant.herokuapp.com/categories.json";
var categoriesTitleHtml = "snippets/categories-title-snippet.html";
var categoryHtml = "snippets/category-snippet.html";
var menuItemsUrl =
  "https://davids-restaurant.herokuapp.com/menu_items.json?category=";
var menuItemsTitleHtml = "snippets/menu-items-title.html";
var menuItemHtml = "snippets/menu-item.html";

// Удобная функция для вставки innerHTML для 'select'
var insertHtml = function (selector, html) {
  var targetElem = document.querySelector(selector);
  targetElem.innerHTML = html;
};

// Показать значок загрузки внутри элемента, указанного 'селектором'.
var showLoading = function (selector) {
  var html = "<div class='text-center'>";
  html += "<img src='images/ajax-loader.gif'></div>";
  insertHtml(selector, html);
};

// Возвращает замену '{{propName}}'
// с propValue в заданной 'string'
var insertProperty = function (string, propName, propValue) {
  var propToReplace = "{{" + propName + "}}";
  string = string
    .replace(new RegExp(propToReplace, "g"), propValue);
  return string;
};

// Удалите класс 'active' из кнопки home и переключите на кнопку Menu
var switchMenuToActive = function () {
// Удалите класс 'active' из кнопки home
  var classes = document.querySelector("#navHomeButton").className;
  classes = classes.replace(new RegExp("active", "g"), "");
  document.querySelector("#navHomeButton").className = classes;

  // Добавьте 'active' к кнопке меню, если его там еще нет
  classes = document.querySelector("#navMenuButton").className;
  if (classes.indexOf("active") === -1) {
    classes += " active";
    document.querySelector("#navMenuButton").className = classes;
  }
};

// При загрузке страницы (до изображений или CSS)
document.addEventListener("DOMContentLoaded", function (event) {

 //TODO: STEP 0: Просмотрите код с.
 // *** начало ***
 // до
 // *** конец ***
 // ниже.
 // Мы изменили этот код, чтобы получить все категории с сервера вместо простого запроса домашнего HTML-фрагмента. 
 //Теперь у нас есть еще одна функция под названием buildAndShowHomeHTML, 
 //которая будет получать все категории с сервера и обрабатывать их: выбирать случайную категорию,
 // получать домашний HTML сниппет, вставлять эту случайную категорию в домашний HTML сниппет, 
 //а затем вставлять этот сниппет в нашу главную страницу (index.html).
//
// TODO: STEP 1: Замените [...] ниже *значением* функции buildAndShowHomeHTML, 
//чтобы ее можно было вызвать, когда сервер ответит данными о категориях.

// *** начало ***
// При первой загрузке показываем главную страницу
showLoading("#main-content");
$ajaxUtils.sendGetRequest(
  allCategoriesUrl,
 buildAndShowHomeHTML, // ***** <---- TODO: STEP 1: Замените [...] ******
  true); // Явная установка флага для получения JSON с сервера, обработанного в объектном литерале
});
// *** конец **


// Строит HTML для домашней страницы на основе массива категорий, возвращаемого с сервера.
function buildAndShowHomeHTML (categories) {

  // Загружаем страницу с домашним фрагментом
  $ajaxUtils.sendGetRequest(
    homeHtmlUrl,
    function (homeHtml) {
  
      // TODO: STEP 2: Здесь вызываем selectRandomCategory, передавая ему полученные 'категории'.
      //  Обратите внимание на то, какой тип данных возвращает эта функция, а также на то, что переменная selectedCategoryShortName.
      // Имя переменной подразумевает, что она ожидает var chosenCategoryShortName = ....
  var chosenCategoryShortName = chooseRandomCategory(categories).short_name;

      // TODO: STEP 3: Замените {{randomCategoryShortName}} в домашнем html-фрагменте выбранной категорией из ШАГА 2. 
      //Используйте для этого существующую функцию insertProperty.
      // Посмотрите этот код для примера использования функции insertProperty.
      // ВНИМАНИЕ! Вы вставляете что-то, что должно привести к правильному синтаксису Javascript, 
      // потому что подстановка {{randomCategoryShortName}} становится аргументом, 
      // передаваемым в функцию $dc.loadMenuItems. Подумайте, как должен выглядеть этот 
      // аргумент. Например, правильный вызов будет выглядеть следующим образом:
      // $dc.loadMenuItems('L')
      // Подсказка: вам нужно окружить выбранное короткое название категории чем-то, 
      // прежде чем вставить его в домашний html-фрагмент.
      //
      // var homeHtmlToInsertIntoMainPage = ....
      chosenCategoryShortName = "'"+ chosenCategoryShortName + "'";
      var homeHtmlToInsertIntoMainPage = insertProperty (homeHtml, "randomCategoryShortName", chosenCategoryShortName);
      
      // TODO: STEP 4: Вставьте HTML, созданный в ШАГЕ 3, на главную страницу.
      // Используйте для этого существующую функцию insertHtml.
      // Посмотрите в этом коде пример того, как это сделать.
      // ....
      insertHtml ("#main-content", homeHtmlToInsertIntoMainPage);
    },
    false); // Здесь False, потому что мы получаем обычный HTML с сервера, поэтому нет необходимости обрабатывать JSON.
}

// Учитывая массив объектов категорий, возвращает случайный объект категории.
function chooseRandomCategory (categories) {
 // Выбираем случайный индекс в массиве (от 0 включительно до длины массива (исключительно))
  var randomArrayIndex = Math.floor(Math.random() * categories.length);

   // возвращает объект категории с этим индексом randomArrayIndex
  return categories[randomArrayIndex];
}


// Загрузка представления категорий меню
dc.loadMenuCategories = function () {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    allCategoriesUrl,
    buildAndShowCategoriesHTML);
};


// Загрузка представления пунктов меню
// 'categoryShort' - короткое_название категории
dc.loadMenuItems = function (categoryShort) {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    menuItemsUrl + categoryShort,
    buildAndShowMenuItemsHTML);
};


// Строит HTML для страницы категорий на основе данных с сервера
function buildAndShowCategoriesHTML (categories) {
// Загружаем фрагмент заголовка страницы категорий
  $ajaxUtils.sendGetRequest(
    categoriesTitleHtml,
    function (categoriesTitleHtml) {
      // Получение фрагмента одной категории
      $ajaxUtils.sendGetRequest(
        categoryHtml,
        function (categoryHtml) {
           // Переключить CSS-класс active на кнопку меню
          switchMenuToActive();

          var categoriesViewHtml =
            buildCategoriesViewHtml(categories,
                                    categoriesTitleHtml,
                                    categoryHtml);
          insertHtml("#main-content", categoriesViewHtml);
        },
        false);
    },
    false);
}


// Использование данных категорий и сниппетов html для постройки HTML представления категорий для вставки на страницу
function buildCategoriesViewHtml(categories,
                                 categoriesTitleHtml,
                                 categoryHtml) {

  var finalHtml = categoriesTitleHtml;
  finalHtml += "<section class='row'>";

// Цикл для перебора категорий
  for (var i = 0; i < categories.length; i++) {
    // Вставьте значения категорий
    var html = categoryHtml;
    var name = "" + categories[i].name;
    var short_name = categories[i].short_name;
    html =
      insertProperty(html, "name", name);
    html =
      insertProperty(html,
                     "short_name",
                     short_name);
    finalHtml += html;
  }

  finalHtml += "</section>";
  return finalHtml;
}



// Строит HTML для страницы одной категории на основе данных с сервера
function buildAndShowMenuItemsHTML (categoryMenuItems) {
  // Загрузка фрагмента заголовка страницы пунктов меню
  $ajaxUtils.sendGetRequest(
    menuItemsTitleHtml,
    function (menuItemsTitleHtml) {
      // Получение фрагмента одного пункта меню
      $ajaxUtils.sendGetRequest(
        menuItemHtml,
        function (menuItemHtml) {
           // Переключить CSS-класс active на кнопку меню
          switchMenuToActive();

          var menuItemsViewHtml =
            buildMenuItemsViewHtml(categoryMenuItems,
                                   menuItemsTitleHtml,
                                   menuItemHtml);
          insertHtml("#main-content", menuItemsViewHtml);
        },
        false);
    },
    false);
}


// Используя данные о категориях и пунктах меню и сниппеты html, 
//постройтение представления пунктов меню HTML для вставки на страницу
function buildMenuItemsViewHtml(categoryMenuItems,
                                menuItemsTitleHtml,
                                menuItemHtml) {

  menuItemsTitleHtml =
    insertProperty(menuItemsTitleHtml,
                   "name",
                   categoryMenuItems.category.name);
  menuItemsTitleHtml =
    insertProperty(menuItemsTitleHtml,
                   "special_instructions",
                   categoryMenuItems.category.special_instructions);

  var finalHtml = menuItemsTitleHtml;
  finalHtml += "<section class='row'>";

  // Перебор пунктов меню
  var menuItems = categoryMenuItems.menu_items;
  var catShortName = categoryMenuItems.category.short_name;
  for (var i = 0; i < menuItems.length; i++) {
    // Вставка значений пунктов меню
    var html = menuItemHtml;
    html =
      insertProperty(html, "short_name", menuItems[i].short_name);
    html =
      insertProperty(html,
                     "catShortName",
                     catShortName);
    html =
      insertItemPrice(html,
                      "price_small",
                      menuItems[i].price_small);
    html =
      insertItemPortionName(html,
                            "small_portion_name",
                            menuItems[i].small_portion_name);
    html =
      insertItemPrice(html,
                      "price_large",
                      menuItems[i].price_large);
    html =
      insertItemPortionName(html,
                            "large_portion_name",
                            menuItems[i].large_portion_name);
    html =
      insertProperty(html,
                     "name",
                     menuItems[i].name);
    html =
      insertProperty(html,
                     "description",
                     menuItems[i].description);

      // Добавляет clearfix после каждого второго пункта меню
    if (i % 2 !== 0) {
      html +=
        "<div class='clearfix visible-lg-block visible-md-block'></div>";
    }

    finalHtml += html;
  }

  finalHtml += "</section>";
  return finalHtml;
}


// Добавляет цену с '$', если цена существует
function insertItemPrice(html,
                         pricePropName,
                         priceValue) {
  // Если не указано, заменить на пустую строку
  if (!priceValue) {
    return insertProperty(html, pricePropName, "");
  }

  priceValue = "$" + priceValue.toFixed(2);
  html = insertProperty(html, pricePropName, priceValue);
  return html;
}


// Добавляет имя порции в круглые скобки, если оно существует
function insertItemPortionName(html,
                               portionPropName,
                               portionValue) {
 // Если не указано, возвращается исходная строка
  if (!portionValue) {
    return insertProperty(html, portionPropName, "");
  }

  portionValue = "(" + portionValue + ")";
  html = insertProperty(html, portionPropName, portionValue);
  return html;
}


global.$dc = dc;

})(window);
