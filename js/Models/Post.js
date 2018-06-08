(function (globalNS) {

    'use strict';

    globalNS.Post = class post {

        constructor(obj) {

            if (obj.sys) {

                ({
                    sys: {
                        id: this.id
                    },
                    fields: {
                        title: this.title,
                        creatorId: this.creatorId,
                        date: this.date,
                        description: this.description,
                        topic: this.topic,
                        postDate: this.postDate
                    }
                } = obj);
            } else {
                ({
                    title: this.title,
                    creatorId: this.creatorId,
                    date: this.date,
                    description: this.description = '',
                    topic: this.topic = '',
                } = obj);
            }
        }

        createEntry () {
            return {
                fields: {
                    title: {
                        de: this.title
                    },
                    topic: {
                        de: this.topic
                    },
                    description: {
                        de: this.description
                    },
                    date: {
                        de: this.date
                    }
                }
            };
        }
    }


})(window.trainingPortal = (window.trainingPortal || {}));  