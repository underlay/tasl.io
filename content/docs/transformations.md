# lezer-taslx

```
# A comment
namespace ul http://underlay.org/ns/

map ex:target <= ex:source (s) => <ipfs:QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn>

map ex:target <= ex:source (source) => {
  ex:a <= s * ex:foo / ex:bar
  ex:b <= s / ex:baz [
    ex:foo (x) => x % ex:foo
    ex:bar (x) => "hello world"
  ] % ex:more % ex:stuff
} % ex:a/1 % ex:b/2
```

## RDF Examples

A tasl schema for RDF datasets looks like this:

```
# rdf-dataset.tasl
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

We can turn this into a tasl schema for RDF _graphs_ by just removing the `ex:graph` component of statements:

```
# rdf-graph.tasl
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
}
```

### Graphs to Datasets

A taslx mapping from `rdf-graph.tasl` to `rdf-dataset.tasl` needs to provide the new component in statements, and provide a default value for that component.

```
# graph-to-dataset.taslx
namespace ex http://example.com/ns/

map ex:BlankNode <= ex:BlankNode (x) => x

map ex:Statement <= ex:Statement (x) => {
  ex:subject   <= x / ex:subject
  ex:predicate <= x / ex:predicate
  ex:object    <= x / ex:object
  ex:graph     <= {} % ex:defaultGraph
}
```

### Datasets to Graphs

A taslx mapping from `rdf-dataset.tasl` to `rdf-graph.tasl` just needs to remove the graph component from statements.

```
# dataset-to-graph.taslx
namespace ex http://example.com/ns/

map ex:BlankNode <= ex:BlankNode (x) => x

map ex:Statement <= ex:Statement (x) => {
  ex:subject   <= x / ex:subject
  ex:predicate <= x / ex:predicate
  ex:object    <= x / ex:object
}
```
