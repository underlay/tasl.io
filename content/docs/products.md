# product types

_Product types_ are one of the two composite types in tasl - that means they're one of the ways that we can build "bigger" types out of smaller ones. In other contexts, they're also called _structs_, _maps_, _records_, _tuples_, _vectors_, or _objects_.

> Product types correspond to the idea of "AND" or _combination_.

A product type is written as map from URI keys to types, using curly braces `{}` and right arrows `->`. We call the entries in a product type _components_, and the two parts of each component are the _key_ (the URI) and the _value_ (the type). Each component of a product type has to be on its own line.

It's sometimes confusing to use the word "value" to refer to the type that a component maps to, but usually there's enough context to tell whether "value" means a type-in-a-component or an actual concrete instance-of-a-type value.

We've already seen several product types in action:

```tasl
namespace s http://schema.org/
namespace ex http://example.com/ns#

class s:Person {
  ex:favoriteColor -> string
  ex:birthday -> dateTime
}
```

The curly braces aren't part of the class declaration (like they would be in JavaScript, for example) - the grammar for declaring a class is just "class _uri_ _type_". The curly braces define an inline product object with two components. The first component has key `ex:favoriteColor` and value `string`; the second component has key `ex:birthday` and value `dateTime`.

The value of a product type has a value for every one of its components.

## unit types

An important special case of product types is the empty product type, also called the _unit type_.

In some ways, the unit type resembles a "null" type; in other contexts it can be used to indicate "nodes" or a raw concept of "identity". For example, here's a schema for [directed graphs](https://en.wikipedia.org/wiki/Directed_graph):

```tasl
namespace ex http://example.com/

class ex:Node {}

class ex:Edge {
  ex:source -> * ex:Node
  ex:target -> * ex:Node
}
```

Here, an instance of the schema can have many distinct _elements_ for the class `ex:Node`. But each of these elements will have the same empty unit value. What this really means is that our schema describes an _unlabelled_ directed graph: one where nodes don't have externally-accessible identity.

Unit are especially powerful when combined with coproduct types, so we'll see more examples of them in action over there.
