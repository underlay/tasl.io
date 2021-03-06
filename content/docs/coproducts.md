# coproduct types

_Coproduct types_ are the other kind of composite types in tasl. They're also known as [_discriminated unions_](https://en.wikipedia.org/wiki/Tagged_union), _sums_, or _variants_.

> Coproducts correspond to the idea of "OR" or _alternatives_.

Similar to product types, coproduct types map URI keys to types, but they're written using square brackets `[]` and left arrows `<-`. We call the entries of a coproduct type _options_. The two parts of each option are the _key_ (the URI) and the _value_ (the type).

Just like products, each option of a coproduct has to be on its own line.

Use coproducts when you need to model a value that can be one of several different conceptual options:

```tasl
namespace ex http://example.com/

class ex:Person {
  ex:name -> string
}

class ex:Corporation {
  ex:name -> string
  ex:ownedBy -> [
    ex:ownedByPerson <- * ex:Person
    ex:ownedByCorporation <- * ex:Corporation
  ]
}
```

Notice how we have to explicitly label each option (`ex:ownedByPerson` and `ex:ownedByCorporation`) with a URI.

Here's a slightly different example, where a coproduct is used to represent multiple distinct formats that a value might be in:

```tasl
namespace ex http://example.com/

class ex:BookStore {
  ex:name -> string
  ex:location -> [
    ex:coordinates <- {
      ex:lat -> double
      ex:long -> double
    }
    ex:address <- {
      ex:street -> string
      ex:city -> string
      ex:state -> string
      ex:zipCode -> string
    }
  ]
}

```

A value of a coproduct type has a value for exactly **one** of its options, and it also knows explicitly which option it is. This is different than regular _union types_, which are more common in programming langauges. For example, in TypeScript, this type...

```typescript
type hello = string | string
```

... behaves exactly like the regular type `string` - a value of type `hello` will be a string like `"world"`. But in tasl, if we have a coproduct...

```tasl
namespace ex http://example.com/

type hello [
  ex:a <- string
  ex:b <- string
]
```

... a value of type `hello` will be a string _tagged with an explicit option key_: something like `(ex:a, "world")` or `(ex:b, "world")`. This is why coproduct are also called _tagged unions_.

## enums

One really powerful way to use coproducts is to make a "coproduct of units":

```tasl
namespace ex http://example.com/

class ex:IssueTicket {
  ex:title -> string
  ex:content -> string
  ex:status -> [
    ex:notStarted <- {}
    ex:inProgress <- {}
    ex:closed <- {}
  ]
}
```

An instance element of the `ex:IssueTicket` class will be a product value with a string `ex:title` and a string `ex:content`. But what kind of value will be in the `ex:status` component?

Unit types only have one possible value: the unit value. This means there are only three possible values for the `ex:status` coproduct:

- `(ex:notStarted, <the unit value>)`
- `(ex:inProgress, <the unit value>)`
- `(ex:inProgress, <the unit value>)`

The value `<the unit value>` is redundant; the only information that a value of the `ex:status` coproduct carries is its URI option tag. What we're really representing is an [_enumerated type_](https://en.wikipedia.org/wiki/Enumerated_type) (aka an _enum_) where the enumerations are the option tags.

In tasl, you can abbreviate a coproduct of units by ommitting the `<- {}` entirely, like this:

```tasl
namespace ex http://example.com/

class ex:IssueTicket {
  ex:title -> string
  ex:content -> string
  ex:status -> [
    ex:notStarted
    ex:inProgress
    ex:closed
  ]
}
```

You can only do this for coproducts. For example,

```tasl
namespace ex http://example.com/

class ex:Thing {
  ex:widget
}
```

is not valid tasl.

Sometimes you want to create a sort of hybrid enum type that has data associated with some of the options, but not all. You can still use the abbreviated syntax for any unit options, and use the expanded `<-` syntax for the options you want to associate with other types:

```tasl
namespace ex http://example.com/

class ex:IssueTicket {
  ex:title -> string
  ex:content -> string
  ex:status -> [
    ex:notStarted
    ex:inProgress <- {
      ex:startDate -> dateTime
    }
    ex:closed <- {
      ex:startDate -> dateTime
      ex:endDate -> dateTime
    }
  ]
}
```

You should use enums as much as possible! They're appropriate for anything that has a discrete, finite number of possible states or statuses. In most cases you'll find that enums can replace boolean literals, and you should prefer enums whenever there are natural names for the two possible states. For example, this schema:

```tasl
namespace ex http://example.com/

class ex:Person {
  ex:name -> string
  ex:isDeceased -> boolean
}
```

... is actually better rewritten like this:

```tasl
namespace ex http://example.com/

class ex:Person {
  ex:name -> string
  ex:status -> [
    ex:living
    ex:deceased
  ]
}
```

This makes schemas easier to migrate and easier to read (for example, we avoid having to parse a double-negative `isDeceased: false`). But if there aren't natural, descriptive names for the two states that a boolean represents, just stick with a literal type.

## optional values

We can use the coproduct + unit pattern to model _optional properties_. Here we have a schema that models people, each of whom may or may not have a favorite book:

```tasl
namespace ex http://example.com/

class ex:Person {
  ex:name -> string
  ex:favoriteBook -> [
    ex:doesNotHaveAFavoriteBook <- {}
    ex:hasAFavoriteBook <- * ex:Book
  ]
}

class ex:Book {
  ex:title -> string
  ex:isbn -> <>
}
```

This kind of structure - a coproduct of a unit and something else - is so common that it would be tedious to keep re-inventing descriptive terms for the "something" and "nothing" cases of coproducts. The Underlay namespace has general-purpose terms for these that we can use instead:

- `http://underlay.org/ns/some`
- `http://underlay.org/ns/none`

```tasl
namespace ul http://underlay.org/ns/
namespace ex http://example.com/

class ex:Person {
  ex:name -> string
  ex:favoriteBook -> [
    ul:none
    ul:some <- * ex:Book
  ]
}

class ex:Book {
  ex:title -> string
  ex:isbn -> <>
}
```

You should use the optional coproduct pattern whenever a value might or might not exist. In some schemas, you might end up writing it almost everywhere. But don't make an automatic habit out of making things optional - it's good to explicitly say that things are required whenever they really are.
