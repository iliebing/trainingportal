(function (globalNS) {

    'use strict';

    var utils = globalNS.utils;
    var Post = globalNS.Post;
    var api_select = globalNS.contentfulApi.select;

    function hideElm (elm) {
        elm.style.display = 'none';
    }
    function showElm (elm) {
        elm.style.display = 'block';
    }

    function extract(key) {
        return function (entry) {
            return entry.fields[key];
        }
    }

    function makePost(obj) {
        return new Post(obj);
    }

    var appendChildren = utils.curry(function (parentElm, elms) {
        return elms.reduce(function (acc, elm) {
            acc.appendChild(elm);
            return acc;
        }, parentElm);
    });

    function createRowForPost(obj) {
        var tr = document.createElement('tr');
        var tdDate = document.createElement('td');
        tdDate.innerText = obj.date;

        var tdTitle = document.createElement('td');
        tdTitle.innerText = obj.title;

        var tdTheme = document.createElement('td');
        tdTheme.innerText = obj.topic

        appendChildren(tr, [
            tdTitle,
            tdTheme,
            tdDate
        ]);

        return tr;
    }

    function displayEntries(listElm, entries) {
        listElm.innerText = "";
        appendChildren(listElm, entries.map(createRowForPost));
    }

    function displayPostsOderedBy(htmlList, filedName, asc) {
        api_select.allPosts()
            .then(function (response) {
                displayEntries(htmlList, response.items.map(makePost).sort(orderByFieldName(filedName, asc)))
            })
            .catch(console.warn);
    }

    function orderByFieldName(filedName, asc) {
        return function (a, b) {

            var fA = a[filedName];
            var fB = b[filedName];

            if (fA === fB) {
                return 0
            }
            if (fA > fB) {
                return asc ? 1 : -1;
            } else {
                return asc ? -1 : 1;
            }
        }
    }

    var onTableheadClick = utils.curry (function (htmlList, evt) {
        var theme = evt.target.getAttribute('data-field');
        var asc = evt.target.asc !== undefined ? evt.target.asc : true;
        evt.target.asc = !asc;
        return displayPostsOderedBy(htmlList, theme, evt.target.asc);
    });

    var addListener = utils.curry(function(event, callback, elm) {
        return elm.addEventListener(event, callback);
    });


    function createPostFromForm(formHTML) {

    }

    // globalNS.contentfulApi.create.post(post.createEntry())
    // .then(console.log)
    // .catch(console.warn);

    globalNS.contentfulApi.select.allPosts()
        .then(e => console.log(e.items.map(extract('title'))))
        .catch(console.warn);

    window.addEventListener('load', function () {

        var htmlList = document.getElementById('posts');
        var tableButtons = document.querySelectorAll('.js-btn');
        var newPostInputoverlay = document.querySelector('.overlay');
        var addPostButton = document.getElementById('add-post-btn');
        var submitPostButton = document.getElementById('submit-post-btn');
        var newPostForm = document.getElementById('tpost-send');
        var closeOverLayButton = newPostInputoverlay.querySelector('.close')

        console.log(newPostForm);
        

        tableButtons.forEach(addListener('click', onTableheadClick(htmlList)));

        addPostButton.addEventListener('click', function () {
            showElm(newPostInputoverlay);
        });

        submitPostButton.addEventListener('click', function () {
            hideElm(newPostInputoverlay)
        });

        closeOverLayButton.addEventListener('click', function () {
            hideElm(newPostInputoverlay)
        });

        displayPostsOderedBy(htmlList, 'topic');

        hideElm(newPostInputoverlay);

    });

})(window.trainingPortal = (window.trainingPortal || {}));  