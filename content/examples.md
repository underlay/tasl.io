# example schemas

(under construction)

## RDF

```tasl
namespace ex http://example.com/

class ex:BlankNode :: {}

class ex:Statement :: {
  ex:subject -> [
    ex:blankNode <- * ex:BlankNode
    ex:iri <- <>
  ]
  ex:predicate -> <>
  ex:object -> [
    ex:blankNode <- * ex:BlankNode
    ex:iri <- <>
    ex:literal <- {
      ex:value -> string
      ex:languageOrDatatype -> [
        ex:language <- string
        ex:datatype <- <>
      ]
    }
  ]
  ex:graph -> [
    ex:defaultGraph
    ex:blankNode <- * ex:BlankNode
    ex:iri <- <>
  ]
}
```

## tasl schemas

```
# tasl schemas are modelled using terms from
# the standard underlay namespace
namespace ul http://underlay.org/ns/

# there are five kinds of tasl types:
type value [
  # the uri type, which doesn't need any configuration values
  ul:uri
  # literal types, which are parametrized by a URI datatype
  ul:literal <- <>
  # product and coproduct types, which we'll explain next
  ul:product <- * ul:product
  ul:coproduct <- * ul:coproduct
  # and reference types, which point to a class
  ul:reference <- * ul:class
]

# since products can have many components,
# and since coproducts can have many options,
# we have to explicitly represent components
# and options the same way we represent other
# multi-valued properties: as separate classes
# that reference a "source" product or coproduct
# element.

# so we model products as a unit class...
class ul:product :: {}

# ... and components as their own class, each element
# of which is "attached" to a source product element.
class ul:component :: {
  ul:source -> * ul:product
  ul:key -> <>
  ul:value -> value
}

# ... and we do the same for coproducts.
class ul:coproduct :: {}

class ul:option :: {
  ul:source -> * ul:coproduct
  ul:key -> <>
  ul:value -> value
}

# a class is just a key and a type.
class ul:class :: {
  ul:key -> <>
  ul:value -> value
}

# if we wanted this schema to model a set of many schemas,
# then we would make an addional unit class ul:schema ...
# class ul:schema :: {}
# ... and modify the ul:class class to reference a source
# ul:schema element. but by not doing this, we essentially
# make a schema that models a single schema - just a set
# of classes.
```
