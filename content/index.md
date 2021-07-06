# tiny algebraic schema langauge

tasl is a **schema language for datasets**. It represents a generalized version of the relational data model based on [algebraic data types](https://en.wikipedia.org/wiki/Algebraic_data_type).

```tasl
# This is a tasl schema!
namespace s http://schema.org/

# classes are like tables, except they
# can be arbitrary algebraic data types,
# not just columns of primitives.
class s:Person :: {
  s:name -> string
  s:email -> ? uri
  s:spouse -> ? * s:Person
  s:gender -> [
    s:Male
    s:Female
    s:value <- string
  ]
}

# references are a primitive type that
# point to other classes in the schema,
# just like foreign keys.
class s:Book :: {
  s:name -> string
  s:isbn -> uri
  s:author -> * s:Person
}
```

tasl also has a binary format for serialized _instances_ of schemas. Together, you can use tasl to model and publish data in the same way you might use CSVs, JSON, or SQLite snapshots, although tasl is designed to make this entire process more structured and reusable.

tasl is part of the [Underlay](https://underlay.org/), a project to create a distributed public knowledge graph. Development is supported by [Protocol Labs Research](https://research.protocol.ai/) and the [Knowledge Futures Group](https://knowledgefutures.org/).
