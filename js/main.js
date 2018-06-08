(function (globalNS) {

    'use strict';

    var utils = globalNS.utils;
    var Post = globalNS.Post;
    var api_select = globalNS.contentfulApi.select;
    var api_create = globalNS.contentfulApi.create;

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

    function createOptionForLead(item) {
        var option = document.createElement('option');
        option.innerText = item.fields.name;
        option.value = item.sys.id;
        return option;
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

        var title = document.getElementById('title').value;
        var date = document.getElementById('date').value;
        var topic = document.getElementById('topic').value;
        var decs = document.getElementById('description').value;

        return new Post({
            title: title,
            // creatorId: this.creatorId,
            date: date,
            description: decs,
            topic: topic,
        });

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
        var closeOverLayButton = newPostInputoverlay.querySelector('.close');
        var leaderSelect = document.getElementById('leaderSelect');

        console.log(leaderSelect);
        

        tableButtons.forEach(addListener('click', onTableheadClick(htmlList)));

        addPostButton.addEventListener('click', function () {
            showElm(newPostInputoverlay);
        });

        submitPostButton.addEventListener('click', function () {
            hideElm(newPostInputoverlay);

            var newPost = createPostFromForm(newPostForm);

            api_create.post(newPost.createEntry())
            .then(function () {
                console.log('Post created', )
                displayPostsOderedBy(htmlList, 'topic');
            })
            .catch(console.warn)

        });

        closeOverLayButton.addEventListener('click', function () {
            hideElm(newPostInputoverlay)
        });

        displayPostsOderedBy(htmlList, 'topic');

        hideElm(newPostInputoverlay);


        api_select.allHeads()
        .then(function (response) {
            appendChildren(leaderSelect, response.items.map(createOptionForLead))
        })

    });

})(window.trainingPortal = (window.trainingPortal || {}));  