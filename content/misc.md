- The tasl data model is based on [algebraic data types](https://en.wikipedia.org/wiki/Algebraic_data_type) and [this paper](https://arxiv.org/abs/1909.04881) from Shinavier and Wisnesky
- The binary format for tasl instances is extremely compact with almost no structural overhead. It's also designed to compress well under standard string compression algorithms.
- Like RDF, tasl schemas use URIs to label things.
- they're strongly typed
- they're more compact
- the data model is more expressive
- they can be easily projected onto other data models
- properties and classes are named with URIs, which makes their meaning more explicit and easier to look up

... and much more.

The data model is based on and [this paper](https://arxiv.org/abs/1909.04881) from Shinavier and Wisnesky.

## LEGO Expressions

Using tasl effectively involves a different overall approach to schema design than other languages you may be used to. tasl doesn't have built-in concepts of optional properties, enums, class inheritance, etc. Instead, you can use tasl's little grammar of types to re-create them in exactly your own terms.

For example, you can't just call something "optional", but you _can_ construct a little expression that says "either this thing, or nothing". Working with tasl ends up feeling less like annotating a system diagram and more like playing with LEGOs.

Here,

A schema has classes and types, and it only describes shapes. An _instance_ of a schema has _elements_ and _values_, which all fit the corresponding shapes of a particular schema.
