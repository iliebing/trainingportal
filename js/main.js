(function (globalNS) {

    'use strict';

    var Post = globalNS.Post;

    function extract(key) {
        return function (entry) {
            return entry.fields[key]
        }
    }
    

    globalNS.contentfulApi.select.allUsers()
        .then(function (res) {

            console.log(res);
            console.log(res.items.map(extract('name')));
            

            // var post = new Post(res.items[0]);
            // console.log(post);
             

        })
        .catch((err) => console.log('Err', err))






})(window.trainingPortal = (window.trainingPortal || {}));  