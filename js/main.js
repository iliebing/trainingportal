(function (globalNS) {

    'use strict';

    var Post = globalNS.Post;

    function extract(key) {
        return function (entry) {
            return entry.fields[key]
        }
    }


    // globalNS.contentfulApi.create.post(post.createEntry())
    // .then(console.log)
    // .catch(console.warn);

    globalNS.contentfulApi.select.allPosts()
        .then(e => console.log(e.items.map(extract('title'))))
        .catch(console.warn);






})(window.trainingPortal = (window.trainingPortal || {}));  