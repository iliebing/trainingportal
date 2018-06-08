(function (globalNS) {

    'use strict';

    const API_ENTRYPOINT = 'https://cdn.contentful.com/spaces/';
    const SPACE_ID = 'oq3mhm4gfwg8';
    const ACCESS_TOKEN_DELIVERY = '5a034faeebdf1528eb970ebeea06cbf3a4e1de718a0f53e2f34352a0eabcb7d4';
    const ACCESS_TOKEN_PREVIEW = '7335f81f63c4107f61ef57778a62c44a722f09dff901460a82955103ee290072';
    const ACCESS_TOKEN_MANAGEMENT = 'CFPAT-f4b1b629ff64fd783445bb373359fa83178040210059da294c8b35ffee007181';

    // const API_URL_BASE = API_ENTRYPOINT + SPACE_ID + '/entries?access_token=' + ACCESS_TOKEN;



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
        accessToken: ACCESS_TOKEN_DELIVERY
    })
    var clientManagement = contentfulManagement.createClient({
        accessToken: ACCESS_TOKEN_MANAGEMENT
    });

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
            id
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

    function createNewPost(newPostData) {

        return new Promise(function (resolve, reject) {

            clientManagement.getSpace(SPACE_ID)

                .then(function (space) {
                    return space.getEnvironment('master');
                })
                .then(function (environment) {
                    return environment.createEntry(TYPE.post, newPostData);
                })
                .then(function (newPost) {
                    return newPost.publish();
                })
                .then(function (newPost) {
                    resolve(newPost);
                })
                .catch(reject);
        });
    }

    function deletePost(id) {

        return new Promise(function (resolve, reject) {

            clientManagement.getSpace(SPACE_ID)

                .then(function (space) {
                    return space.getEnvironment('master');
                })
                .then(function (environment) {
                    return environment.getEntry(id);
                })
                .then(function (entry) {

                    if (entry.isPublished()) {
                        return entry.unpublish()
                    } else {
                        return entry;
                    }
                })
                .then(function (entry) {
                    return entry.delete();
                })
                .then(function (entry) {
                    resolve('entry deleted!', entry);
                })
                .catch(reject);
        });
    }

    function updatePost(id, newPostData) {

        return new Promise(function (resolve, reject) {

            clientManagement.getSpace(SPACE_ID)

                .then(function (space) {
                    return space.getEnvironment('master');
                })
                .then(function (environment) {
                    return environment.getEntry(id);
                })
                .then(function (entry) {
                    entry.fields = Object.assign(entry.fields, newPostData.fields)
                    return entry.update();
                })
                .then(function (entry) {
                    resolve('entry updated!', entry);
                })
                .catch(reject);
        });
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
            post: createNewPost
        },

        delete: {
            post: deletePost
        },

        update: {
            post: updatePost
        }
    }

})(window.trainingPortal = (window.trainingPortal || {}));