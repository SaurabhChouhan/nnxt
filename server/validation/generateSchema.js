var t = require('tcomb');

function recurse(type, required) {
    if (t.Array.is(type)) {
        return type.map(function (type) {
            return recurse(type);
        });
    }
    t.assert(t.isType(type), function () {
        return 'Invalid value ' + t.stringify(type) + ' supplied to toObject(), expected a type';
    });
    required = t.Nil.is(required) ? true : required;
    var kind = type.meta.kind;
    var name = type.displayName;
    switch (kind) {
        case 'irreducible' :
            return {
                type: name,
                required: required
            }
        case 'refinement' :
        case 'subtype' :
            return {
                type: name,
                required: required
            }

        case 'maybe' :
            return recurse(type.meta.type, false);
        case 'enums' :
            return {
                kind: kind,
                name: name,
                required: required,
                map: type.meta.map
            };
        case 'interface' :
        case 'struct' :
            //var props = {required: required};
            var props = {}
            for (var k in type.meta.props) {
                props[k] = recurse(type.meta.props[k]);
            }
            return props
        case 'list' :
            return [recurse(type.meta.type)]
            //return [Object.assign(recurse(type.meta.type), {required:required})]
        case 'tuple' :
        case 'intersection' :
            return {
                kind: kind,
                name: name,
                required: required,
                types: recurse(type.meta.types)
            };
        case 'union' :
            return {
                kind: kind,
                name: name,
                required: required,
                types: recurse(type.meta.types),
                dispatch: type.dispatch
            };
        case 'dict' :
            return {
                kind: kind,
                name: name,
                required: required,
                domain: recurse(type.meta.domain),
                codomain: recurse(type.meta.codomain)
            };
        case 'func' :
            return {
                kind: kind,
                name: name,
                required: required,
                domain: recurse(type.meta.domain),
                codomain: recurse(type.meta.codomain)
            };
    }
}

function getDoc(type) {
    return recurse(type);
}

export default getDoc