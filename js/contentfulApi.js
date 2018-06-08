(function (globalNS) {

    'use strict';

    const SPACE_ID = 'oq3mhm4gfwg8'
    const ACCESS_TOKEN = '5a034faeebdf1528eb970ebeea06cbf3a4e1de718a0f53e2f34352a0eabcb7d4'

    // t means "training"
    const TYPE = {
        general: 'general',
        user: 'tuser',
        post: 'tpost'
    };

    const ROLE = {
        default: 'Teilnehmer',
        head: 'Führungskraft',
        hr: 'Human Resources'
    };

    var client = contentful.createClient({
        space: SPACE_ID,
        accessToken: ACCESS_TOKEN
    })

    function getAllContentTypes() {
        return client.getContentTypes();
    }

    function prepareGetEntries(config) {
        return function (obj) {
            return client.getEntries(config);
        }
    }

    function getUserByName(userName) {
        return client.getEntries({
            'content_type': TYPE.user,
            'fields.name': userName,
        });
    }

    function getuserByName(userName) {
        return client.getEntries({
            'content_type': TYPE.user,
            'fields.name': userName,
        });
    }

    function getPostsByCreatorName(name) {

        return new Promise(async function (resolve, reject) {

            var user = await getUserByName(name);

            if (user.items.length === 0) {
                reject('keine Einträge');
                return;
            }

            var posts = await client.getEntries({
                'content_type': TYPE.post,
                'fields.creatorId': user.items[0].sys.id
            })

            resolve(posts);
        });

    }

    function createNewPost(post) {

        // return new Promise(function (resolve, reject) {

        //     client.getSpace(SPACE_ID)
        //         .then(function (space) { 

        //             console.log(space);

        //             space.createEntryWithId(TYPE.post, '123', {


        //             fields: {
        //                 title: {
        //                     'en-US': 'Entry title'
        //                 }
        //             }
        //         })})
        //         .then(resolve)
        //         .catch(reject)
        // })
    }


    globalNS.contentfulApi = {

        select: {
            allContentTypes: prepareGetEntries({}),


            allUsers: prepareGetEntries({
                content_type: TYPE.user
            }),
            allDefaultUsers: prepareGetEntries({
                content_type: TYPE.user,
                'fields.role': ROLE.head,
            }),
            userserByName: getUserByName,

            allPosts: prepareGetEntries({
                content_type: TYPE.post
            }),

            postsByCreatorName: getPostsByCreatorName
        },

        create: {
            newPost: createNewPost
        }
    }

})(window.trainingPortal = (window.trainingPortal || {}));