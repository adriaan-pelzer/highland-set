const H = require ( 'highland' );

module.exports.union = ( streams ) => {
    return H ( streams ).merge ();    
};

module.exports.intersection = ( streams ) => {
    const itemBuckets = streams.map ( stream => {
        return [];
    } );

    const addItem = ( item, index ) => {
        if ( itemBuckets[index] ) {
            itemBuckets[index].push ( item );
        } else {
            itemBuckets[index] = [ item ];
        }
    };

    const checkAcrossAll = ( item, push ) => {
        if ( itemBuckets.reduce ( ( isInAll, itemBucket ) => {
            return isInAll && itemBucket.indexOf ( item ) > -1;
        }, true ) ) {
            push ( null, item );
        }
    };

    return H ( ( push, next ) => {
        streams.forEach ( ( stream, index ) => {
            stream.consume ( ( error, item, p, next ) => {
                p ( error, item );

                if ( item === H.nil ) {
                    addItem ( H.nil, index );
                    checkAcrossAll ( H.nil, push );
                } else {
                    next ();
                }
            } ).each ( item => {
                addItem ( item, index );
                checkAcrossAll ( item, push );
            } );
        } );
    } );
};

if ( ! module.parent ) {
    const assert = require ( 'assert' );

    module.exports.intersection ( [
        H ( [ 1, 2, 3, 4, 5 ] ),
        H ( [ 1, 2, 3 ] ),
        H ( [ 1, 3, 4 ] ),
        H ( ( push, next ) => {
            [ 1, 2, 3, 4, 5, H.nil ].forEach ( ( item, index ) => {
                setTimeout ( () => {
                    push ( null, item );
                }, index * 1000 );
            } );
        } )
    ] )
        .collect ()
        .each ( set => {
            assert ( set.length === 2, 'Output of intersection test should contain two items' );
            assert ( set.indexOf ( 1 ) > -1, 'Output of intersection test should contain 1' );
            assert ( set.indexOf ( 3 ) > -1, 'Output of intersection test should contain 3' );
            console.log ( 'Intersection works!' );
        } );

    module.exports.union ( [
        H ( [ 1, 2, 3, 4, 5 ] ),
        H ( [ 1, 2, 3 ] ),
        H ( [ 1, 3, 4 ] ),
        H ( ( push, next ) => {
            [ 1, 2, 3, 4, 5, H.nil ].forEach ( ( item, index ) => {
                setTimeout ( () => {
                    push ( null, item );
                }, index * 1000 );
            } );
        } )
    ] )
        .collect ()
        .each ( set => {
            assert ( set.length === 16, 'Output of union test should contain 16 items' );
            assert ( set.indexOf ( 1 ) > -1, 'Output of union test should contain 1' );
            assert ( set.indexOf ( 2 ) > -1, 'Output of union test should contain 2' );
            assert ( set.indexOf ( 3 ) > -1, 'Output of union test should contain 3' );
            assert ( set.indexOf ( 4 ) > -1, 'Output of union test should contain 4' );
            assert ( set.indexOf ( 5 ) > -1, 'Output of union test should contain 5' );
            console.log ( 'Union works!' );
        } );
}
