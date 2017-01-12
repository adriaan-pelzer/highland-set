# highland-set

## Union and Intersection operators for highland.js streams

This is a utility library for [@coalan](https://github.com/caolan)'s briliant functional wrapper for Node.js streams, [highland](http://highlandjs.org). It exposes two methods, *intersection* and *union*, both of which takes an array of highland streams as input. It outputs a highland stream, which emits the intersection, or union, of all the streams, if you view each stream as a set.

### INSTALL

```
    npm install highland-set
```

### USE

```
    const highlandSet = require ( 'highland-set' );

    highlandSet.intersection ( [
        H ( [ 1, 2, 3, 4, 5 ] ),
        H ( [ 1, 2, 3 ] ),
        H ( [ 1, 3, 4 ] ),
        // And an asynchronous one, otherwise, why would you use streams?
        H ( ( push, next ) => {
            [ 1, 2, 3, 4, 5, H.nil ].forEach ( ( item, index ) => {
                setTimeout ( () => {
                    push ( null, item );
                }, index * 1000 );
            } );
        } )
    ] )
        .each ( console.log );
        // emits 1, 3

    highlandSet.union ( [
        H ( [ 1, 2, 3, 4, 5 ] ),
        H ( [ 1, 2, 3 ] ),
        H ( [ 1, 3, 4 ] ),
        // And an asynchronous one, otherwise, why would you use streams?
        H ( ( push, next ) => {
            [ 1, 2, 3, 4, 5, H.nil ].forEach ( ( item, index ) => {
                setTimeout ( () => {
                    push ( null, item );
                }, index * 1000 );
            } );
        } )
    ] )
        .each ( console.log );
        // emits 1, 1, 1, 2, 2, 3, 3, 3, 4, 4, 5, 1, 2, 3, 4, 5
        // (note the asynchronous ones are at the end)
```
