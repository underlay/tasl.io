# tiny algebraic schema langauge

tasl is a schema language designed for datasets.

It builds on patterns from RDF, the semantic web, [algebraic data types](https://en.wikipedia.org/wiki/Algebraic_data_type), and [this paper](https://arxiv.org/abs/1909.04881) on algebraic property graphs from Shinavier and Wisnesky.

```tasl
namespace ex http://example.com/

class ex:IssueTicket :: {
  ex:title -> string
  ex:content -> string
  ex:status -> [
    ex:notStarted
    ex:inProgress
    ex:closed <- dateTime
  ]
}
```

tasl is a data model, a text schema language, and a binary format for serliazed _instances_ of schemas. An instance is better way to publish data than a CSV, JSON dump, or SQLite snapshot because

- it's strongly typed
- it's more compact
- the data model is more expressive
- it can easily be projected onto other data models
