function kindOf( val ) {
    if ( val === void 0 ) return 'undefined';
    if ( val === null ) return 'null';

    var type = typeof val;
    if ( type === 'boolean' ) return 'boolean';
    if ( type === 'string' ) return 'string';
    if ( type === 'number' ) return 'number';
    if ( type === 'symbol' ) return 'symbol';
    if ( type === 'function' ) {
        return isGeneratorFn( val ) ? 'generatorfunction' : 'function';
    }

    if ( isArray( val ) ) return 'array';
    if ( isBuffer( val ) ) return 'buffer';
    if ( isArguments( val ) ) return 'arguments';
    if ( isDate( val ) ) return 'date';
    if ( isError( val ) ) return 'error';
    if ( isRegexp( val ) ) return 'regexp';

    switch ( ctorName( val ) ) {
        case 'Symbol': return 'symbol';
        case 'Promise': return 'promise';

        // Set, Map, WeakSet, WeakMap
        case 'WeakMap': return 'weakmap';
        case 'WeakSet': return 'weakset';
        case 'Map': return 'map';
        case 'Set': return 'set';

        // 8-bit typed arrays
        case 'Int8Array': return 'int8array';
        case 'Uint8Array': return 'uint8array';
        case 'Uint8ClampedArray': return 'uint8clampedarray';

        // 16-bit typed arrays
        case 'Int16Array': return 'int16array';
        case 'Uint16Array': return 'uint16array';

        // 32-bit typed arrays
        case 'Int32Array': return 'int32array';
        case 'Uint32Array': return 'uint32array';
        case 'Float32Array': return 'float32array';
        case 'Float64Array': return 'float64array';
    }

    if ( isGeneratorObj( val ) ) {
        return 'generator';
    }

    // Non-plain objects
    type = toString.call( val );
    switch ( type ) {
        case '[object Object]': return 'object';
        // iterators
        case '[object Map Iterator]': return 'mapiterator';
        case '[object Set Iterator]': return 'setiterator';
        case '[object String Iterator]': return 'stringiterator';
        case '[object Array Iterator]': return 'arrayiterator';
    }

    // other
    return type.slice( 8, -1 ).toLowerCase().replace( /\s/g, '' );
};

function ctorName( val ) {
    return val.constructor ? val.constructor.name : null;
}

function isArray( val ) {
    if ( Array.isArray ) return Array.isArray( val );
    return val instanceof Array;
}

function isError( val ) {
    return val instanceof Error || ( typeof val.message === 'string' && val.constructor && typeof val.constructor.stackTraceLimit === 'number' );
}

function isDate( val ) {
    if ( val instanceof Date ) return true;
    return typeof val.toDateString === 'function'
        && typeof val.getDate === 'function'
        && typeof val.setDate === 'function';
}

function isRegexp( val ) {
    if ( val instanceof RegExp ) return true;
    return typeof val.flags === 'string'
        && typeof val.ignoreCase === 'boolean'
        && typeof val.multiline === 'boolean'
        && typeof val.global === 'boolean';
}

function isGeneratorFn( name, val ) {
    return ctorName( name ) === 'GeneratorFunction';
}

function isGeneratorObj( val ) {
    return typeof val.throw === 'function'
        && typeof val.return === 'function'
        && typeof val.next === 'function';
}

function isArguments( val ) {
    try {
        if ( typeof val.length === 'number' && typeof val.callee === 'function' ) {
            return true;
        }
    } catch ( err ) {
        if ( err.message.indexOf( 'callee' ) !== -1 ) {
            return true;
        }
    }
    return false;
}

function isBuffer( val ) {
    if ( val.constructor && typeof val.constructor.isBuffer === 'function' ) {
        return val.constructor.isBuffer( val );
    }
    return false;
}

function clone( val, deep ) {
    switch ( kindOf( val ) ) {
        case 'array':
            return val.slice();
        case 'object':
            return Object.assign( {}, val );
        case 'date':
            return new val.constructor( +val );
        case 'map':
            return new Map( val );
        case 'set':
            return new Set( val );
        case 'buffer':
            return cloneBuffer( val );
        case 'symbol':
            return cloneSymbol( val );
        case 'arraybuffer':
            return cloneArrayBuffer( val );
        case 'float32array':
        case 'float64array':
        case 'int16array':
        case 'int32array':
        case 'int8array':
        case 'uint16array':
        case 'uint32array':
        case 'uint8clampedarray':
        case 'uint8array':
            return cloneTypedArray( val );
        case 'regexp':
            return cloneRegExp( val );
        case 'error':
            return Object.create( val );
        default: {
            return val;
        }
    }
}

function cloneRegExp( val ) {
    const re = new val.constructor( val.source, /\w+$/.exec( val ) );
    re.lastIndex = val.lastIndex;
    return re;
}

function cloneArrayBuffer( val ) {
    const res = new val.constructor( val.byteLength );
    new Uint8Array( res ).set( new Uint8Array( val ) );
    return res;
}

function cloneTypedArray( val, deep ) {
    return new val.constructor( val.buffer, val.byteOffset, val.length );
}

function cloneBuffer( val ) {
    const len = val.length;
    const buf = Buffer.allocUnsafe ? Buffer.allocUnsafe( len ) : new Buffer( len );
    val.copy( buf );
    return buf;
}

function cloneSymbol( val ) {
    return valueOf ? Object( valueOf.call( val ) ) : {};
}


function cloneDeep( val, instanceClone ) {
    switch ( kindOf( val ) ) {
        case 'object':
            return cloneObjectDeep( val, instanceClone );
        case 'array':
            return cloneArrayDeep( val, instanceClone );
        default: {
            return clone( val );
        }
    }
}

function cloneObjectDeep( val, instanceClone ) {
    if ( typeof instanceClone === 'function' ) {
        return instanceClone( val );
    }
    if ( kindOf( val ) === 'object' ) {
        const res = new val.constructor();
        for ( const key in val ) {
            res[ key ] = cloneDeep( val[ key ], instanceClone );
        }
        return res;
    }
    return val;
}

function cloneArrayDeep( val, instanceClone ) {
    const res = new val.constructor( val.length );
    for ( let i = 0; i < val.length; i++ ) {
        res[ i ] = cloneDeep( val[ i ], instanceClone );
    }
    return res;
}