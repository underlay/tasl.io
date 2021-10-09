# example schemas

## RDF (n-quads)

An instance of this schema is equivalent to an RDF _dataset_.

```tasl
namespace ex http://example.com/

class ex:BlankNode {}

class ex:Statement {
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

We could have simplifing the schema to just model RDF _graphs_ by removing the `ex:graph` component of the statement class.

## tasl schemas

We can also model tasl schemas themselves as instances of a _schema schema_.

```tasl
# tasl schemas are canonically modelled using terms from
# the underlay namespace
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
class ul:product {}

# ... and components as their own class, each element
# of which is "attached" to a source product element.
# This way, each individual ul:product element can "have"
# arbitrarily many components.
class ul:component {
  ul:source -> * ul:product
  ul:key -> <>
  ul:value -> value
}

# ... and we do the same for coproducts.
class ul:coproduct {}

class ul:option {
  ul:source -> * ul:coproduct
  ul:key -> <>
  ul:value -> value
}

# a class is just a key and a type.
class ul:class {
  ul:key -> <>
  ul:value -> value
}
```

An instance of this schema is equivalent to one individual tasl schema. That's why there's no "`ul:schema'" class - an entire instance is an entire schema. If we wanted, we could add a "schema class"...

```tasl
class ul:schema {}
```

... and modify classes to "belong" to a particular schema...

```tasl
class ul:class {
  ul:source -> * ul:schema
  # ...
}
```

... which would give us a schema whose instances are collections of many schemas.
