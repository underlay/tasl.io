# tiny algebraic schema langauge

tasl is a schema language designed for datasets.

It builds on patterns from RDF, the semantic web, [algebraic data types](https://en.wikipedia.org/wiki/Algebraic_data_type), and [this paper](https://arxiv.org/abs/1909.04881) on algebraic property graphs from Shinavier and Wisnesky.

```tasl
namespace ex http://example.com/

class ex:Person :: {
  ex:name -> string
  ex:favoriteBook -> ? * ex:Book
}

class ex:Book :: {
  ex:title -> string
  ex:isbn -> <>
}
```

tasl is a data model, a text schema language, and a binary format for serlialized _instances_ of schemas. tasl instances are a better way to publish data than CSVs, JSON dumps, or SQLite snapshots because

- they're strongly typed
- they're more compact
- the data model is more expressive
- they can be easily projected onto other data models
- properties and classes are named with URIs, which makes their meaning more explicit and easier to look up

... and much more.
