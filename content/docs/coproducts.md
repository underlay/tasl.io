# coproduct types

_Coproduct types_ are the other kind of composite types in tasl. They're also known as [_discriminated unions_](https://en.wikipedia.org/wiki/Tagged_union), _sums_, or _variants_.

> Coproducts correspond to the idea of "OR" or _alternatives_.

Similar to product types, coproduct types map URI keys to types, but they're written using square brackets `[]` and left arrows `<-`. We call the slots of a coproduct type its _options_. The two parts of each option are its _key_ (the URI) and its _value_ (the type).

Just like products, the options of a coproduct have to be on their own line.

Use coproducts when you need to model a value that can be one of several different conceptual options:

```tasl
namespace ex http://example.com/

class ex:Person :: {
  ex:name -> string
}

class ex:Corporation :: {
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

class ex:BookStore :: {
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

A value of a coproduct type has a value for exactly **one** of its options, _and it also knows explicitly which option it is_. This is different than regular _union types_, which are more common in programming langauges. For example, in TypeScript, this type:

```
type hello = string | string
```

... behaves exactly like the regular type `string` - a value of type `hello` will be a string like `"world"`. But in tasl, if we have a coproduct

```tasl
namespace ex http://example.com/

type hello [
  ex:a <- string
  ex:b <- string
]
```

a value of type `hello` will be a string tagged with an option key: something like `(ex:a, "world")` or `(ex:b, "world")`. This is why coproduct are also called _tagged unions_.

## Enums

One really powerful way to use coproducts is to make a "coproduct of units":

```tasl
namespace ex http://example.com/

class ex:IssueTicket :: {
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

class ex:IssueTicket :: {
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

```
namespace ex http://example.com/

type test {
  ex:hello
}
```

is not valid tasl.

Sometimes you want to create a sort of hybrid enum type that has data associated with some of the options, but not all. You can still use the abbreviated syntax for any unit options, and use the expanded `<-` syntax for the options you want to associate with other types:

```tasl
namespace ex http://example.com/

class ex:IssueTicket :: {
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

You should use enums as much as possible. They're appropriate for anything that has a discrete, finite number of possible states or statuses. In most cases you'll find that enums can replace boolean literals, and you should prefer enums whenever there are natural names for the two possible states. For example, this schema:

```tasl
namespace ex http://example.com/

class ex:Person :: {
  ex:name -> string
  ex:isDeceased -> boolean
}
```

... is actually better rewritten like this:

```tasl
namespace ex http://example.com/

class ex:Person :: {
  ex:name -> string
  ex:status -> [
    ex:living
    ex:deceased
  ]
}
```

This makes schemas easier to migrate and easier to read (for example, we avoid having to parse a double-negative `isDeceased: false`). But if there aren't natural, descriptive names for the two states that a boolean represents, just stick with a literal type.

## Optional values

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

This kind of structure - a coproduct of a unit and something else - is so common that tasl has a special shorthand syntax for it. In tasl, the _optional operator_ `? (type)` expands to a coproduct

```
[
  ul:none <- {}
  ul:some <- (type)
]
```

This is really convenient because it means we don't have to worry about naming the two options `ex:doesNotHaveAFavoriteBook` and `ex:hasAFavoriteBook`, we can just write:

```tasl
namespace ex http://example.com/

class ex:Person {
  ex:name -> string

  # the `?` is the optional operator.
  # it turns the type `* ex:Book` into the type
  # [
  #   ul:none
  #   ul:some <- * ex:Book
  # ]
  ex:favoriteBook -> ? * ex:Book
}

class ex:Book {
  ex:title -> string
  ex:isbn -> <>
}
```

The full URIs that the optional operator uses for its option keys are `http://underlay.org/ns/some` and `http://underlay.org/ns/none`, but we canonically abbreviate them using the `ul` prefix. You don't have to declare this namespace in your schema in order to use the optional operator, but it good to keep in mind that the option keys are still there, they're just hidden defaults.

You should use the optional operator whenever a value might or might not exist. In some schemas, you might end up using the optional operator almost everywhere. But don't make an automatic habit out of making things optional - it's good to explicitly say that things are required whenever they really are.
