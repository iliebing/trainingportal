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
            }
        }
    }


})(window.trainingPortal = (window.trainingPortal || {}));  