"use strict";

/* =============================================================
   BIRTHDAY PWA — SERVICE WORKER
============================================================= */

const CACHE_NAME =
    "birthday-surprise-v1";


const APP_FILES = [

    "./",

    "./index.html",
    "./style.css",
    "./script.js",

    "./manifest.json",

    "./photo1.jpg",
    "./photo2.jpg",
    "./photo3.jpg"

];


/* =============================================================
   INSTALL
============================================================= */

self.addEventListener(
    "install",
    event => {

        console.log(
            "[SW] Installing..."
        );


        event.waitUntil(

            caches
                .open(CACHE_NAME)
                .then(cache => {

                    return cache.addAll(
                        APP_FILES
                    );

                })

        );


        self.skipWaiting();

    }
);


/* =============================================================
   ACTIVATE
============================================================= */

self.addEventListener(
    "activate",
    event => {

        console.log(
            "[SW] Activated"
        );


        event.waitUntil(

            caches.keys()
                .then(cacheNames => {

                    return Promise.all(

                        cacheNames
                            .filter(
                                name =>
                                    name !==
                                    CACHE_NAME
                            )
                            .map(
                                name =>
                                    caches.delete(
                                        name
                                    )
                            )

                    );

                })

        );


        self.clients.claim();

    }
);


/* =============================================================
   FETCH
============================================================= */

self.addEventListener(
    "fetch",
    event => {

        /*
         * Only handle GET requests.
         */

        if (
            event.request.method !==
            "GET"
        ) {
            return;
        }


        event.respondWith(

            caches.match(
                event.request
            )
            .then(cachedResponse => {

                /*
                 * Cached file exists.
                 */

                if (cachedResponse) {

                    return cachedResponse;

                }


                /*
                 * Otherwise request it
                 * from the network.
                 */

                return fetch(
                    event.request
                )
                .then(response => {

                    /*
                     * Don't cache invalid
                     * responses.
                     */

                    if (
                        !response ||
                        response.status !== 200 ||
                        response.type ===
                            "opaque"
                    ) {

                        return response;

                    }


                    /*
                     * Save a copy.
                     */

                    const responseClone =
                        response.clone();


                    caches
                        .open(
                            CACHE_NAME
                        )
                        .then(cache => {

                            cache.put(
                                event.request,
                                responseClone
                            );

                        });


                    return response;

                });

            })

        );

    }
);
