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
namespace ul http://underlay.org/ns/

type value [
  ul:reference <- * ul:class
  ul:uri <- {}
  ul:literal <- <>
  ul:product <- * ul:product
  ul:coproduct <- * ul:coproduct
]

class ul:class :: {
  ul:key -> <>
  ul:value -> value
}

class ul:product :: {}

class ul:component :: {
  ul:key -> <>
  ul:source -> * ul:product
  ul:value -> value
}

class ul:coproduct :: {}

class ul:option :: {
  ul:key -> <>
  ul:source -> * ul:coproduct
  ul:value -> value
}
```
