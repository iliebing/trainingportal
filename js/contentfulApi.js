(function (globalNS) {

    'use strict';
   
    const ENTRY_POINT = 'https://api.contentful.com';
    const SPACE_ID = 'oq3mhm4gfwg8'
    const ENVIRONMENT_ID = 'trainingportal'; 
    const ACCESS_TOKEN = '5a034faeebdf1528eb970ebeea06cbf3a4e1de718a0f53e2f34352a0eabcb7d4'
    
    const URL_BASE =  `${ENTRY_POINT}/spaces/${SPACE_ID}/environments/${ENVIRONMENT_ID}/`;

    var URL = {
        entries: `${URL_BASE}entries?access_token=${ACCESS_TOKEN}`
    }
   
    function getAllTrainings () {
        return fetch(URL.entries);
    }


    globalNS.contentfulApi = {
        getAllTrainings


    }
   
})(window.trainingPortal = (window.trainingPortal || {}));