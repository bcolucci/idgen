
# Unique ID Generator

**First of all, sorry for my english. But I'm french, so I've the better excuse in the world.**

---

This project contains:
* A function that generates a unique ID of 19 chars only (**src/idgen.js**) ;
* A web server that exposes a `GET /:namespace` route to generates IDs (**src/server.js**).

## Live test

I've deployed the service in an AWS **micro** instance. Please, do not run stress test on that, or I'll be oblige to sleep under a bridge :sob:

Just go on http://ec2-34-247-66-79.eu-west-1.compute.amazonaws.com:3000/SRT

(you can change the namespace)

## How the function works?

A generated ID is composed as follow: `[NAMESPACE]-[UID]`.

The `NAMESPACE` part is free format, for example: `'SRT'`, or `'42'`.

The `UID` part is generated with:
* The current timestamp (ms) ;
* The process ID ;
* An internal (scope) counter (0 to 999) ;
* A random string (6 first chars).

The `idgen` function is a function generator, because of the internal counter. So, to get a generator, you need to do:

```js
const idgen = require('./idgen')() // <-- returns a new generator
```

**To reduce the ID length, each part is base36 encoded.**

This is what it looks like (with a `SRT` namespace):

```js
[
    'SRT-k4ihue9u1fzg0d0xsgj',
    'SRT-k4ihue9u1fzg1173kjh',
    'SRT-k4ihue9u1fzg232oxgc',
    'SRT-k4ihue9u1fzg3l1gvpx',
    'SRT-k4ihue9u1fzg4h8kji2',
    'SRT-k4ihue9u1fzg5la4gyj',
    'SRT-k4ihue9u1fzg6bc8a9p',
    'SRT-k4ihue9u1fzg7pj406h',
    'SRT-k4ihue9u1fzg8iojajh',
    'SRT-k4ihue9u1fzg9xqvj6x'
]
```

## How to make a server request?

First, clone the project and install dependencies:

    $ git clone https://github.com/bcolucci/idgen.git \
        && cd idgen \
        && npm install

Then, run the server:

    npm start

Then, go to [localhost:3000/SRT](http://localhost:3000/SRT), or use your console:

    $ curl -w "\n" http://localhost:3000/SRT
    SRT-k4iifxhq1enm8ql4d0

## Technical details

### Libray size

* The project has only **1** dependency: `express`, in order to run the server (and one development dependency to run stress tests: `artillery`) ;
* The ID generator function is a **20** lines file (<500 bytes) ;
* The server is a **7** lines file (~180 bytes).

The ID generator function is completly independant and could be extracted in a dedicated library.

### Choices made

* I've first planed to use the MAC address of the machine inside the ID, but, because we already have a namespace prefix, I've decided that the others ID parts would be sufficent to garantee the non-collision.
* I've first thought to use a numeric-only ID (*BigInt*), in order to make the IDs time sortable. But it was not a requirement and adding a random generated part in the ID to enforce the uniquess seemed to be a better choice ;
* I've decided to base36 encode each part separatly in order to reduce the collision risk ;
* The function is *scalable* (can be used in paralele in different machines at the same time) thanks to:
    * The process ID. So different processes will generate different IDs, even in the same time ;
    * An internal counter. Indeed, the library exposes a function **generator** which has in its internal scope a counter that increments from 0 to 999 (0 padded, randomly initialized) and goes back to 0 after 999. So, even in the same process, if I create two generators, they will generate different Ids ;
    * A random 6 chars string (from `Math.random()`).

### Futur work

* There was not specified requirements about the namespace, but I guess that I sould add some limitations (alphanum, between 3 and 6 chars for example...) ;
* Could add a query parameter to ask for **N** Ids in the same request ;
* Could extract the `idgen` function, so it could be used somewhere else ;
* Could remove the express dependency. It'll add something like 10 more lines of code into `src/server.js` but will reduce the library size and makes it a 0 dep library, and makes it a even faster.

## Other details

* Before coding this library, I've spent a few minutes to read some article on the different way to generate unique IDs (in a scalable way) ;
* Choices I've made are really based on requierements. I wanted to have something small, fast and reliable.

### Stress test report

Test configuration:
* **20** simultanous users ;
* Each user is running **2,000** requests.

Results:
* A total of **40,000** requests ;
* In **19** secondes ;
* About **~2200** RPS (it's not the max but what we have in this case).
* **100%** 200 HTTP status.

```
$ npx artillery quick --count 20 -n 2000 http://localhost:3000/SRT

[...]

All virtual users finished
Summary report @ 08:34:05(-0500) 2019-12-23
Scenarios launched:  20
Scenarios completed: 20
Requests completed:  40000
RPS sent: 2077.92
Request latency:
    min: 0.1
    max: 103.2
    median: 3.8
    p95: 5.3
    p99: 6.8
Scenario counts:
    0: 20 (100%)
Codes:
    200: 40000
```
