# literal types

Literal types in tasl are similar to [literals in RDF](https://www.w3.org/TR/rdf11-concepts/#section-Graph-Literal). tasl's underlying data model doesn't have a fixed set of primitive types in the way that most languages do - instead, just like RDF, you can use any URI as a _datatype_.

In RDF, Literals are defined as a tuple of three elements:

- a unicode string
- a datatype URI
- a language tag, if and only if the datatype is the special datatype ` http://www.w3.org/1999/02/22-rdf-syntax-ns#langString`

Since RDF has no concept of "types", all three of these comprise a single RDF term. However in tasl, we lift the datatype URI to the type level. A _literal type_ in tasl is parametrized with a datatype URI, and a value of that type is a Unicode string. (tasl has no concept of language tags)

Literal types are special in tasl in that they don't have an inline syntax - they can only be defined using `literal` keyword statements.

```
namespace ex http://example.com/
namespace xsd http://www.w3.org/2001/XMLSchema#

literal string xsd:string
literal integer xsd:integer
literal myCustomLiteralName ex:hello/world

class ex:Person :: {
  ex:name -> string
  ex:age -> integer
  ex:foo -> myCustomLiteralName
}
```

Here, `string`, `integer`, and `myCustomLiteralName` are all local type variables. Once we define them, we can use the bare identifiers (`string`, etc.) as type expressions later in the schema.

## where do datatypes come from?

But how do we know what URIs to use as datatypes? And how does tasl know what they all mean?

We can actually use any URI that we want. tasl _doesn't_ know anything about the URI `http://www.w3.org/2001/XMLSchema#integer`, and it doesn't need to.

From tasl's perspective, any _value_ of any literal type (regardless of its datatype) is always a Unicode string. The datatype URI is an opaque tag; when we write mappings between schemas, tasl will check that datatypes are preserved (it won't let us map a literal with one datatype onto a literal with a different datatype), but it won't really use the datatype URI for anything else beyond that.

What datatypes _are_ for is interfacing with the outside world. Just like class URIs, datatypes are a social contract. In this case, there was a specification published in 2004 by the W3C that defined a big collection of datatypes under the `http://www.w3.org/2001/XMLSchema#` namespace, with very precise specs for their lexical forms (ie how to represent them all as strings). By using the datatype `xsd:integer`, we're promising that all of the values of that type will follow the specification on [this webpage](https://www.w3.org/TR/xmlschema-2/#integer) (`"42"`, `"0"`, `"-5"`, ...). This lets other people make tools that interface with instances on that assumption: for example, someone could make a tool for importing an instance into a relational database that maps every literal with datatype `xsd:integer` to a native `INTEGER NOT NULL` column, parsing an integer out of each string value based on the XSD spec. For datatypes that it doesn't recognize, it can always fall back to treating them as Unicode strings, since that's the baseline representation for all literal values.

Datatypes are another example of using URIs for coordination.

## global variables for XSD datatypes

This sounds like a lot of complexity, especially just for primitives! What if we just want a regular type like `boolean` - do we always have to come up with a URI and declare it with a `literal` statement?

Fortunately not; tasl has some affordances to make common cases easy. In tasl, all of the datatypes from the [XSD namespace](https://www.w3.org/TR/xmlschema11-2/) (`http://www.w3.org/2001/XMLSchema#`) are defined as _global variables_, meaning you can just use them as bare identifiers without declaring them (and without declaring the XSD namespace itself).

The XSD namespace is the (somewhat) canonical default namespace for literals in RDF, and it includes essentially

fortunately we don't usually need to think about it. The [XML Schema Definition Language](https://www.w3.org/TR/xmlschema11-2/) namespace (`http://www.w3.org/2001/XMLSchema#`) has become the go-to namespace for datatypes in RDF, and we recommend defaulting to it for general-purpose use in tasl as well.

To make this easier, the following types are declared as _global variables_ in tasl:

```tasl
namespace xsd http://www.w3.org/2001/XMLSchema#

literal string             xsd:string
literal boolean            xsd:boolean
literal double             xsd:double              # float64
literal float              xsd:float               # float32
literal integer            xsd:integer
literal nonNegativeInteger xsd:nonNegativeInteger
literal long               xsd:long                # int64
literal int                xsd:int                 # int32
literal short              xsd:short               # int16
literal byte               xsd:byte                # int8
literal unsignedLong       xsd:unsignedLong        # uint64
literal unsignedInt        xsd:unsignedInt         # uint32
literal unsignedShort      xsd:unsignedShort       # uint16
literal unsignedByte       xsd:unsignedByte        # uint8
literal hexBinary          xsd:hexBinary
literal base64Binary       xsd:base64Binary
literal date               xsd:date
literal dateTime           xsd:dateTime
```

This means you don't have to remember to include the XSD namespace in every schema, and you generally don't even have to remember the `literal` statement syntax. You can just use the global variables as type expressions...

```tasl
namespace ex http://example.com/

class ex:Person :: {
  ex:name -> string
  ex:age -> integer
}
```

... but remember that `string` and `integer` are _variable names_, not keywords.

As a general rule, try use the most specific XSD datatype available. If you _know_ that all of your ages will be zero or positive, you should feel free to say so:

```tasl
namespace xsd http://www.w3.org/2001/XMLSchema#
namespace ex http://example.com/

class ex:Person {
  ex:name -> string
  ex:age -> nonNegativeInteger
}
```

Note that XSD defines many additional datatypes (e.g. [`yearMonthDuration`](https://www.w3.org/TR/xmlschema11-2/#yearMonthDuration)) that are not given global variable names in tasl. You can still use these wherever you find them useful, but you will have to declare them with a `literal` statement yourself. Be aware that there are diminishing returns on using more specific datatypes, since fewer tools will be able to recognize them.

## global variable for the JSON datatype

In addition to the XSD datatypes, tasl defines the `rdf:JSON` datatype ([described here](https://www.w3.org/TR/json-ld/#the-rdf-json-datatype)) as a global variable `JSON`.

```tasl
namespace rdf http://www.w3.org/1999/02/22-rdf-syntax-ns#

literal JSON rdf:JSON
```

The JSON datatype is a particularly useful escape hatch for semi-structured, heterogenous, or miscellaneous data.

## using your own datatypes

The literals in global namespace should cover most use cases, but sometimes you'll need to model a value that is best treated as a literal but doesn't have a good pre-existing datatype. In that case, the best thing to do is to create your own custom datatype URI.

You should only try to do this for things that meet **all** of the following conditions:

1. representable as a Unicode string
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

You don't need to _do_ anything to start using your own datatype. Just be sure to pick a nice stable URI that you have authority over, and if you want other people to be able to interface with it, you should definitely publish documentation somewhere.
