# Literal Types

tasl borrows its primitive types from RDF, so if you're familiar with RDF Literals and Named Nodes, you'll feel right at home. If you're not, that's okay too.

Most schema languages and type systems give us a small set of built-in primitive types to work with. For example, in TypeScript...

```typescript
type Person = {
	name: string
	age: number
}
```

... `string` and `number` are built-in primitive types. They're "primitive" because they aren't composed of other types (unlike the object type `Person`, which we would call "composite"), and they're "built-in" because the definition of what strings and numbers are (and how to represent and manipulate them) is part of the JavaScript/TypeScript spec.

Different languages have different primitive types. JavaScript just has one general-purpose `number`, but lots of languages have a bunch of more specific types instead: `double`, `int64`, `uint8`, etc. Sometimes strings are primitives, or sometimes they're actually composite types and `char` is the real primitive.

In tasl, instead of keywords like `string`, we use URIs wrapped in angle brackets as primitive types:

```tasl
namespace ex http://example.com/
namespace xsd http://www.w3.org/2001/XMLSchema#

class ex:Person {
  ex:name -> <xsd:string>;
  ex:age -> <xsd:integer>;
}
```

We call the URI inside the angle brackets a _datatype_. `<xsd:integer>` is "a literal type with datatype `xsd:integer`". Literal types are always "parametrized" by a specific datatype URI.

## Where do datatypes come from?

But how do we know what URIs to use as datatypes? And how does tasl know what they all mean? Well... we can actually use any URI that we want. tasl _doesn't_ know anything about `http://www.w3.org/2001/XMLSchema#integer`, and it doesn't need to.

From tasl's perspective, the _values_ of any literal type (regardless of its datatype) are always just UTF-8 strings. The datatype is an opaque tag - when you write mappings between schemas, tasl will check that datatypes are preserved (it won't let you map a literal with one datatype onto a literal with a different datatype), but it won't really use the datatype URI for anything else beyond that.

What datatypes _are_ for is interfacing with the outside world. Just like class and property URIs, datatypes are a social contract. In this case, there was a specification published in 2004 by the W3C that defined a big collection of datatypes under the `http://www.w3.org/2001/XMLSchema#` namespace, with very precise specs for their lexical forms (ie how to represent them all as strings). By using the datatype `xsd:integer`, you're promising that all of the values of that type will follow the specification on [this webpage](https://www.w3.org/TR/xmlschema-2/#integer) (`"42"`, `"0"`, `"-5"`, ...). This lets other people make tools that interface with instances on that assumption: for example, we could make a tool for importing an instance into a relational database that maps every literal with datatype `xsd:integer` to a native `integer not null` column, parsing an integer out of each string value based on the published spec. For datatypes that it doesn't recognize, it can always fall back to treating them as strings, since that's the baseline representation for all literal values. Datatypes are another example of using URIs to coordinate without a single central specification.

## Global variables for common XSD datatypes

This sounds like a lot of complexity - just for primitives! - but fortunately we don't usually need to think about it. The [XML Schema Definition Language](https://www.w3.org/TR/xmlschema11-2/) namespace (`http://www.w3.org/2001/XMLSchema#`) has become the go-to namespace for datatypes in RDF, and we recommend defaulting to it for general-purpose use in tasl as well.

To make this easier, the following types are declared as _global variables_ in tasl:

```tasl
namespace xsd http://www.w3.org/2001/XMLSchema#
namespace rdf http://www.w3.org/1999/02/22-rdf-syntax-ns#

type string       <xsd:string>
type boolean      <xsd:boolean>
type integer      <xsd:integer>
type double       <xsd:double>
type date         <xsd:date>
type dateTime     <xsd:dateTime>
type base64Binary <xsd:base64Binary>
type JSON         <rdf:JSON>
```

(the JSON datatype is a particularly useful "escape hatch" that we will talk about again later)

This means you don't have to remember to include the XSD namespace in every schema, and you generally don't even have to remember the angle bracket syntax. You can use these global variables just like the TypeScript example in the beginning:

```tasl
namespace ex http://example.com/

class ex:Person {
  ex:name -> string;
  ex:age -> integer;
}
```

... just remember that `string` and `integer` are _variable names_, not keywords (e.g. you could re-define them if you wanted).

Note that XSD defines many additional datatypes like [`nonNegativeInteger`](https://www.w3.org/TR/xmlschema11-2/#nonNegativeInteger), [`unsignedByte`](https://www.w3.org/TR/xmlschema11-2/#unsignedByte), [`yearMonthDuration`](https://www.w3.org/TR/xmlschema11-2/#yearMonthDuration), etc. that are not given global variable names in tasl. You're still encouraged to use these wherever you find them useful - the intent was simply to minimize the number of global terms so that they can be reasonably memorized.

As a general rule, try use the most specific XSD datatype available. If you _know_ that all of your ages will be zero or positive, you should feel free to say so:

```tasl
namespace xsd http://www.w3.org/2001/XMLSchema#
namespace ex http://example.com/

class ex:Person {
  ex:name -> string;
  ex:age -> <xsd:nonNegativeInteger>;
}
```

This approach obviously has diminishing returns - if you start using extremely specific datatype URIs (like "`ex:oddNumbersExceptFive`"), fewer tools will be able to recognize them. But you should at least assume that everybody can understand the entire XSD namespace.

## Using your own datatypes

The XSD namespace should cover most use cases, but sometimes you'll need to model a type of value that is best treated as a primitive but doesn't have a good pre-existing datatype. In that case, the best thing to do is to create your own custom datatype URI.

You should only try to do this for things that meet **all** of the following conditions:

1. representable as a UTF-8 string
2. not very large (ie you wouldn't think of it as a _file_)
3. has _internal structure_ that can be described with a formal grammar
4. would be awkward to represent as a composite type in tasl

For example, here are some **bad** candidates for custom datatypes:

- "last names" (no internal structure)
- "a first name and a last name" (better represented as a product of two literals)
- PDFs (better treated as a file outside of tasl entirely)
- "regular expressions" (not a formal specification)
- "version numbers" (not a formal specification)

... and here are some **good** candidates for custom datatypes:

- JavaScript-style regular expressions (`"^[a-z][a-zA-Z0-9]+$"`)
- [semver](https://semver.org) version numbers (`"0.15.2-rc.1"`)

Good candidates for custom datatypes generally follow a strict mini-language of their own that can't itself be naturally modeled in tasl for some reason. But if that's what you have, go for it! It's your way to signal to the world that the values are a specific format, and that people shouldn't try to mess with them unless they understand what that format is.

Just like class or property URIs, you don't need to _do_ anything to start using your own datatype. Just be sure to pick a nice stable URI that you have authority over, and if you want other people to be able to interface with it, you should definitely publish documentation somewhere.

## tl;dr

Use these as primitive types

- [`string`](https://www.w3.org/TR/xmlschema11-2/#string)
- [`boolean`](https://www.w3.org/TR/xmlschema11-2/#boolean)
- [`integer`](https://www.w3.org/TR/xmlschema11-2/#integer)
- [`double`](https://www.w3.org/TR/xmlschema11-2/#double)
- [`date`](https://www.w3.org/TR/xmlschema11-2/#date)
- [`dateTime`](https://www.w3.org/TR/xmlschema11-2/#dateTime)
- [`base64Binary`](https://www.w3.org/TR/xmlschema11-2/#base64Binary)
- [`JSON`](https://www.w3.org/TR/json-ld11/#the-rdf-json-datatype)
