# frequently asked questions

If you have a question about tasl that isn't covered here, or if you just want to say hi, feel free to start a thread in [the Underlay category on our discourse forum](https://discourse.knowledgefutures.org/c/underlay/6).

## why does tasl exist?

tasl's simplest value proposition is that it offers a lightweight, accessible way to model data using algebraic data types.

In the longer term, we hope that tasl can provide a more structure foundation for representing data that can support kinds of uses that aren't possible today. In particular, we're interested in exploring ways to represent _partial correspondences_ between datasets in situations where the underlying ontologies do not perfectly align, but still relate in certain ways. We ultimately expect that tasl's explicit concept of _elements_ will be important for expressing these kind of correspondences.

## who is working on tasl?

tasl is a part of the [Underlay](https://underlay.org/) project, a collaboration between the [Knowledge Futures Group](https://knowledgefutures.org/) and [Protocol Labs Research](https://research.protocol.ai/).

Some discussion threads on tasl's early development can be found [here](https://discourse.knowledgefutures.org/t/minimum-viable-schemas/293), [here](https://discourse.knowledgefutures.org/t/tasl-feedback/320) and [here](https://discourse.knowledgefutures.org/t/tasl-schema-langauge-updates/332).

## should I capitalize tasl?

[xkcd rules](https://xkcd.com/about/#:~:text=How%20do%20I%20write%20%22xkcd%22%3F) apply:

> For those of us pedantic enough to want a rule, here it is: The preferred form is "xkcd", all lower-case. In formal contexts where a lowercase word shouldn't start a sentence, "XKCD" is an okay alternative. "Xkcd" is frowned upon.

Use "tasl" whenever you can, and "TASL" when you absolutely need to.

## will tasl change? how is it versioned?

The schema language and binary codec are versioned separately. The schema language uses semantic versioning and its current version is `0.1.0`; the binary format is versioned with a single incrementing major version number. and its current version is `1`.

## what does "algebraic" mean?

In math, an [_algebra_](https://en.wikipedia.org/wiki/Algebra_over_a_field) is any little system that starts with a some initial things, and has two different ways of combining things to get more things.

In the algebra that's taught in high school, the initial things are numbers and variables, and the two ways of combining them are addition and multiplication. In that context, an "algebraic expression" is something like `(x * 4) + (y * (x + 1))` - a composite thing built up from some initial terms and assembled using `*` and `+`.

The algebra that tasl deals with is one where the expressions are _types_. Here, instead of numbers and variables, our initial terms are primitive types like `string` and `date`, and our two ways of combining them are called _product_ and _coproduct_. These are known as [algebraic data types](https://en.wikipedia.org/wiki/Algebraic_data_type).

## why are URIs and literals different?

This is also a distinction in RDF - Named Nodes are different than Literals. In tasl, we wanted a sharp distinction between values that are _identifiers_ and values that just represent themselves. The URI type is supposed to indicate that the values can be used to interface with other systems. In the binary format, they're serialized the same way, but other tools like tasl-native databases may want to index them differently.
